"use server";

import { GET } from "@/app/api/fabrication-monitoring/designs/route";
import { ReturnTypeFromAPICall } from "@/app/types";
import AuthClient from "@/infra/auth-client";
import { clientEnv } from "@/lib/constants/config";

export async function fetchDrawings(job: string) {
	const url = new URL(
		`${clientEnv.NEXT_PUBLIC_URL}/api/fabrication-monitoring/designs?jobId=${job}`,
	);

	return await AuthClient<ReturnTypeFromAPICall<typeof GET>>(url.toString());
}
