"use server";

import options from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { headers } from "next/headers";

export interface AuthClientResponse<TData> {
    data?: TData;
    status: number;
    statusText: string;
    ok: boolean;
    message?: string;
}

export default async function AuthClient<TData>(
    fetchUrl: string,
    fetchOptions: RequestInit = {},
): Promise<AuthClientResponse<TData>> {
    const currentHeaders = await headers();
    const session = await getServerSession(options);
    if (!session) {
        return {
            status: 401,
            statusText: "Unauthorized",
            ok: false,
            message: "Unauthorized",
        };
    }

    const url = new URL(fetchUrl);
    const cookie = currentHeaders.get("cookie") || "";

    fetchOptions = {
        ...fetchOptions,
        headers: {
            cookie,
            ...fetchOptions.headers,
            "Content-Type": "application/json",
        },
    };

    const response = await fetch(url.toString(), fetchOptions);
    if (!response.ok) {
        return {
            status: response.status,
            statusText: response.statusText,
            ok: false,
            message: await response.text(),
        };
    }
    const data: TData = await response.json();
    return {
        data,
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
    };
}
