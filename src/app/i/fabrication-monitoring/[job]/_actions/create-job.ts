"use server";

import { POST } from "@/app/api/fabrication-monitoring/route";
import { ReturnTypeFromAPICall } from "@/app/types";
import AuthClient from "@/infra/auth-client";
import { clientEnv } from "@/lib/constants/config";
import { FabricationFormData } from "@/schemas/fab-mon";

export async function createJob(jobData: FabricationFormData) {
	return await AuthClient<ReturnTypeFromAPICall<typeof POST>>(
		`${clientEnv.NEXT_PUBLIC_URL}/api/fabrication-monitoring`,
		{
			method: "POST",
			body: JSON.stringify(jobData),
		},
	);
}
