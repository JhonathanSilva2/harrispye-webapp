import { Edit } from "lucide-react";
import { UserRole } from "./types";
import AccessControl from "@/lib/auth/policy-decision-point";

const FabMonSpoolsPermission: UserRole = {
    clientApprover: {
        drawing_ref: "READ",
        spool_number: "READ",
        description: "READ",
        client_approval: "UPDATE",
        manager_approval: false,
        spec: "READ",
        mass: "READ",
        price_per_kg: "READ",
        gross_spool_cost: "READ",
        materials_ordered: "READ",
        materials_arrived: "READ",
        fabrication_complete: "READ",
        ndt_complete: "READ",
        pressure_test: "READ",
        internal_coating: "READ",
        external_coating: "READ",
        packing: "READ",
        dispatch: "READ",
        notes: "READ",
        _actions: "READ",
    },
    clientGuest: {
        drawing_ref: "READ",
        spool_number: "READ",
        description: "READ",
        client_approval: "READ",
        manager_approval: false,
        spec: "READ",
        mass: "READ",
        price_per_kg: "READ",
        gross_spool_cost: "READ",
        materials_ordered: "READ",
        materials_arrived: "READ",
        fabrication_complete: "READ",
        ndt_complete: "READ",
        pressure_test: "READ",
        internal_coating: "READ",
        external_coating: "READ",
        packing: "READ",
        dispatch: "READ",
        notes: "READ",
        _actions: "READ",
    },
    operationManager: {
        drawing_ref: "READ",
        spool_number: "READ",
        description: "READ",
        client_approval: "READ",
        manager_approval: "UPDATE",
        spec: "READ",
        mass: "READ",
        price_per_kg: "READ",
        gross_spool_cost: "READ",
        materials_ordered: "READ",
        materials_arrived: "READ",
        fabrication_complete: "READ",
        ndt_complete: "READ",
        pressure_test: "READ",
        internal_coating: "READ",
        external_coating: "READ",
        packing: "READ",
        dispatch: "READ",
        notes: "READ",
        _actions: "READ",
    },
    manager: {
        drawing_ref: "UPDATE",
        spool_number: "UPDATE",
        description: "UPDATE",
        client_approval: "READ",
        manager_approval: "READ",
        spec: "UPDATE",
        mass: "UPDATE",
        price_per_kg: "UPDATE",
        gross_spool_cost: "UPDATE",
        materials_ordered: "UPDATE",
        materials_arrived: "UPDATE",
        fabrication_complete: "UPDATE",
        ndt_complete: "UPDATE",
        pressure_test: "UPDATE",
        internal_coating: "UPDATE",
        external_coating: "UPDATE",
        packing: "UPDATE",
        dispatch: "UPDATE",
        notes: "UPDATE",
        _actions: "ALL",
    },
    operator: {
        drawing_ref: "READ",
        spool_number: "READ",
        description: "READ",
        client_approval: "READ",
        manager_approval: "READ",
        spec: "UPDATE",
        mass: "UPDATE",
        price_per_kg: "READ",
        gross_spool_cost: "READ",
        materials_ordered: "UPDATE",
        materials_arrived: "UPDATE",
        fabrication_complete: "UPDATE",
        ndt_complete: "UPDATE",
        pressure_test: "UPDATE",
        internal_coating: "UPDATE",
        external_coating: "UPDATE",
        packing: "UPDATE",
        dispatch: "UPDATE",
        notes: "UPDATE",
        _actions: "READ",
    },
    admin: {
        drawing_ref: "ALL",
        spool_number: "ALL",
        description: "ALL",
        client_approval: "ALL",
        manager_approval: "ALL",
        spec: "ALL",
        mass: "ALL",
        price_per_kg: "ALL",
        gross_spool_cost: "ALL",
        materials_ordered: "ALL",
        materials_arrived: "ALL",
        fabrication_complete: "ALL",
        ndt_complete: "ALL",
        pressure_test: "ALL",
        internal_coating: "ALL",
        external_coating: "ALL",
        packing: "ALL",
        dispatch: "ALL",
        notes: "ALL",
        _actions: "ALL",
    },
    default: {
        drawing_ref: false,
        spool_number: false,
        description: false,
        client_approval: false,
        manager_approval: false,
        spec: false,
        mass: false,
        price_per_kg: false,
        gross_spool_cost: false,
        materials_ordered: false,
        materials_arrived: false,
        fabrication_complete: false,
        ndt_complete: false,
        pressure_test: false,
        internal_coating: false,
        external_coating: false,
        packing: false,
        dispatch: false,
        notes: false,
        _actions: false,
    },
};
const FabMonFeaturesPermission = {
    graph: {
        CLIENT_APPROVER: false,
        CLIENT_GUEST: false,
        OPERATION_MANAGER: true,
        MANAGER: true,
        OPERATOR: true,
        DEFAULT: false,
    },
    summary: {
        CLIENT_APPROVER: false,
        CLIENT_GUEST: false,
        OPERATION_MANAGER: { view: true, edit: false, export: false },
        MANAGER: { view: true, edit: true, export: true },
        OPERATOR: { view: true, edit: false, export: false },
        DEFAULT: { view: false, edit: false, export: false },
    },
    addSpool: {
        CLIENT_APPROVER: false,
        CLIENT_GUEST: false,
        OPERATION_MANAGER: false,
        MANAGER: true,
        OPERATOR: false,
        DEFAULT: false,
    },
    editSpool: {
        CLIENT_APPROVER: true,
        CLIENT_GUEST: false,
        OPERATION_MANAGER: true,
        MANAGER: true,
        OPERATOR: true,
        DEFAULT: false,
    },
    deleteSpool: {
        CLIENT_APPROVER: false,
        CLIENT_GUEST: false,
        OPERATION_MANAGER: false,
        MANAGER: true,
        OPERATOR: false,
        DEFAULT: false,
    },
};
export const Permissions = {
    FabMonSpoolsPermission,
    FabMonFeaturesPermission,
    getFeaturePermission<T>(
        featurePermissions: Record<string, T>,
        role: string | undefined,
    ): T | false {
        if (!role) return false;
        return featurePermissions[role] ?? false;
    },
    getPermissionPayload(accessControl: AccessControl | null) {
        if (!accessControl) return;
        const role = !accessControl.isAdmin()
            ? accessControl.getRole()
            : "ADMIN";
        switch (role) {
            case "ADMIN":
                return FabMonSpoolsPermission["admin"];
            case "CLIENT_APPROVER":
                return FabMonSpoolsPermission["clientApprover"];
            case "CLIENT_GUEST":
                return FabMonSpoolsPermission["clientGuest"];
            case "OPERATION_MANAGER":
                return FabMonSpoolsPermission["operationManager"];
            case "OPERATOR":
                return FabMonSpoolsPermission["operator"];
            case "MANAGER":
                return FabMonSpoolsPermission["manager"];
            case "GUEST":
                return FabMonSpoolsPermission["clientGuest"];
            default:
                return FabMonSpoolsPermission["default"];
        }
    },
};
