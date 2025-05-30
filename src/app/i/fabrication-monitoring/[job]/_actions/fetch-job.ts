"use server";

import { GET } from "@/app/api/fabrication-monitoring/[job]/route";
import { FetchJobProps, ReturnTypeFromAPICall } from "@/app/types";
import AuthClient from "@/infra/auth-client";
import { clientEnv } from "@/lib/constants/config";

export async function fetchJob({ hp, filters }: FetchJobProps) {
	const url = new URL(
		`${clientEnv.NEXT_PUBLIC_URL}/api/fabrication-monitoring/${hp}`,
	);
	if (filters) {
		Object.keys(filters).forEach((key) => {
			if (filters[key]) {
				url.searchParams.set(key, filters[key].toString());
			}
		});
	}
	return await AuthClient<ReturnTypeFromAPICall<typeof GET>>(url.toString());
}
