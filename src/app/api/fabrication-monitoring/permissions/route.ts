import assert from "assert";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import options from "../../auth/[...nextauth]/options";
import {
    FabMonSpoolsPermission,
    fetchPermission,
} from "./_action/fetch-permission";

export async function GET(
    req: NextRequest,
): Promise<NextResponse<FabMonSpoolsPermission | { error: string }>> {
    try {
        const session = await getServerSession(options);
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        const user = session.user;
        if (!user || !user.userAttributes) {
            return NextResponse.json(
                { error: "User attributes not found in session." },
                { status: 404 },
            );
        }

        const organization_id = user.userAttributes.user_organizations?.id;
        const localization_id = user.userAttributes.user_localizations?.id;
        const role_id = user.userAttributes.user_roles?.id;
        const clearance = user.userAttributes.clearance;

        if (!organization_id || !localization_id || !role_id || !clearance) {
            return NextResponse.json(
                { error: "User attributes are incomplete." },
                { status: 422 },
            );
        }

        let permissions: FabMonSpoolsPermission | null = await fetchPermission({
            user_organizations_id: organization_id,
            user_localizations_id: localization_id,
            user_roles_id: role_id,
            user_clearance: clearance,
        });

        if (!permissions) {
            console.error(
                "Permission not found for the given user context: ",
                JSON.stringify({
                    user_id: user.id,
                    email: user.email,
                }),
            );
            permissions = {
                add_spools: false,
                delete_spools: false,
                spec: "NONE",
                mass: "NONE",
                price_per_kg: "NONE",
                gross_spool_cost: "NONE",
                description: "NONE",
                drawing_ref: "NONE",
                spool_number: "NONE",
                materials_ordered: "NONE",
                materials_arrived: "NONE",
                fabrication_complete: "NONE",
                scan_3d: "NONE",
                ndt_complete: "NONE",
                pressure_test: "NONE",
                internal_coating: "NONE",
                external_coating: "NONE",
                packing: "NONE",
                dispatch: "NONE",
                notes: "NONE",
                client_approval: "NONE",
                manager_approval: "NONE",
                graph: false,
                summary: false,
            };
        }

        if (user.is_admin) {
            for (const key in permissions) {
                const value = (permissions as Record<string, unknown>)[key];
                if (typeof value === "boolean") {
                    (permissions as Record<string, unknown>)[key] = true;
                } else if (typeof value === "string") {
                    (permissions as Record<string, unknown>)[key] = "ALL";
                }
            }
        }

        return NextResponse.json(permissions, {
            status: 200,
        });
    } catch (error) {
        assert(error instanceof Error);
        console.error("Error fetching permissions: ", error);
        return NextResponse.json(
            { error: "Unexpected Error" },
            { status: 500 },
        );
    }
}
