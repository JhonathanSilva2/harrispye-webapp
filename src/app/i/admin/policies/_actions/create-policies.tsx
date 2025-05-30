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

export const createPolicy = async (policy: PoliciesKeys, newPolicy: string) => {
	return await AuthClient<
		| TDepartmentPolicy[]
		| TLocalizationPolicy[]
		| TOrganizationPolicy[]
		| TRolePolicy[]
	>(`${clientEnv.NEXT_PUBLIC_URL}/api/policies/${policy}`, {
		method: "POST",
		body: JSON.stringify({ newPolicy }),
	});
};
