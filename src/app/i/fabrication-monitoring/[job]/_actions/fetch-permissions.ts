"use server";

import { GET } from "@/app/api/fabrication-monitoring/permissions/route";
import { ReturnTypeFromAPICall } from "@/app/types";
import AuthClient from "@/infra/auth-client";
import { clientEnv } from "@/lib/constants/config";

export async function fetchPermissions() {
    const url = new URL(
        `${clientEnv.NEXT_PUBLIC_URL}/api/fabrication-monitoring/permissions`,
    );
    return await AuthClient<ReturnTypeFromAPICall<typeof GET>>(url.toString());
}
