// 1. Defina os valores de permissão possíveis
export type PermissionValue = "READ" | "UPDATE" | false | "DELETE" | "ALL";

// 2. Defina o formato de um conjunto de permissões listando cada chave
export interface ProfilePermissions {
    drawing_ref: PermissionValue;
    spool_number: PermissionValue;
    description: PermissionValue;
    client_approval: PermissionValue;
    manager_approval: PermissionValue;
    spec: PermissionValue;
    mass: PermissionValue;
    price_per_kg: PermissionValue;
    gross_spool_cost: PermissionValue;
    materials_ordered: PermissionValue;
    materials_arrived: PermissionValue;
    fabrication_complete: PermissionValue;
    ndt_complete: PermissionValue;
    pressure_test: PermissionValue;
    external_coating: PermissionValue;
    internal_coating: PermissionValue;
    packing: PermissionValue;
    dispatch: PermissionValue;
    notes: PermissionValue;
    _actions: PermissionValue;
}

// 3. Defina a tipagem final para o objeto principal
export interface UserRole {
    clientApprover: ProfilePermissions;
    clientGuest: ProfilePermissions;
    operationManager: ProfilePermissions;
    manager: ProfilePermissions;
    operator: ProfilePermissions;
    default: ProfilePermissions;
}
