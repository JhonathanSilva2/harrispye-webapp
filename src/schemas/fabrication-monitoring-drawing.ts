import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "application/pdf",
];

export const FabDrawingSchema = z.object({
    file: z
        .custom<FileList>(
            (val) => val instanceof FileList,
            "Formato de arquivo inválido.",
        )
        .refine(
            (files) => files && files.length > 0,
            "Por favor, envie um arquivo.",
        )
        .transform((files) => files[0] as File)
        .refine(
            (file) => file.size <= MAX_FILE_SIZE,
            `O tamanho máximo do arquivo é 5MB.`,
        )
        .refine(
            (file) => ACCEPTED_FILE_TYPES.includes(file.type),
            "Apenas os formatos .jpg, .jpeg, .png, .webp e .pdf são suportados.",
        ),
    description: z.string().min(1, "A descrição é obrigatória."),
});

export type FabDrawingSchemaFormData = z.infer<typeof FabDrawingSchema>;
