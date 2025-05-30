import { prismaBase } from "@/db/base-client";
import assert from "assert";
import { capitalize } from "lodash";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import options from "../../auth/[...nextauth]/options";
import {
	TDepartmentPolicy,
	TLocalizationPolicy,
	TOrganizationPolicy,
	TRolePolicy,
} from "../types";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ policy: string }> },
) {
	try {
		const policy = (await params).policy;
		let requestedPolicy:
			| TDepartmentPolicy[]
			| TLocalizationPolicy[]
			| TOrganizationPolicy[]
			| TRolePolicy[] = [];
		switch (policy) {
			case "departments":
				requestedPolicy = await prismaBase.user_departments.findMany({
					select: {
						id: true,
						department: true,
					},
				});
				break;
			case "localizations":
				requestedPolicy = await prismaBase.user_localizations.findMany({
					select: {
						id: true,
						localization: true,
					},
				});
				break;
			case "organizations":
				requestedPolicy = await prismaBase.user_organizations.findMany({
					select: {
						id: true,
						organization: true,
					},
				});
				break;
			case "roles":
				requestedPolicy = await prismaBase.user_roles.findMany({
					select: {
						id: true,
						role: true,
					},
				});
				break;
			default:
				throw new Error("Invalid policy");
		}
		return NextResponse.json(requestedPolicy, { status: 200 });
	} catch (err) {
		assert(err instanceof Error);
		return new NextResponse(err.message, { status: 500 });
	}
}

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ policy: string }> },
) {
	try {
		const policy = (await params).policy;
		const session = await getServerSession(options);
		const user = session?.user;
		if (!user) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const body = await request.json();
		if (!body.newAttribute) {
			return new NextResponse("Must provide new attribute value", {
				status: 400,
			});
		}

		const data = {
			created_by: user.id,
		};

		try {
			switch (policy) {
				case "departments":
					await prismaBase.user_departments.create({
						data: {
							...data,
							department: body.newAttribute,
						},
					});
					break;
				case "localizations":
					await prismaBase.user_localizations.create({
						data: {
							...data,
							localization: body.newAttribute,
						},
					});
					break;
				case "organizations":
					await prismaBase.user_organizations.create({
						data: {
							...data,
							organization: body.newAttribute,
						},
					});
					break;
				case "roles":
					await prismaBase.user_roles.create({
						data: {
							role: body.newAttribute,
							created_by: user.id,
						},
					});
					break;
				default:
					throw new Error("Invalid policy");
			}
		} catch (err) {
			assert(err instanceof Error);
			return new NextResponse(err.message, { status: 500 });
		}

		return new NextResponse(`${capitalize(policy)} created successfully`, {
			status: 201,
		});
	} catch (err) {
		assert(err instanceof Error);
		return new NextResponse(err.message, { status: 500 });
	}
}
