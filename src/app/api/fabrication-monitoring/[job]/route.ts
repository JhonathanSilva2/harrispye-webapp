import {
    fabrication_monitoring,
    fabrication_monitoring_designs,
    fabrication_monitoring_jobs,
    Prisma,
} from "@/../prisma/generated/client-hp-base";
import options from "@/app/api/auth/[...nextauth]/options";
import { fetchProgress } from "@/app/i/fabrication-monitoring/[job]/_actions/fetch-progress";
import { TPayload } from "@/app/types";
import { prismaBase } from "@/db/base-client";
import { getApiPagination, ValidSort } from "@/lib/pagination";
import { fabricationMonitoringJobUpdateSchema } from "@/schemas/fabrication-monitoring-jobs";
import assert from "assert";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export interface FabricationMonitoringSpoolsFetchReturn {
    job: fabrication_monitoring_jobs;
    spools: fabrication_monitoring[];
    designs: fabrication_monitoring_designs[];
    summary: Summary;
}

interface Summary {
    approvals: {
        APPROVED: number;
        DECLINED: number;
        PENDING: number;
    };
    "Gross Spool Cost By Approval": {
        APPROVED: number | Prisma.Decimal;
        DECLINED: number | Prisma.Decimal;
        PENDING: number | Prisma.Decimal;
    };
    "Spools Count": number;
    "Approved Spools": number;
    "Total Mass": number | Prisma.Decimal;
    "Total Gross Spool Cost": number | Prisma.Decimal;
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ job: string }> },
): Promise<NextResponse<TPayload<FabricationMonitoringSpoolsFetchReturn>>> {
    try {
        const hp = (await params).job;
        if (!hp) {
            return new NextResponse("Job not found", { status: 404 });
        }
        const urlObj = new URL(request.url);
        const validSort: ValidSort[] = [
            {
                key: "drawing_ref",
                type: "string",
            },
            {
                key: "spool_number",
                type: "string",
            },
            {
                key: "description",
                type: "string",
            },
            {
                key: "client_approval",
                type: "enum",
            },
            {
                key: "manager_approval",
                type: "enum",
            },
            {
                key: "spec",
                type: "string",
            },
            {
                key: "mass",
                type: "number",
            },
            {
                key: "price_per_kg",
                type: "number",
            },
            {
                key: "gross_spool_cost",
                type: "number",
            },
            {
                key: "dispatch",
                type: "number",
            },
            {
                key: "notes",
                type: "string",
            },
        ];

        const advancedFilterKeys: ValidSort[] = [
            {
                key: "drawing_ref",
                type: "string",
            },
            {
                key: "spool_number",
                type: "string",
            },
            {
                key: "description",
                type: "string",
            },
            {
                key: "client_approval",
                type: "enum",
            },
            {
                key: "manager_approval",
                type: "enum",
            },
            {
                key: "spec",
                type: "string",
            },
            {
                key: "mass",
                type: "number",
            },
            {
                key: "price_per_kg",
                type: "number",
            },
            {
                key: "gross_spool_cost",
                type: "number",
            },
            {
                key: "dispatch",
                type: "number",
            },
            {
                key: "notes",
                type: "string",
            },
        ];

        const { page, pageSize, where, skip, take, orderBy } =
            getApiPagination<Prisma.fabrication_monitoringWhereInput>(
                urlObj,
                validSort,
                advancedFilterKeys,
            );

        const job = await prismaBase.fabrication_monitoring_jobs.findFirst({
            where: {
                hp,
            },
        });

        if (!job) {
            return new NextResponse("Job not found", { status: 404 });
        }

        const spools = await prismaBase.fabrication_monitoring.findMany({
            where: {
                id_fabrication_monitoring_jobs: job!.id,
                ...where,
            },
            include: {
                fabrication_monitoring_designs: true,
            },
            skip,
            take,
            orderBy,
        });

        const spoolsRowCount =
            await prismaBase.fabrication_monitoring.aggregate({
                where: {
                    id_fabrication_monitoring_jobs: job!.id,
                    ...where,
                },
                _count: {
                    id: true,
                },
            });

        // pegar o total de spools gross cost e mass
        const summary = await prismaBase.fabrication_monitoring.aggregate({
            _sum: {
                mass: true,
                gross_spool_cost: true,
            },
            _count: {
                id: true,
            },
            where: {
                id_fabrication_monitoring_jobs: job!.id,
            },
        });
        // pegar o total gross cost por approval
        // retorna total_approved_gross_cost, total_declined_gross_cost, total_pending_gross_cost
        const summaryApprovals =
            await prismaBase!.fabrication_monitoring.groupBy({
                by: ["client_approval"],
                _sum: {
                    gross_spool_cost: true,
                },
                where: {
                    id_fabrication_monitoring_jobs: job!.id,
                },
            });

        const approvalsDb = await prismaBase.fabrication_monitoring.groupBy({
            by: ["client_approval"],
            _count: {
                client_approval: true,
            },
            where: {
                id_fabrication_monitoring_jobs: job!.id,
            },
        });

        const approvals = {
            APPROVED:
                approvalsDb.find(
                    (approval) => approval.client_approval === "APPROVED",
                )?._count.client_approval || 0,
            DECLINED:
                approvalsDb.find(
                    (approval) => approval.client_approval === "DECLINED",
                )?._count.client_approval || 0,
            PENDING:
                approvalsDb.find(
                    (approval) => approval.client_approval === "PENDING",
                )?._count.client_approval || 0,
        };
        const groosCostApprovals = {
            APPROVED:
                Number(
                    summaryApprovals.find(
                        (approval) => approval.client_approval === "APPROVED",
                    )?._sum.gross_spool_cost,
                ) || 0,
            DECLINED:
                Number(
                    summaryApprovals.find(
                        (approval) => approval.client_approval === "DECLINED",
                    )?._sum.gross_spool_cost,
                ) || 0,
            PENDING:
                Number(
                    summaryApprovals.find(
                        (approval) => approval.client_approval === "PENDING",
                    )?._sum.gross_spool_cost,
                ) || 0,
        };

        const designs =
            await prismaBase!.fabrication_monitoring_designs.findMany({
                where: {
                    fabrication_monitoring_jobs_id: job!.id,
                },
            });

        const progress = await fetchProgress({
            hp: job.hp,
        });

        console.log(progress);

        const data = {
            job,
            spools,
            designs,
            progress,
            summary: {
                approvals,
                "Spools Count": summary._count.id,
                "Approved Spools": designs.length,
                "Total Mass": summary._sum.mass || 0,
                "Gross Spool Cost By Approval": groosCostApprovals || {},
                "Total Gross Spool Cost": summary._sum.gross_spool_cost || 0,
                Progress: progress.data || 0,
            },
        };

        const payload: TPayload<FabricationMonitoringSpoolsFetchReturn> = {
            data,
            page,
            pageSize,
            rowCount: spoolsRowCount._count.id,
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
/**
 * @description Endpoint para atualização de um job de monitoramento de fabricação.
 *
 * **Campos obrigatórios (Required Fields):**
 * - `id` (number): ID do job a ser atualizado.
 * - `hp` (string): Identificador único do job de monitoramento de fabricação.
 * - `client` (string): Nome do cliente.
 * - `po_number` (string): Número do pedido.
 * - `contract_delivery_date` (date): Data de entrega do contrato.
 * - `expected_delivery_date` (date): Data esperada para a entrega.
 * - `mr_number` (string, opcional): Número do MR (Material Requisition).
 * - `shutdown_id` (string, opcional): ID de desligamento.
 *
 * O endpoint valida os dados fornecidos e garante que o job a ser atualizado exista no banco de dados. Caso o job não exista, um erro 404 será retornado. Se os dados estiverem incorretos, será retornado um erro 400.
 *
 * @param {NextRequest} request - A requisição HTTP contendo os dados do job a ser atualizado.
 *
 * @returns {NextResponse} - Retorna a resposta adequada com status e dados do job atualizado ou erro.
 *
 * @throws {Error} - Lança erro caso ocorra algum problema durante o processamento (por exemplo, erro de banco de dados).
 */

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ job: string }> },
) {
    const job = (await params).job;
    if (!job) return new NextResponse("Job not found", { status: 404 });

    try {
        const jobToUpdate =
            await prismaBase.fabrication_monitoring_jobs.findUnique({
                where: {
                    hp: job,
                },
            });

        if (!jobToUpdate)
            return new NextResponse("Job not found", { status: 404 });

        // Validar o corpo da requisição
        const body = await request.json();
        // Verifica se o corpo está vazio
        if (Object.keys(body).length === 0)
            return new NextResponse("At least one field must be provided", {
                status: 400,
            });
        // caso tenha só o id retorna erro, pois não é permitido atualizar só o id
        if (Object.keys(body).length === 1 && body.id)
            return new NextResponse("ID cannot be updated", { status: 400 });

        const validation = fabricationMonitoringJobUpdateSchema.safeParse(body);
        if (!validation.success)
            return NextResponse.json(validation.error.format(), {
                status: 400,
            });

        const newBody = validation.data;

        if (newBody.hp) {
            const duplicate =
                await prismaBase.fabrication_monitoring_jobs.findFirst({
                    where: {
                        hp: newBody.hp,
                        id: { not: jobToUpdate.id }, // Verificar duplicação, mas ignorar o próprio ID
                    },
                });

            if (duplicate) {
                return NextResponse.json(
                    { message: "Duplicate Job" },
                    { status: 409 },
                );
            }
        }

        const updatedJob = await prismaBase.fabrication_monitoring_jobs.update({
            where: {
                id: jobToUpdate.id,
            },
            data: {
                hp: newBody.hp,
                client: newBody.client,
                po_number: newBody.po_number,
                contract_delivery_date: newBody.contract_delivery_date,
                expected_delivery_date: newBody.expected_delivery_date,
                mr_number: newBody.mr_number,
                shutdown_id: newBody.shutdown_id,
            },
        });

        // Retornar a resposta com o job atualizado
        return new NextResponse(JSON.stringify(updatedJob, null, 4), {
            status: 200,
        });
    } catch (err) {
        assert(err instanceof Error);
        return new NextResponse(err.message, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ job: string }> },
) {
    try {
        const session = await getServerSession(options);
        if (!session || !session.user.hp_registration) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const job = (await params).job;
        if (!job) {
            return new NextResponse("Job not found", { status: 404 });
        }
        const jobToDelete =
            await prismaBase!.fabrication_monitoring_jobs.findFirst({
                where: {
                    hp: job,
                },
            });
        if (!jobToDelete) {
            return new NextResponse("Job not found", { status: 404 });
        }
        await prismaBase.$transaction([
            prismaBase.fabrication_monitoring.deleteMany({
                where: {
                    id_fabrication_monitoring_jobs: jobToDelete.id,
                    updated_by: session.user.hp_registration,
                },
            }),
            prismaBase.fabrication_monitoring_log.deleteMany({
                where: { fabrication_monitoring_jobs_id: jobToDelete.id },
            }),
            prismaBase.fabrication_monitoring_designs.deleteMany({
                where: { fabrication_monitoring_jobs_id: jobToDelete.id },
            }),
            prismaBase.fabrication_monitoring_jobs.delete({
                where: { id: jobToDelete.id },
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

// create spool
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ job: string }> },
) {
    const session = await getServerSession(options);
    const updated_by = session?.user.hp_registration;
    if (!updated_by) {
        return NextResponse.json(
            { message: "User not found" },
            { status: 400 },
        ); // Retorne uma resposta com status e mensagem
    }
    console.error("É necessario implementar o updated_by");
    const job = (await params).job;
    if (!job) {
        return new NextResponse("Job not found", { status: 404 });
    }
    try {
        const targetJob =
            await prismaBase.fabrication_monitoring_jobs.findUnique({
                where: {
                    hp: job,
                },
            });

        if (!targetJob)
            return new NextResponse("Job not found", { status: 404 });
        const createSpool = await prismaBase.fabrication_monitoring.create({
            data: {
                id_fabrication_monitoring_jobs: targetJob.id,
                spool_number: "",
                updated_by: updated_by,
            },
        });
        return new NextResponse(JSON.stringify(createSpool, null, 4), {
            status: 201,
        });
    } catch (err) {
        assert(err instanceof Error);
        return new NextResponse(err.message, { status: 500 });
    }
}
