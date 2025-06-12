import { $Enums } from "@prisma/client";

export interface FetchUserAccessControl {
    id: number;
}

export interface CreateUserAccessControl extends FetchUserAccessControl {
    feature: string;
    action: $Enums.user_access_control_action;
}
