"use server";

import { UserAccessControl } from "@/app/api/users/[id]/access-control/types";
import AuthClient from "@/infra/auth-client";
import { CreateUserAccessControl, FetchUserAccessControl } from "../types";

export async function fetchUserAccessControl({ id }: FetchUserAccessControl) {
    const url = new URL(
        `${process.env.NEXT_PUBLIC_URL}/api/users/${id}/access-control`,
    );
    const fetchOptions = {
        method: "GET",
    };

    return await AuthClient<UserAccessControl>(url.toString(), fetchOptions);
}

export async function createUserAccessControl({
    id,
    feature,
    action,
}: CreateUserAccessControl) {
    const url = new URL(
        `${process.env.NEXT_PUBLIC_URL}/api/users/${id}/access-control`,
    );
    const fetchOptions = {
        method: "POST",
        body: JSON.stringify({ feature, action }),
    };

    return await AuthClient<UserAccessControl>(url.toString(), fetchOptions);
}

export async function deleteUserAccessControl({
    id,
    feature,
    action,
}: CreateUserAccessControl) {
    const url = new URL(
        `${process.env.NEXT_PUBLIC_URL}/api/users/${id}/access-control`,
    );
    const fetchOptions = {
        method: "DELETE",
        body: JSON.stringify({ feature, action }),
    };

    return await AuthClient<UserAccessControl>(url.toString(), fetchOptions);
}
