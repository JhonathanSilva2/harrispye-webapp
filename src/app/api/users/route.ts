import { StringDictionary, TPayload, UserFullProfile } from "@/app/types";
import { prismaBase } from "@/db/base-client";
import getUserFullProfile from "@/infra/get-user-full-profile";
import { serverEnv } from "@/lib/constants/config";
import { getApiPagination, ValidSort } from "@/lib/pagination";
import { userSchema } from "@/schemas/users";
import { Prisma } from "@/../prisma/generated/client-hp-base";
import assert from "assert";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
): Promise<NextResponse<TPayload<UserFullProfile[]>>> {
    try {
        const urlObj = new URL(request.nextUrl);
        const validSort: ValidSort[] = [
            { key: "id", type: "number" },
            { key: "name", type: "string" },
            { key: "hp_registration", type: "number" },
            { key: "username", type: "string" },
            { key: "display_name", type: "string" },
            { key: "role", type: "string" },
            { key: "admission_date", type: "date" },
            { key: "department", type: "string" },
            { key: "direct_manager", type: "string" },
            { key: "is_admin", type: "number" },
        ];

        const advancedFilterKeys: ValidSort[] = [
            { key: "hp_registration", type: "number" },
            { key: "display_name", type: "string" },
            { key: "username", type: "string" },
            { key: "role", type: "string" },
            // { key: "department", type: "string" },
            // { key: "direct_manager", type: "string" },
            { key: "name", type: "string" },
            { key: "admission_date", type: "date" },
        ];

        const { page, pageSize, where, skip, take, orderBy } =
            getApiPagination<Prisma.usersWhereInput>(
                urlObj,
                validSort,
                advancedFilterKeys,
            );

        const transaction = await prismaBase.$transaction(async (tx) => {
            const defaultWhere: Prisma.usersWhereInput = {
                NOT: [
                    {
                        OR: [
                            {
                                hp_registration: 0,
                            },
                            {
                                hp_registration: null,
                            },
                        ],
                    },
                ],
                ...where,
            };
            const users = await tx.users.findMany({
                skip,
                take,
                where: defaultWhere,
                orderBy: [
                    ...(orderBy
                        ? [orderBy]
                        : [
                              {
                                  hp_registration: "asc",
                              },
                          ]),
                ],
                omit: {
                    password: true,
                    id_perfil: true,
                    type_user: true,
                },
                include: {
                    user_attributes: true,
                },
            });

            const promiseUsersCount = tx.users.count({
                where: defaultWhere,
            });

            return {
                usersWithManagers: await Promise.all(
                    users.map(
                        async (user) => await getUserFullProfile(user, tx),
                    ),
                ),
                usersCount: await promiseUsersCount,
            };
        });

        const { usersWithManagers, usersCount } = transaction;

        const payload: TPayload<UserFullProfile[]> = {
            data: usersWithManagers,
            page,
            pageSize,
            rowCount: usersCount,
        };

        return new NextResponse(JSON.stringify(payload, null, 4), {
            headers: {
                "content-type": "application/json",
            },
        });
    } catch (err) {
        assert(err instanceof Error);
        return new NextResponse(err.message, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validation = userSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(validation.error.format(), {
                status: 400,
            });
        }

        const newBody = validation.data;

        const duplicate = await prismaBase.users.findUnique({
            where: {
                hp_registration: newBody.hp_registration,
            },
        });

        if (duplicate) {
            return NextResponse.json(
                { message: "Duplicate User" },
                { status: 409 },
            );
        }

        const hashPassword = await bcrypt.hash(
            newBody?.password ?? randomUUID(),
            serverEnv.SALT_ROUNDS,
        );
        newBody!.password = hashPassword;

        const newUser = await prismaBase.users.create({
            data: {
                username: newBody.username,
                password: newBody.password,
                hp_registration: newBody.hp_registration,
                id_perfil: newBody.hp_registration,
                display_name: newBody.display_name,
                name: newBody.name,
                role: newBody.role,
                direct_manager: newBody.direct_manager,
                department: newBody.department,
                is_admin: false,
                type_user: 0,
                admission_date: new Date(newBody.admission_date),
            },
        });

        return NextResponse.json(newUser, { status: 201 });
    } catch (err: unknown) {
        console.error(err);
        if (err instanceof Error) {
            return NextResponse.json({ message: err.message }, { status: 500 });
        }
    }
}
