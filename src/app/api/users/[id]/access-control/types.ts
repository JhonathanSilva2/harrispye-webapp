import { $Enums } from "@prisma/client";

export type UserAccessControl = {
    feature: string;
    id: number;
    user_id: number;
    feature_id: number;
    action: $Enums.user_access_control_action;
    start_at: Date;
    end_at: Date | null;
}[];
