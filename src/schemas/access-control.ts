import { z } from "zod";

export const AccessControlForm = z.object({
    id: z.string().min(1, "Something went wrong"),
    feature: z.string().min(3, "Feature should be at least 3 characters"),
    action: z.string().min(1, "Select an action"),
    description: z
        .string()
        .max(50, "Description shouldn't be too long")
        .optional(),
});

export type AccessControlFormData = z.infer<typeof AccessControlForm>;
