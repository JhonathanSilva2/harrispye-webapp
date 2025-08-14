import { prismaBase } from "@/db/base-client";
import { $Enums } from "prisma/generated/client-hp-base";

export async function fetchPermission({
    user_organizations_id,
    user_localizations_id,
    user_roles_id,
    user_clearance,
}: {
    user_organizations_id: number;
    user_localizations_id: number;
    user_roles_id: number;
    user_clearance: $Enums.user_clearance;
}) {
    const permissions =
        await prismaBase.fabrication_monitoring_permissions.findFirst({
            where: {
                user_organizations_id,
                user_localizations_id,
                user_roles_id,
                user_clearance,
            },
            omit: {
                user_organizations_id: true,
                user_localizations_id: true,
                user_roles_id: true,
            },
        });

    return permissions;
}
