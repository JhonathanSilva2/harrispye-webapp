import { z } from "zod";

export const FabricationForm = z.object({
    hp: z.string().min(4, "HP is required"),
    po_number: z.string().nonempty("PO Number is required"),
    client: z.string().nonempty("Client is required"),
    contract_delivery_date: z
        .string()
        .nonempty("Contract delivery date is required"),
    expected_delivery_date: z
        .string()
        .nonempty("Expected delivery date is required"),
    mr_number: z.string().nonempty("MR Number is required"),
    shutdown_id: z.string().nonempty("Shutdown ID is required"),
    organization_id: z.number().min(1, "Organization ID is required"),
});

export type FabricationFormData = z.infer<typeof FabricationForm>;
