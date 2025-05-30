"use server";

import { DELETE } from "@/app/api/fabrication-monitoring/[job]/route";
import { ReturnTypeFromAPICall } from "@/app/types";
import AuthClient from "@/infra/auth-client";
import { clientEnv } from "@/lib/constants/config";

export async function deleteJob(hp: string) {
	const url = `${clientEnv.NEXT_PUBLIC_URL}/api/fabrication-monitoring/${hp}`;
	const response = await AuthClient<ReturnTypeFromAPICall<typeof DELETE>>(
		url,
		{
			method: "DELETE",
			body: JSON.stringify(hp),
		},
	);

	if (!response.ok) {
		throw new Error(
			response.message ||
				"An unexpected error occurred while deleting the job.",
		);
	}

	return response.data;
}
