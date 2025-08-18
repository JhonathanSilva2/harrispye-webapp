import { prismaBase } from "@/db/base-client";
import { $Enums, Prisma } from "prisma/generated/client-hp-base";

const permissionsShape =
    Prisma.validator<Prisma.fabrication_monitoring_permissionsDefaultArgs>()({
        omit: {
            user_organizations_id: true,
            user_localizations_id: true,
            user_roles_id: true,
            user_clearance: true,
        },
    });
export type FabMonSpoolsPermission =
    Prisma.fabrication_monitoring_permissionsGetPayload<
        typeof permissionsShape
    >;

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
}): Promise<FabMonSpoolsPermission | null> {
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
                user_clearance: true,
            },
        });

    return permissions;
}
