"use server";

import {
    AttributeKeys,
    TDepartmentAttribute,
    TLocalizationAttribute,
    TOrganizationAttribute,
    TRoleAttribute,
} from "@/app/api/type";
import AuthClient from "@/infra/auth-client";
import { clientEnv } from "@/lib/constants/config";

export const createAttribute = async (
    attribute: AttributeKeys,
    newAttribute: string,
) => {
    return await AuthClient<
        | TDepartmentAttribute[]
        | TLocalizationAttribute[]
        | TOrganizationAttribute[]
        | TRoleAttribute[]
    >(`${clientEnv.NEXT_PUBLIC_URL}/api/attributes/${attribute}`, {
        method: "POST",
        body: JSON.stringify({ attribute }),
    });
};
