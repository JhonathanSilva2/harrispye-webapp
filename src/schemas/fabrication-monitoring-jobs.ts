import { z } from "zod";

// Schema de criação
export const fabricationMonitoringJobCreateSchema = z
	.object({
		hp: z.string().min(4, "HP must be at least 4 characters").max(255),
		client: z
			.string()
			.min(3, "Client must be at least 3 characters")
			.max(255),
		po_number: z
			.string()
			.min(3, "PO number must be at least 3 characters")
			.max(255),
		contract_delivery_date: z.preprocess((arg) => {
			if (typeof arg === "string" || arg instanceof Date) {
				return new Date(arg);
			}
			return arg;
		}, z.date()),
		expected_delivery_date: z.preprocess((arg) => {
			if (typeof arg === "string" || arg instanceof Date) {
				return new Date(arg);
			}
			return arg;
		}, z.date()),
		mr_number: z
			.string()
			.min(2, "MR number must be at least 2 characters")
			.max(255)
			.optional(),
		shutdown_id: z
			.string()
			.min(2, "Shutdown ID must be at least 2 characters")
			.max(255)
			.optional(),
	})
	.strict();

// Schema de atualização
export const fabricationMonitoringJobUpdateSchema =
	fabricationMonitoringJobCreateSchema
		.extend({
			id: z.number().int().min(1, "ID must be at least 1").optional(), // O id é obrigatório na atualização
			hp: z
				.string()
				.min(4, "HP must be at least 4 characters")
				.max(255)
				.optional(),
			client: z
				.string()
				.min(3, "Client must be at least 3 characters")
				.max(255)
				.optional(),
			po_number: z
				.string()
				.min(3, "PO number must be at least 3 characters")
				.max(255)
				.optional(),
			contract_delivery_date: z
				.preprocess((arg) => {
					if (typeof arg === "string" || arg instanceof Date) {
						return new Date(arg);
					}
					return arg;
				}, z.date())
				.optional(),
			expected_delivery_date: z
				.preprocess((arg) => {
					if (typeof arg === "string" || arg instanceof Date) {
						return new Date(arg);
					}
					return arg;
				}, z.date())
				.optional(),
		})
		.strict();
