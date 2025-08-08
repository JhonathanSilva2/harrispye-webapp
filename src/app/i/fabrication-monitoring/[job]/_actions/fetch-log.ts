"use server";

import { FetchJobLogProps } from "@/app/types";
import AuthClient from "@/infra/auth-client";
import { clientEnv } from "@/lib/constants/config";

export async function fetchLog({ jobId, filters }: FetchJobLogProps) {
    const url = new URL(
        `${clientEnv.NEXT_PUBLIC_URL}/api/fabrication-monitoring/log/${jobId}`,
    );
    if (filters) {
        Object.keys(filters).forEach((key) => {
            if (filters[key]) {
                url.searchParams.set(key, filters[key].toString());
            }
        });
    }
    return await AuthClient(url.toString());
}
