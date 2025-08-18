"use client";

import { PolicyCard } from "./policy-card";
import { useAttribute } from "@/hooks/query/use-attributes";

const PoliciesComponent = () => {
    const { data: departments, isLoading: isLoadingDepartments } =
        useAttribute("departments");
    const { data: localizations, isLoading: isLoadingLocalizations } =
        useAttribute("localizations");
    const { data: organizations, isLoading: isLoadingOrganizations } =
        useAttribute("organizations");
    const { data: roles, isLoading: isLoadingRoles } = useAttribute("roles");

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
