import { NextRequest, NextResponse } from "next/server";
import assert from "assert";
import { prismaBase } from "@/db/base-client";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const id = (await params).id;
        const parsedId = id ? parseInt(id) : null;
        if (!parsedId) {
            return NextResponse.json(
                { message: "ID is required" },
                { status: 400 },
            );
        }

        const userAttributes = await prismaBase.user_attributes.findUnique({
            where: { user_id: parsedId },
            select: {
                clearance: true,
                department_id: true,
                localization_id: true,
                organization_id: true,
                role_id: true,
            },
        });

        if (!userAttributes) {
            return NextResponse.json(
                {
                    clearance: null,
                    department_id: null,
                    localization_id: null,
                    organization_id: null,
                    role_id: null,
                },
                { status: 200 },
            );
        }

        return NextResponse.json(userAttributes, { status: 200 });
    } catch (error) {
        assert(error instanceof Error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const id = (await params).id;
        const parsedId = id ? parseInt(id) : null;
        if (!parsedId) {
            return NextResponse.json(
                { message: "ID is required" },
                { status: 400 },
            );
        }
        const body = await request.json();
        const {
            department_id,
            localization_id,
            organization_id,
            role_id,
            clearance,
        } = body;
        console.log({
            department_id,
            localization_id,
            organization_id,
            role_id,
            clearance,
        });
        // Verifica se ao menos um campo válido foi enviado
        if (
            department_id === undefined &&
            localization_id === undefined &&
            organization_id === undefined &&
            role_id === undefined &&
            clearance === undefined
        ) {
            return NextResponse.json(
                {
                    message: "Must send at least one attribute to update",
                },
                { status: 400 },
            );
        }

        // Tenta achar user_attributes existente
        let userAttributes = await prismaBase.user_attributes.findUnique({
            where: { user_id: parsedId },
        });

        if (!userAttributes) {
            // Cria novo registro para user_attributes do usuário
            userAttributes = await prismaBase.user_attributes.create({
                data: {
                    user_id: parsedId,
                    department_id: department_id ?? null,
                    localization_id: localization_id ?? null,
                    organization_id: organization_id ?? null,
                    role_id: role_id ?? null,
                    clearance: clearance ?? null, // Inicializa com null, se necessário
                },
            });
        } else {
            // Atualiza os campos enviados (somente os que vieram)
            userAttributes = await prismaBase.user_attributes.update({
                where: { user_id: parsedId },
                data: {
                    ...(department_id !== undefined && { department_id }),
                    ...(localization_id !== undefined && { localization_id }),
                    ...(organization_id !== undefined && { organization_id }),
                    ...(role_id !== undefined && { role_id }),
                },
            });
        }

        return NextResponse.json(userAttributes, { status: 200 });
    } catch (error) {
        assert(error instanceof Error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
