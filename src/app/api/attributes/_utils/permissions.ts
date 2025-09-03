import { BRAZIL_LOCALIZATION_ID } from "../_utils/constants";

export function buildClientPermissionPayload({
    organizationId,
    roleId,
    clientApproval,
}: {
    organizationId: number;
    roleId: number;
    clientApproval: "ALL" | "READ" | "NONE";
}) {
    return {
        user_organizations_id: organizationId,
        user_roles_id: roleId,
        user_localizations_id: BRAZIL_LOCALIZATION_ID,
        user_clearance: "LOW" as const,
        add_spools: false,
        delete_spools: false,
        spec: "READ" as const,
        mass: "READ" as const,
        price_per_kg: "NONE" as const,
        gross_spool_cost: "NONE" as const,
        description: "READ" as const,
        drawing_ref: "READ" as const,
        spool_number: "READ" as const,
        materials_arrived: "READ" as const,
        fabrication_complete: "READ" as const,
        scan_3d: "READ" as const,
        ndt_complete: "READ" as const,
        pressure_test: "READ" as const,
        internal_coating: "READ" as const,
        external_coating: "READ" as const,
        packing: "READ" as const,
        dispatch: "READ" as const,
        notes: "READ" as const,
        client_approval: clientApproval,
        manager_approval: "NONE" as const,
        graph: false,
        summary: false,
        m2_fbe: "NONE" as const,
        m2_galvanized: "NONE" as const,
        m2_price: "NONE" as const,
    };
}
