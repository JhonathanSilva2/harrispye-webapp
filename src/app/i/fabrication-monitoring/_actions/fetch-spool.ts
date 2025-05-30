"use server";

import { POST } from "@/app/api/fabrication-monitoring/route";
import { ReturnTypeFromAPICall } from "@/app/types";
import AuthClient from "@/infra/auth-client";
import { clientEnv } from "@/lib/constants/config";

export async function fetchSpool(job: string) {
	const url = new URL(
		`${clientEnv.NEXT_PUBLIC_URL}/api/fabrication-monitoring/${job}`,
	);
	const fetchOptions = {
		method: "POST",
		body: JSON.stringify({}),
	};

	return await AuthClient<ReturnTypeFromAPICall<typeof POST>>(
		url.toString(),
		fetchOptions,
	);
}
