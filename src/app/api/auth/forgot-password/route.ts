import { prismaBase } from "@/db/base-client";
import { clientEnv } from "@/lib/constants/config";
import { sendMail } from "@/lib/mail/send-email";
import { forgotPasswordSchema } from "@/schemas/forgot-password";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const validation = forgotPasswordSchema.safeParse(body);

		if (!validation.success) {
			return NextResponse.json(validation.error.format(), {
				status: 400,
			});
		}

		const validatedBody = validation.data;

		// check if email exists in db
		const user = await prismaBase.users.findFirst({
			where: {
				username: validatedBody.email,
			},
		});
		if (!user) {
			return NextResponse.json(
				{ message: "User not found" },
				{ status: 404 },
			);
		}

		const genTokenHash = async () => {
			const tokenHash = uuidv4();

			const tokenExists = await prismaBase.password_requests.findFirst({
				where: {
					token: tokenHash,
				},
			});

			if (tokenExists) {
				return genTokenHash();
			}
			return tokenHash;
		};

		const tokenHash = await genTokenHash();
		const token = {
			user_id: user.id,
			token: tokenHash,
			expired_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
		};

		// store token in db
		await prismaBase.password_requests.create({
			data: token,
		});

		const mailContent = [
			{
				type: "text",
				value: "Hello,",
			},
			{
				type: "text",
				value: "We received a request to recover your password. Click the button below to reset your password:",
			},
			{
				type: "button",
				value: "Reset Password",
				link: `${clientEnv.NEXT_PUBLIC_URL}/auth/reset-password/${tokenHash}`,
			},
			{
				type: "text",
				value: "If you did not request a password reset, please ignore this email.",
			},
		];

		const responseMail = await sendMail({
			mailAbout: "Password Recovery",
			mailContent,
			mailTo: validatedBody.email,
		});

		if (responseMail instanceof Error) {
			return NextResponse.json(
				{ message: responseMail.message },
				{ status: 500 },
			);
		}

		return NextResponse.json(
			{
				message:
					"An email was forwarded to you to recover your password",
			},
			{ status: 200 },
		);
	} catch (err) {
		console.error(err);
		if (err instanceof Error) {
			return NextResponse.json({ message: err.message }, { status: 500 });
		}
	}
}
