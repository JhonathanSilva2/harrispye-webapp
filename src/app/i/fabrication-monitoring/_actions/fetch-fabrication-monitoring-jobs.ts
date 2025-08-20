"use server";

import { FabricationMonitoringFetchReturn } from "@/app/api/fabrication-monitoring/route";
import { FetchPagePaginationProps, TPayload } from "@/app/types";
import AuthClient from "@/infra/auth-client";
import { clientEnv } from "@/lib/constants/config";

export async function fetchFabricationMonitoringJobs({
    filters,
}: FetchPagePaginationProps) {
    const url = new URL(
        `${clientEnv.NEXT_PUBLIC_URL}/api/fabrication-monitoring`,
    );
    if (filters) {
        Object.keys(filters).forEach((key) => {
            if (filters[key]) {
                url.searchParams.set(key, filters[key].toString());
            }
        });
    }
    return await AuthClient<TPayload<FabricationMonitoringFetchReturn[]>>(
        url.toString(),
    );
}
