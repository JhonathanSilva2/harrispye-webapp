"use server";

import { PATCH } from "@/app/api/fabrication-monitoring/[job]/route";
import { ReturnTypeFromAPICall } from "@/app/types";
import AuthClient from "@/infra/auth-client";
import { clientEnv } from "@/lib/constants/config";
import { FabricationFormData } from "@/schemas/fab-mon";

export async function updateJob(hp: string, data: FabricationFormData) {
	const url = `${clientEnv.NEXT_PUBLIC_URL}/api/fabrication-monitoring/${hp}`;
	const response = await AuthClient<ReturnTypeFromAPICall<typeof PATCH>>(
		url,
		{
			method: "PATCH",
			body: JSON.stringify(data),
		},
	);

	if (!response.ok) {
		throw new Error(
			response.message ||
				"An unexpected error occurred while updating the job.",
		);
	}

	return response.data;
}
