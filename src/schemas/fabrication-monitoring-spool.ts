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
        m2_fbe: z
            .number()
            .min(0, "m² FBE must be at least 0") // Validação para garantir que a massa não seja negativa
            .optional(),
        m2_galvanized: z
            .number()
            .min(0, "m² Galvanized must be at least 0") // Validação para garantir que a massa não seja negativa
            .optional(),
        m2_price: z
            .number()
            .min(0, "m² must be at least 0") // Validação para garantir que a massa não seja negativa
            .optional(),
        price_per_kg: z
            .number()
            .min(0, "Price per kg must be at least 0") // Validação para garantir que a massa não seja negativa
            .optional(),
        gross_spool_cost: z
            .number()
            .min(0, "Gross spool cost must be at least 0") // Validação para garantir que a massa não seja negativa
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
            .min(0, "Fabrication Complete must be at least 0")
            .optional(),
        scan_3d: z
            .number()
            .int()
            .min(0, "3D Scan must be at least 0")
            .optional(),
        ndt_complete: z
            .number()
            .int()
            .min(0, "NDT must be at least 0")
            .optional(),
        pressure_test: z
            .number()
            .int()
            .min(0, "Pressure Test must be at least 0")
            .optional(),
        internal_coating: z
            .number()
            .int()
            .min(0, "Internal Coating must be at least 0")
            .optional(),
        external_coating: z
            .number()
            .int()
            .min(0, "External Coating must be at least 0")
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
        manager_approval: z
            .enum(["PENDING", "APPROVED", "DECLINED"])
            .optional(),

        updated_by: z
            .number()
            .int()
            .min(3, "updated_by must be at least 3")
            .optional(),
        fabrication_monitoring_design_id: z
            .number()
            .int()
            .min(1, "fabrication_monitoring_design_id must be at least 1")
            .optional(),
    })
    .strict();
