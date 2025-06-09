"use server";

import { POST } from "@/app/api/fabrication-monitoring/[job]/route";
import { ReturnTypeFromAPICall } from "@/app/types";
import AuthClient from "@/infra/auth-client";
import { clientEnv } from "@/lib/constants/config";
import { headers } from "next/headers";

export async function createDrawing(
    JobiD: number | undefined,
    paylod: FormData,
) {
    if (!JobiD) return;
    const url = new URL(
        `${clientEnv.NEXT_PUBLIC_URL}/api/fabrication-monitoring/designs?jobId=${JobiD}`,
    );
    const fetchOptions = {
        method: "POST",
        body: paylod,
    };

    return await AuthClient<ReturnTypeFromAPICall<typeof POST>>(
        url.toString(),
        fetchOptions,
    );
}
