import { Prisma } from "prisma/generated/client-hp-base";

export type AttributeKeys =
    | "departments"
    | "localizations"
    | "organizations"
    | "roles"
    | "clearances";

export type TDepartmentAttribute = {
    id: number;
    department: string;
};

export type TLocalizationAttribute = {
    id: number;
    localization: string;
};

export type TOrganizationAttribute = {
    id: number;
    organization: string;
};
export type TClearanceAttribute = {
    id: number;
    clearances: "LOW" | "MEDIUM" | "HIGH";
};

export type TRoleAttribute = {
    id: number;
    role: string;
};

export interface Attributes {
    departments: TDepartmentAttribute[];
    localizations: TLocalizationAttribute[];
    organizations: TOrganizationAttribute[];
    roles: TRoleAttribute[];
    clearances: TClearanceAttribute[];
}

export interface UserAttributesResponse {
    clearance: string | null;
    department_id: number | null;
    localization_id: number | null;
    organization_id: number | null;
    role_id: number | null;
}
