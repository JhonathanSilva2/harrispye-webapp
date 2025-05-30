"use server";

import {
	PoliciesKeys,
	TDepartmentPolicy,
	TLocalizationPolicy,
	TOrganizationPolicy,
	TRolePolicy,
} from "@/app/api/policies/types";
import AuthClient from "@/infra/auth-client";
import { clientEnv } from "@/lib/constants/config";

export const fetchPolicies = async (policy: PoliciesKeys) => {
	return await AuthClient<
		| TDepartmentPolicy[]
		| TLocalizationPolicy[]
		| TOrganizationPolicy[]
		| TRolePolicy[]
	>(`${clientEnv.NEXT_PUBLIC_URL}/api/policies/${policy}`);
};
