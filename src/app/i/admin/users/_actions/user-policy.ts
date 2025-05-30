"use server";

import { prismaBase } from "@/db/base-client";

export const fetchUserAttributes = async (userHpNumber: number) => {
	const userAttributes = await prismaBase.user_attributes.findFirst({
		where: {
			user_id: userHpNumber,
		},
	});
	return userAttributes;
};
