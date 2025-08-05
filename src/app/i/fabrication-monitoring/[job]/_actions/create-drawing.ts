"use server";

import { POST } from "@/app/api/fabrication-monitoring/[job]/route";
import { ReturnTypeFromAPICall } from "@/app/types";
import AuthClient from "@/infra/auth-client";
import { clientEnv } from "@/lib/constants/config";

export async function createDrawing(jobId: number, data: FormData) {
    const url = new URL(
        `${clientEnv.NEXT_PUBLIC_URL}/api/fabrication-monitoring/designs?jobId=${jobId}`,
    );
    const fetchOptions = {
        method: "POST",
        body: data,
    };

    return await AuthClient<ReturnTypeFromAPICall<typeof POST>>(
        url.toString(),
        fetchOptions,
    );
}
