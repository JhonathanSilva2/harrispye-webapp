import { FabMonSpoolsPermission } from "@/app/api/fabrication-monitoring/permissions/_action/fetch-permission";

export const DEFAULT_FAB_MON_SPOOLS_PERMISSION: FabMonSpoolsPermission = {
    add_spools: false,
    delete_spools: false,
    spec: "NONE",
    mass: "NONE",
    price_per_kg: "NONE",
    gross_spool_cost: "NONE",
    description: "NONE",
    drawing_ref: "NONE",
    spool_number: "NONE",
    materials_ordered: "NONE",
    materials_arrived: "NONE",
    fabrication_complete: "NONE",
    scan_3d: "NONE",
    ndt_complete: "NONE",
    pressure_test: "NONE",
    internal_coating: "NONE",
    external_coating: "NONE",
    packing: "NONE",
    dispatch: "NONE",
    notes: "NONE",
    client_approval: "NONE",
    manager_approval: "NONE",
    graph: false,
    summary: false
}