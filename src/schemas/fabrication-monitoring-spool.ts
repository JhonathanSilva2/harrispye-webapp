import { z } from "zod";

// Schema de criação
export const fabricationMonitoringUpdateSpoolSchema = z
	.object({
		spec: z
			.string()
			.min(2, "Spec must be at least 2 characters")
			.max(255)
			.optional(),
		// decimal
		mass: z
			.number()
			.min(0, "Mass must be at least 0") // Validação para garantir que a massa não seja negativa
			.optional(),
		price_per_kg: z
			.number()
			.min(0, "Pricer per kg must be at least 0") // Validação para garantir que a massa não seja negativa
			.optional(),
		gross_spool_cost: z
			.number()
			.min(0, "gross spool cost must be at least 0") // Validação para garantir que a massa não seja negativa
			.optional(),
		description: z
			.string()
			.min(3, "Description must be at least 3 characters")
			.max(255)
			.optional(),
		drawing_ref: z
			.string()
			.min(3, "Drawing ref must be at least 3 characters")
			.max(255)
			.optional(),
		spool_number: z
			.string()
			.min(3, "Spool number must be at least 3 characters")
			.max(255)
			.optional(),
		materials_ordered: z
			.number()
			.int()
			.min(0, "Materials ordered must be at least 0")
			.optional(),
		materials_arrived: z
			.number()
			.int()
			.min(0, "Materials arrived must be at least 0")
			.optional(),
		fabrication_complete: z
			.number()
			.int()
			.min(0, "Fabrication Complete Arrived must be at least 0")
			.optional(),
		ndt_complete: z
			.number()
			.int()
			.min(0, "NDT Arrived must be at least 0")
			.optional(),
		pressure_test: z
			.number()
			.int()
			.min(0, "Pressure Test  must be at least 0")
			.optional(),
		internal_coating: z
			.number()
			.int()
			.min(0, "Internal Coating  must be at least 0")
			.optional(),
		external_coating: z
			.number()
			.int()
			.min(0, "External Coating  must be at least 0")
			.optional(),
		packing: z
			.number()
			.int()
			.min(0, "Packing must be at least 0")
			.optional(),
		dispatch: z
			.number()
			.int()
			.min(0, "Dispatch must be at least 0")
			.optional(),
		notes: z
			.string()
			.min(3, "Notes must be at least 3 characters")
			.max(255)
			.optional(),
		client_approval: z.enum(["PENDING", "APPROVED", "DECLINED"]).optional(),
		updated_by: z
			.number()
			.int()
			.min(3, "updated_by must be at least 3")
			.optional(),
	})
	.strict();
