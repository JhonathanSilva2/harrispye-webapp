import { prismaBase } from "@/db/base-client";
import assert from "assert";
import { capitalize } from "lodash";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import {
    TDepartmentAttribute,
    TLocalizationAttribute,
    TOrganizationAttribute,
    TRoleAttribute,
} from "../../type";
import options from "../../auth/[...nextauth]/options";
import {
    BRAZIL_LOCALIZATION_ID,
    CLIENT_APPROVER_ROLE_ID,
    CLIENT_GUEST_ROLE_ID,
} from "../_utils/constants";
import { buildClientPermissionPayload } from "../_utils/permissions";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ attribute: string }> },
) {
    try {
        const attribute = (await params).attribute;
        let requestedAttribute:
            | TDepartmentAttribute[]
            | TLocalizationAttribute[]
            | TOrganizationAttribute[]
            | TRoleAttribute[] = [];
        switch (attribute) {
            case "departments":
                requestedAttribute = await prismaBase.user_departments.findMany(
                    {
                        select: {
                            id: true,
                            department: true,
                        },
                    },
                );
                break;
            case "localizations":
                requestedAttribute =
                    await prismaBase.user_localizations.findMany({
                        select: {
                            id: true,
                            localization: true,
                        },
                    });
                break;
            case "organizations":
                requestedAttribute =
                    await prismaBase.user_organizations.findMany({
                        select: {
                            id: true,
                            organization: true,
                        },
                    });
                break;
            case "roles":
                requestedAttribute = await prismaBase.user_roles.findMany({
                    select: {
                        id: true,
                        role: true,
                    },
                });
                break;
            default:
                throw new Error("Invalid attribute");
        }
        return NextResponse.json(requestedAttribute, { status: 200 });
    } catch (err) {
        assert(err instanceof Error);
        return new NextResponse(err.message, { status: 500 });
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ attribute: string }> },
) {
    try {
        const attribute = (await params).attribute;
        const session = await getServerSession(options);
        const user = session?.user;
        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await request.json();
        if (!body.newAttribute) {
            return new NextResponse("Must provide new attribute value", {
                status: 400,
            });
        }

        const data = {
            created_by: user.id,
        };

        try {
            switch (attribute) {
                case "departments":
                    await prismaBase.user_departments.create({
                        data: {
                            ...data,
                            department: body.newAttribute,
                        },
                    });
                    break;
                case "localizations":
                    await prismaBase.user_localizations.create({
                        data: {
                            ...data,
                            localization: body.newAttribute,
                        },
                    });
                    break;

                case "organizations":
                    try {
                        await prismaBase.$transaction(async (tx) => {
                            const organization =
                                await tx.user_organizations.create({
                                    data: {
                                        ...data,
                                        organization: body.newAttribute,
                                    },
                                });
                            const clientApproverPayload =
                                buildClientPermissionPayload({
                                    organizationId: organization.id,
                                    roleId: CLIENT_APPROVER_ROLE_ID,
                                    clientApproval: "ALL",
                                });
                            const clientGuestPayload =
                                buildClientPermissionPayload({
                                    organizationId: organization.id,
                                    roleId: CLIENT_GUEST_ROLE_ID,
                                    clientApproval: "NONE",
                                });

                            // Add CLIENT_APPROVER permissions
                            await tx.fabrication_monitoring_permissions.create({
                                data: clientApproverPayload,
                            });
                            // Add CLIENT_GUEST permissions
                            await tx.fabrication_monitoring_permissions.create({
                                data: clientGuestPayload,
                            });
                        });

                        return NextResponse.json(
                            { message: "Organization created successfully" },
                            { status: 201 },
                        );
                    } catch (err) {
                        assert(err instanceof Error);
                        return new NextResponse(err.message, { status: 500 });
                    }

                case "roles":
                    await prismaBase.user_roles.create({
                        data: {
                            role: body.newAttribute,
                            created_by: user.id,
                        },
                    });
                    break;
                default:
                    throw new Error("Invalid attribute");
            }
        } catch (err) {
            assert(err instanceof Error);
            return new NextResponse(err.message, { status: 500 });
        }

        return NextResponse.json(
            {
                message: `${capitalize(attribute)} created successfully`,
            },
            { status: 201 },
        );
    } catch (err) {
        assert(err instanceof Error);
        return new NextResponse(err.message, { status: 500 });
    }
}
