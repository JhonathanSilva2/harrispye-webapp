import { z } from "zod";

export const storageDeleteSchema = z.object({
    filename: z
        .string()
        .min(4, "Filename must be at least 4 characters")
        .max(255, "Filename must be at most 255 characters"),
});
