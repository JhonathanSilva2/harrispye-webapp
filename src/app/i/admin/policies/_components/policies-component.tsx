"use client";

import { PolicyCard } from "./policy-card";
import { usePoliciy } from "@/hooks/query/use-policies";

const PoliciesComponent = () => {
	const { data: departments, isLoading: isLoadingDepartments } =
		usePoliciy("departments");
	const { data: localizations, isLoading: isLoadingLocalizations } =
		usePoliciy("localizations");
	const { data: organizations, isLoading: isLoadingOrganizations } =
		usePoliciy("organizations");
	const { data: roles, isLoading: isLoadingRoles } = usePoliciy("roles");

	return (
		<div className="flex gap-2">
			<PolicyCard
				title="Departments"
				isLoading={isLoadingDepartments}
				content={departments}
			/>
			<PolicyCard
				title="Localizations"
				isLoading={isLoadingLocalizations}
				content={localizations}
			/>
			<PolicyCard
				title="Organizations"
				isLoading={isLoadingOrganizations}
				content={organizations}
			/>
			<PolicyCard
				title="Roles"
				isLoading={isLoadingRoles}
				content={roles}
			/>
		</div>
	);
};

export default PoliciesComponent;
