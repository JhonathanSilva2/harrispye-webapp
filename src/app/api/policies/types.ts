export type PoliciesKeys =
	| "departments"
	| "localizations"
	| "organizations"
	| "roles";

export type TDepartmentPolicy = {
	id: number;
	department: string;
};

export type TLocalizationPolicy = {
	id: number;
	localization: string;
};

export type TOrganizationPolicy = {
	id: number;
	organization: string;
};

export type TRolePolicy = {
	id: number;
	role: string;
};

export interface Policies {
	departments: TDepartmentPolicy[];
	localizations: TLocalizationPolicy[];
	organizations: TOrganizationPolicy[];
	roles: TRolePolicy[];
}
