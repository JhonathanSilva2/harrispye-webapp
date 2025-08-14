"use server";

import {
    AttributeKeys,
    Attributes,
    TDepartmentAttribute,
    TLocalizationAttribute,
    TOrganizationAttribute,
    TRoleAttribute,
    UserAttributesResponse,
} from "@/app/api/type";
import AuthClient from "@/infra/auth-client";
import { clientEnv } from "@/lib/constants/config";

const fetchAttributes = async (Attribute: AttributeKeys) => {
    return await AuthClient<
        | TDepartmentAttribute[]
        | TLocalizationAttribute[]
        | TOrganizationAttribute[]
        | TRoleAttribute[]
    >(`${clientEnv.NEXT_PUBLIC_URL}/api/attributes/${Attribute}`);
};

const fetchAllAttributes = async () => {
    return await AuthClient<Attributes>(
        `${clientEnv.NEXT_PUBLIC_URL}/api/attributes`,
    );
};

export const fetchUserAttributes = async (userId: number) => {
    const response = await AuthClient<UserAttributesResponse>(
        `${clientEnv.NEXT_PUBLIC_URL}/api/users/${userId}/user-attributes`,
    );
    return response;
};
export { fetchAttributes, fetchAllAttributes };
