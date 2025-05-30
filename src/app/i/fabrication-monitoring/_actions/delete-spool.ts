"use server";

import { DELETE } from "@/app/api/fabrication-monitoring/[job]/[spool_id]/route";
import { ReturnTypeFromAPICall } from "@/app/types";
import AuthClient from "@/infra/auth-client";
import { clientEnv } from "@/lib/constants/config";

export async function deleteSpool(job: string, spool_id: string) {
	const url = new URL(
		`${clientEnv.NEXT_PUBLIC_URL}/api/fabrication-monitoring/${job}/${spool_id}`,
	);
	const fetchOptions = {
		method: "DELETE",
	};

	return await AuthClient<ReturnTypeFromAPICall<typeof DELETE>>(
		url.toString(),
		fetchOptions,
	);
}
