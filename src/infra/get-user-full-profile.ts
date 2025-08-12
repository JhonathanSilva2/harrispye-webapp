import { TAccessControl, UserFullProfile, UserProfile } from "@/app/types";
import { Prisma } from "prisma/generated/client-hp-base";

export default async function getUserFullProfile(
    user: UserProfile,
    tx: Prisma.TransactionClient,
): Promise<UserFullProfile> {
    const managerId = user.direct_manager;

    const [manager, department, userAttributes, userAccessControlRaw] =
        await Promise.all([
            tx.users.findFirst({
                where: {
                    hp_registration: managerId,
                },
                select: {
                    hp_registration: true,
                    display_name: true,
                    username: true,
                    role: true,
                },
            }),
            tx.departments.findFirst({
                where: {
                    id: user.department || 0,
                },
                select: {
                    department: true,
                },
            }),
            tx.user_attributes.findUnique({
                where: {
                    user_id: user.id,
                },
                select: {
                    id: true,
                    user_id: true,
                    user_departments: {
                        select: {
                            id: true,
                            department: true,
                        },
                    },
                    user_localizations: {
                        select: {
                            id: true,
                            localization: true,
                        },
                    },
                    user_organizations: {
                        select: {
                            id: true,
                            organization: true,
                        },
                    },
                    user_roles: {
                        select: {
                            id: true,
                            role: true,
                        },
                    },
                    clearance: true,
                },
            }),
            tx.user_access_control.findMany({
                where: {
                    AND: [
                        {
                            user_id: user.id,
                        },
                        {
                            OR: [
                                {
                                    end_at: {
                                        equals: null,
                                    },
                                },
                                {
                                    end_at: {
                                        gte: new Date(),
                                    },
                                },
                            ],
                        },
                    ],
                },
                select: {
                    action: true,
                    user_access_control_features: {
                        select: {
                            feature: true,
                        },
                    },
                },
            }),
        ]);
    let userAccessControl: TAccessControl[] | null = null;
    if (userAccessControlRaw) {
        userAccessControl = userAccessControlRaw.map((uac) => {
            return {
                action: uac.action,
                feature: uac.user_access_control_features.feature,
            };
        });
    }

    return {
        ...user,
        manager,
        department,
        userAttributes,
        userAccessControl,
    } as unknown as UserFullProfile;
}
