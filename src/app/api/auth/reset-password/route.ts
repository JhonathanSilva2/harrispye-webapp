import { prismaBase } from "@/db/base-client";
import { serverEnv } from "@/lib/constants/config";
import { resetPasswordSchema } from "@/schemas/forgot-password";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const validation = resetPasswordSchema.safeParse(body);

		if (!validation.success) {
			return NextResponse.json(validation.error.format(), {
				status: 400,
			});
		}

		const validatedBody = validation.data;

		// passwords must match
		if (validatedBody.newPassword !== validatedBody.confirmPassword) {
			return NextResponse.json(
				{ message: "Passwords do not match" },
				{ status: 400 },
			);
		}

		// check if token exists in db
		const token = await prismaBase.password_requests.findFirst({
			where: {
				token: validatedBody.token,
			},
		});

		if (!token) {
			return NextResponse.json(
				{ message: "Password Recovery Expired" },
				{ status: 404 },
			);
		}

		// check if token is expired
		if (!token.expired_at || token.expired_at < new Date()) {
			return NextResponse.json(
				{ message: "Password Recovery Expired" },
				{ status: 400 },
			);
		}

		// update user password
		const newPassword = await bcrypt.hash(
			validatedBody.newPassword,
			serverEnv.SALT_ROUNDS,
		);

		await prismaBase.users.update({
			where: {
				id: token.user_id,
			},
			data: {
				password: newPassword,
			},
		});

		// validate token updating the expired_at
		await prismaBase.password_requests.deleteMany({
			where: {
				user_id: token.user_id,
			},
		});

		return NextResponse.json({ message: "Password updated" });
	} catch (err) {
		if (err instanceof Error) {
			return NextResponse.json({ message: err.message }, { status: 500 });
		}
	}
}
