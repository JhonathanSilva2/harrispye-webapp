import { TPayload } from "@/app/types";
import { prismaBase } from "@/db/base-client";
import { getApiPagination, ValidSort } from "@/lib/pagination";
import { fabricationMonitoringJobCreateSchema } from "@/schemas/fabrication-monitoring-jobs";
import { fabrication_monitoring_jobs, Prisma } from "@prisma/client-hp-base";
import assert from "assert";
import _ from "lodash";
import { NextRequest, NextResponse } from "next/server";

export interface FabricationMonitoringFetchReturn
    extends fabrication_monitoring_jobs {
    progress: number;
    grossCost: number;
}

export async function GET(
    request: NextRequest,
): Promise<NextResponse<TPayload<FabricationMonitoringFetchReturn[]>>> {
    try {
        const urlObj = new URL(request.nextUrl);
        const validSort: ValidSort[] = [
            { key: "hp", type: "string" },
            { key: "mr_number", type: "string" },
            { key: "shutdown_id", type: "string" },
            { key: "client", type: "string" },
            { key: "po_number", type: "string" },
            { key: "contract_delivery_date", type: "date" },
            { key: "expected_delivery_date", type: "date" },
        ];

        const advancedFilterKeys: ValidSort[] = [
            { key: "hp", type: "string" },
            { key: "client", type: "string" },
            { key: "po_number", type: "string" },
            { key: "expected_delivery_date", type: "date" },
        ];

        const { page, pageSize, where, skip, take, orderBy } =
            getApiPagination<Prisma.fabrication_monitoring_jobsWhereInput>(
                urlObj,
                validSort,
                advancedFilterKeys,
            );

        const jobs = await prismaBase.fabrication_monitoring_jobs.findMany({
            where,
            skip,
            take,
            include: {
                fabrication_monitoring: true, // Include related fabrication_monitoring data
            },
            orderBy,
        });

        const jobsWithSummary = jobs.map((job) => {
            const spools = job.fabrication_monitoring;

            const progressFields = spools.reduce(
                (acc, spool) => {
                    const materials_ordered = spool.materials_ordered || 0;
                    const materials_arrived = spool.materials_arrived || 0;
                    const fabrication_complete =
                        spool.fabrication_complete || 0;
                    const ndt_complete = spool.ndt_complete || 0;
                    const pressure_test = spool.pressure_test || 0;
                    const internal_coating = spool.internal_coating || 0;
                    const external_coating = spool.external_coating || 0;
                    const packing = spool.packing || 0;
                    const dispatch = spool.dispatch || 0;

                    const progress = {
                        materials_ordered:
                            acc.materials_ordered + materials_ordered,
                        materials_arrived:
                            acc.materials_arrived + materials_arrived,
                        fabrication_complete:
                            acc.fabrication_complete + fabrication_complete,
                        ndt_complete: acc.ndt_complete + ndt_complete,
                        pressure_test: acc.pressure_test + pressure_test,
                        internal_coating:
                            acc.internal_coating + internal_coating,
                        external_coating:
                            acc.external_coating + external_coating,
                        packing: acc.packing + packing,
                        dispatch: acc.dispatch + dispatch,
                    };

                    return {
                        ...progress,
                    };
                },
                {
                    materials_ordered: 0,
                    materials_arrived: 0,
                    fabrication_complete: 0,
                    ndt_complete: 0,
                    pressure_test: 0,
                    internal_coating: 0,
                    external_coating: 0,
                    packing: 0,
                    dispatch: 0,
                },
            );

            const progressValues = Object.values(progressFields);
            const progressTotal = _.sum(progressValues);
            const progress = (
                progressTotal /
                (spools.length * progressValues.length)
            ).toFixed(2);

            const grossCost = spools.reduce((acc, grossCost) => {
                const parseDecimal = Number(grossCost.gross_spool_cost) || 0;
                return acc + parseDecimal;
            }, 0);

            return {
                ...job,
                progress,
                grossCost,
            };
        });

        const jobsCount = await prismaBase.fabrication_monitoring_jobs.count({
            where,
        });

        const payload: TPayload<typeof jobsWithSummary> = {
            data: jobsWithSummary,
            page,
            pageSize,
            rowCount: jobsCount,
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
 * @description Endpoint para criação de um novo job de monitoramento de fabricação.
 *
 * **Campos obrigatórios (Required Fields):**
 * - `hp` (string): Identificador único do job de monitoramento de fabricação.
 * - `client` (string): Nome do cliente.
 * - `po_number` (string): Número do pedido.
 * - `contract_delivery_date` (date): Data de entrega do contrato.
 * - `expected_delivery_date` (date): Data esperada para a entrega.
 *
 * **Campos permitidos (Permitted Fields):**
 * - `mr_number` (string, opcional): Número do MR (Material Requisition).
 * - `shutdown_id` (string, opcional): ID de desligamento.
 *
 * O endpoint valida os dados fornecidos e garante que não existam jobs duplicados no banco de dados. Caso o job já exista, um erro 409 será retornado. Se os dados estiverem incorretos, será retornado um erro 400.
 *
 * @param {NextRequest} request - A requisição HTTP contendo os dados do job a ser criado.
 *
 * @returns {NextResponse} - Retorna a resposta adequada com status e dados do job criado ou erro.
 *
 * @throws {Error} - Lança erro caso ocorra algum problema durante o processamento (por exemplo, erro de banco de dados).
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validation = fabricationMonitoringJobCreateSchema.safeParse(body);
        if (!validation.success)
            return NextResponse.json(validation.error.format(), {
                status: 400,
            });

        const newBody = validation.data;
        const duplicate =
            await prismaBase.fabrication_monitoring_jobs.findUnique({
                where: {
                    hp: newBody.hp,
                },
            });
        if (duplicate)
            return NextResponse.json(
                { message: "Duplicate Job" },
                { status: 409 },
            );

        const newJob = await prismaBase.fabrication_monitoring_jobs.create({
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
        return new NextResponse(JSON.stringify(newJob, null, 4), {
            status: 201,
        });
    } catch (err) {
        assert(err instanceof Error);
        return new NextResponse(err.message, { status: 500 });
    }
}
