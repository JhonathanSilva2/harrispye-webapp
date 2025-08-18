import { prismaBase } from "@/db/base-client";
import assert from "assert";
import { NextResponse } from "next/server";
import { Attributes } from "../type";

export async function GET(): Promise<NextResponse<Attributes>> {
    try {
        const [departments, localizations, organizations, roles] =
            await Promise.all([
                await prismaBase.user_departments.findMany({
                    select: {
                        id: true,
                        department: true,
                    },
                }),
                await prismaBase.user_localizations.findMany({
                    select: {
                        id: true,
                        localization: true,
                    },
                }),
                await prismaBase.user_organizations.findMany({
                    select: {
                        id: true,
                        organization: true,
                    },
                }),
                await prismaBase.user_roles.findMany({
                    select: {
                        id: true,
                        role: true,
                    },
                }),
            ]);

        return NextResponse.json(
            {
                departments,
                localizations,
                organizations,
                roles,
            },
            { status: 200 },
        );
    } catch (err) {
        assert(err instanceof Error);
        return new NextResponse(err.message, { status: 500 });
    }
}
