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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <PolicyCard
                title="Departments"
                isLoading={isLoadingDepartments}
                content={departments}
                attributeKey={"departments"}
            />
            <PolicyCard
                title="Localizations"
                isLoading={isLoadingLocalizations}
                content={localizations}
                attributeKey={"localizations"}
            />
            <PolicyCard
                title="Organizations"
                isLoading={isLoadingOrganizations}
                content={organizations}
                attributeKey={"organizations"}
            />
            <PolicyCard
                title="Roles"
                isLoading={isLoadingRoles}
                content={roles}
                attributeKey={"roles"}
            />
        </div>
    );
};

export default PoliciesComponent;
