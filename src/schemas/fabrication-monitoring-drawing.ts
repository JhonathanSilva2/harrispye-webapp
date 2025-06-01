import { z } from "zod";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ACCEPTED_FILE_TYPES = ["application/pdf"];
export const FabDrawingSchema = z.object({
    file: z
        .custom<File>((val) => val instanceof File, "Invalid file format.")
        .refine(
            (file) => file.size <= MAX_FILE_SIZE,
            "The maximum file size is 100MB.",
        )
        .refine(
            (file) => ACCEPTED_FILE_TYPES.includes(file.type),
            "Only .pdf file types are supported.",
        ),
    description: z.string().min(1, "Description is required."),
});

export type FabDrawingSchemaFormData = z.infer<typeof FabDrawingSchema>;
