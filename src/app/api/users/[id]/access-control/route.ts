import { prismaBase } from "@/db/base-client";
import assert from "assert";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const id = (await params).id;
        const parsedId = id ? parseInt(id) : null;

        if (!parsedId) {
            return NextResponse.json(
                { message: "ID is required" },
                { status: 400 },
            );
        }

        const fetchUserAccessControl =
            await prismaBase.user_access_control.findMany({
                where: {
                    user_id: parsedId,
                    OR: [{ end_at: null }, { end_at: { gt: new Date() } }],
                },
                include: {
                    user_access_control_features: {
                        select: {
                            id: true,
                            feature: true,
                        },
                    },
                },
            });

        const userAccessControl = fetchUserAccessControl.map(
            ({ user_access_control_features, ...rest }) => {
                const feature = user_access_control_features.feature;
                return {
                    ...rest,
                    feature,
                };
            },
        );

        return new NextResponse(JSON.stringify(userAccessControl), {
            headers: {
                "content-type": "application/json",
            },
        });
    } catch (err) {
        assert(err instanceof Error);
        return new NextResponse(err.message, { status: 500 });
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const id = (await params).id;
        const parsedId = id ? parseInt(id) : null;

        if (!parsedId) {
            return NextResponse.json(
                { message: "ID is required" },
                { status: 400 },
            );
        }

        const body = await request.json();
        const { feature, action, description } = body;
        let { startAt, endAt } = body;

        if (!feature || !action) {
            return NextResponse.json(
                { message: "Feature ID and action are required" },
                { status: 400 },
            );
        }

        let featureId = await prismaBase.user_access_control_features.findFirst(
            {
                where: {
                    feature,
                },
            },
        );

        if (!featureId) {
            featureId = await prismaBase.user_access_control_features.create({
                data: {
                    feature,
                    description:
                        typeof description === "string" ? description : null,
                },
            });

            if (!featureId) {
                return NextResponse.json(
                    {
                        message:
                            "An Internal error occorred when trying to create feature",
                    },
                    { status: 500 },
                );
            }
        }

        if (!startAt) {
            startAt = new Date();
        }
        if (!endAt) {
            endAt = null;
        }

        const userHasPermission =
            await prismaBase.user_access_control.findFirst({
                where: {
                    AND: [
                        { user_id: parsedId },
                        { feature_id: featureId.id },
                        { action },
                        {
                            OR: [
                                { end_at: null },
                                { end_at: { gt: new Date() } },
                            ],
                        },
                    ],
                },
            });

        if (userHasPermission) {
            return NextResponse.json(
                { message: "User already has this permission" },
                { status: 400 },
            );
        }

        const userAccessControl = await prismaBase.user_access_control.create({
            data: {
                user_id: parsedId,
                feature_id: featureId.id,
                action,
                start_at: startAt,
                end_at: endAt,
            },
        });

        return new NextResponse(JSON.stringify(userAccessControl), {
            headers: {
                "content-type": "application/json",
            },
        });
    } catch (err) {
        assert(err instanceof Error);
        return new NextResponse(err.message, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const id = (await params).id;
        const parsedId = id ? parseInt(id) : null;

        if (!parsedId) {
            return NextResponse.json(
                { message: "ID is required" },
                { status: 400 },
            );
        }

        const body = await request.json();

        const { feature, action } = body;
        if (!feature || !action) {
            return NextResponse.json(
                { message: "Feature ID and action are required" },
                { status: 400 },
            );
        }

        const featureId =
            await prismaBase.user_access_control_features.findFirst({
                where: {
                    feature,
                },
            });

        if (!featureId) {
            return NextResponse.json(
                { message: "Feature not found" },
                { status: 404 },
            );
        }

        const userAccessControlId =
            await prismaBase.user_access_control.findFirst({
                where: {
                    AND: [
                        { user_id: parsedId },
                        { feature_id: featureId.id },
                        { action },
                        {
                            OR: [
                                { end_at: null },
                                { end_at: { gt: new Date() } },
                            ],
                        },
                    ],
                },
                select: {
                    id: true,
                },
            });

        if (!userAccessControlId) {
            return NextResponse.json(
                { message: "User access control not found" },
                { status: 404 },
            );
        }

        const userAccessControl = await prismaBase.user_access_control.update({
            where: {
                id: userAccessControlId.id,
            },
            data: {
                end_at: new Date(Date.now() - 1000), // subtracts 1 second to avoid being caught by the refetch
            },
        });

        return new NextResponse(JSON.stringify(userAccessControl), {
            headers: {
                "content-type": "application/json",
            },
        });
    } catch (err) {
        assert(err instanceof Error);
        return new NextResponse(err.message, { status: 500 });
    }
}
