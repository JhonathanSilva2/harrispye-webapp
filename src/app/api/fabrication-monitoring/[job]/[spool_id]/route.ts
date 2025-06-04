import options from "@/app/api/auth/[...nextauth]/options";
import { prismaBase } from "@/db/base-client";
import { fabricationMonitoringUpdateSpoolSchema } from "@/schemas/fabrication-monitoring-spool";
import assert from "assert";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { fabrication_monitoring } from "../../../../../../prisma/generated/client-hp-base";

export interface FabricationMonitoringSpoolFetchReturn {
    spool: fabrication_monitoring;
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ spool_id: string }> },
) {
    const session = await getServerSession(options);
    const updated_by = session?.user.hp_registration;
    if (!updated_by) {
        return NextResponse.json(
            { message: "User not found" },
            { status: 400 },
        ); // Retorne uma resposta com status e mensagem
    }
    try {
        const spoolID = (await params).spool_id;
        if (!spoolID) {
            return new NextResponse("Spool_id param not found", {
                status: 404,
            });
        }

        // Consultando o spool
        const spool = await prismaBase.fabrication_monitoring.findUnique({
            where: { id: Number(spoolID) },
        });

        if (!spool) {
            return new NextResponse("Spool not found", { status: 404 });
        }

        // Tratando o body
        const body = await request.json();
        if (Object.keys(body).length === 0) {
            return new NextResponse("At least one field must be provided", {
                status: 400,
            });
        }

        // Bloqueia atualização somente do ID
        if (Object.keys(body).length === 1 && body.id) {
            return new NextResponse("ID cannot be updated", { status: 400 });
        }

        // Validação do body com Zod
        const validation =
            fabricationMonitoringUpdateSpoolSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { errors: validation.error.format() },
                { status: 400 },
            );
        }

        // Campos validados e prontos para atualização
        const newBody = validation.data;

        // Atualiza o spool no banco de dados
        const updateSpool = await prismaBase.fabrication_monitoring.update({
            where: { id: spool.id },
            data: {
                spec: newBody.spec,
                mass: newBody.mass,
                price_per_kg: newBody.price_per_kg,
                gross_spool_cost: newBody.gross_spool_cost,
                description: newBody.description,
                drawing_ref: newBody.drawing_ref,
                spool_number: newBody.spool_number,
                materials_ordered: newBody.materials_ordered,
                materials_arrived: newBody.materials_arrived,
                fabrication_complete: newBody.fabrication_complete,
                ndt_complete: newBody.ndt_complete,
                pressure_test: newBody.pressure_test,
                internal_coating: newBody.internal_coating, // Corrigido aqui
                external_coating: newBody.external_coating,
                packing: newBody.packing,
                dispatch: newBody.dispatch,
                notes: newBody.notes,
                client_approval: newBody.client_approval,
                manager_approval: newBody.manager_approval,
                updated_by: updated_by,
            },
        });

        // Retorna o spool atualizado corretamente
        return NextResponse.json(updateSpool, {
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        if (err instanceof Error) {
            return new NextResponse(err.message, { status: 500 });
        }
        return new NextResponse("Unknown error occurred", { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ spool_id: string }> },
) {
    try {
        const resolvedParams = await params;
        const spool_id = resolvedParams.spool_id;
        if (!spool_id) {
            return new NextResponse("Spool_id not found", { status: 404 });
        }
        const spoolToDelete =
            await prismaBase!.fabrication_monitoring.findUnique({
                where: {
                    id: Number(spool_id),
                },
            });
        if (!spoolToDelete) {
            return new NextResponse("Spool not found", { status: 404 });
        }
        await prismaBase.$transaction([
            prismaBase.fabrication_monitoring.deleteMany({
                where: { id: spoolToDelete.id },
            }),
            prismaBase.fabrication_monitoring_log.deleteMany({
                where: { fabrication_monitoring_jobs_id: spoolToDelete.id },
            }),
        ]);

        // Retorna sucesso
        return new NextResponse(
            JSON.stringify({ message: "Job deleted successfully" }),
            { status: 200 },
        );
    } catch (err) {
        assert(err instanceof Error);
        return new NextResponse(err.message, { status: 500 });
    }
}
