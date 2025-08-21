import { z } from "zod";

export const fabApprovalMailSchema = z.object({
    hp: z.string().min(4, "HP must be at least 4 characters").max(255),
    client: z.string().max(255),
    spool_name: z.string().max(255),
    drawing_ref: z.string().max(255),
    status: z.enum(["APPROVED", "DECLINED"]),
    status_changed_by: z.string().max(255),
    status_change_date: z
        .string()
        .min(3, "Status change date must be at least 10 characters")
        .max(255),
});
