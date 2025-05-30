import { prismaBase } from "@/db/base-client";
import getUserFullProfile from "@/infra/get-user-full-profile";
import { userSchema } from "@/schemas/users";
import assert from "assert";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		if (!id || isNaN(Number(id))) {
			return new NextResponse("Invalid user id", { status: 400 });
		}
		const parsedId = parseInt(id);
		const user = await prismaBase.users.findUnique({
			where: {
				id: parsedId,
			},
			omit: {
				password: true,
				id_perfil: true,
				type_user: true,
			},
			include: {
				userAttributes: true,
			},
		});

		if (!user) {
			return new NextResponse(
				JSON.stringify({
					message: "User not found",
				}),
				{ status: 404 },
			);
		}

		const userFullProfile = await getUserFullProfile(user);
		return NextResponse.json(userFullProfile, { status: 200 });
	} catch (err) {
		assert(err instanceof Error);
		return NextResponse.json({ message: err.message }, { status: 500 });
	}
}

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const body = await request.json();
		if (!id || isNaN(Number(id))) {
			return new NextResponse("Invalid id", { status: 400 });
		}

		const parsedId = parseInt(id);
		const validation = userSchema.safeParse(body);

		if (!validation.success) {
			return NextResponse.json(validation.error.format(), {
				status: 400,
			});
		}

		const newBody = validation.data;

		console.log("id: ", id);
		const user = await prismaBase.users.findUnique({
			where: {
				id: parsedId,
			},
		});

		if (!user) {
			return new NextResponse(
				JSON.stringify({
					message: "User not found",
				}),
				{ status: 404 },
			);
		}

		const updatedUser = await prismaBase.users.update({
			where: {
				id: parsedId,
			},
			data: newBody,
		});

		return new NextResponse(JSON.stringify(updatedUser, null, 4), {
			headers: {
				"content-type": "application/json",
			},
		});
	} catch (err) {
		assert(err instanceof Error);
		return new NextResponse(err.message, { status: 500 });
	}
}
