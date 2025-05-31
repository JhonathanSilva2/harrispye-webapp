import { z } from "zod";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ACCEPTED_FILE_TYPES = ["application/pdf"];
export const FabDrawingSchema = z.object({
    file: z
        .custom<File>(
            (val) => val instanceof File,
            "Formato de arquivo inválido.",
        )
        .refine(
            (file) => file.size <= MAX_FILE_SIZE,
            "O tamanho máximo do arquivo é 100MB.",
        )
        .refine(
            (file) => ACCEPTED_FILE_TYPES.includes(file.type),
            "Apenas .pdf são suportados.",
        ),
    description: z.string().min(1, "A descrição é obrigatória."),
});

export type FabDrawingSchemaFormData = z.infer<typeof FabDrawingSchema>;
