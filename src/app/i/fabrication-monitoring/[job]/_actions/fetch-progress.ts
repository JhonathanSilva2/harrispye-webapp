"use server";

import { GET } from "@/app/api/fabrication-monitoring/[job]/progress/route";
import { FetchJobProps, ReturnTypeFromAPICall } from "@/app/types";
import AuthClient from "@/infra/auth-client";
import { clientEnv } from "@/lib/constants/config";

export async function fetchProgress({ hp, filters }: FetchJobProps) {
    const url = new URL(
        `${clientEnv.NEXT_PUBLIC_URL}/api/fabrication-monitoring/${hp}/progress`,
    );
    if (filters) {
        Object.keys(filters).forEach((key) => {
            if (filters[key]) {
                url.searchParams.set(key, filters[key].toString());
            }
        });
    }
    return await AuthClient<ReturnTypeFromAPICall<typeof GET>>(url.toString());
}
