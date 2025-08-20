import {
    ADMIN_FAB_MON_SPOOLS_PERMISSION,
    DEFAULT_FAB_MON_SPOOLS_PERMISSION,
} from "@/lib/constants/permissions";
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
        if (!session || !session.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        const user = session.user;

        if (user.is_admin) {
            return NextResponse.json(ADMIN_FAB_MON_SPOOLS_PERMISSION, {
                status: 200,
            });
        }

        if (!user.userAttributes) {
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
            permissions = DEFAULT_FAB_MON_SPOOLS_PERMISSION;
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
