"use server";

import { DELETE } from "@/app/api/fabrication-monitoring/designs/[id]/route";
import { ReturnTypeFromAPICall } from "@/app/types";
import AuthClient from "@/infra/auth-client";
import { clientEnv } from "@/lib/constants/config";

export async function deleteDrawing(drawingId: number) {
    const url = `${clientEnv.NEXT_PUBLIC_URL}/api/fabrication-monitoring/designs/${drawingId}`;
    return await AuthClient<ReturnTypeFromAPICall<typeof DELETE>>(url, {
        method: "DELETE",
    });
}
