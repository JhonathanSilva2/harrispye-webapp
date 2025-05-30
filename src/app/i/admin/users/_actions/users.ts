"use server";

import { GET } from "@/app/api/users/route";
import { FetchPagePaginationProps, ReturnTypeFromAPICall } from "@/app/types";
import AuthClient from "@/infra/auth-client";
import { clientEnv } from "@/lib/constants/config";

export async function fetchUsers({ filters }: FetchPagePaginationProps) {
	const url = new URL(`${clientEnv.NEXT_PUBLIC_URL}/api/users`);
	if (filters) {
		Object.keys(filters).forEach((key) => {
			if (filters[key]) {
				url.searchParams.set(key, filters[key].toString());
			}
		});
	}
	return await AuthClient<ReturnTypeFromAPICall<typeof GET>>(url.toString());
}
