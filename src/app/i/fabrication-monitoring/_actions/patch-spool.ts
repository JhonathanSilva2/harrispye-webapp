"use server";

import { PATCH } from "@/app/api/fabrication-monitoring/[job]/[spool_id]/route";
import { ReturnTypeFromAPICall } from "@/app/types";
import AuthClient from "@/infra/auth-client";
import { clientEnv } from "@/lib/constants/config";

type body = Record<string, string | number>;

export async function patchSpool(job: string, spoolID: string, data: body) {
	const url = new URL(
		`${clientEnv.NEXT_PUBLIC_URL}/api/fabrication-monitoring/${job}/${spoolID}`,
	);
	const fetchOptions = {
		method: "PATCH",
		body: JSON.stringify(data),
	};

	return await AuthClient<ReturnTypeFromAPICall<typeof PATCH>>(
		url.toString(),
		fetchOptions,
	);
}
