import { StringDictionary, TPayload } from "@/app/types";
import { prismaBase } from "@/db/base-client";
import { getApiPagination, ValidSort } from "@/lib/pagination";
import { Prisma } from "@/../prisma/generated/client-hp-base";
import assert from "assert";
import { NextRequest, NextResponse } from "next/server";

export interface FabricationMonitoringLog {
    id: number;
    method: string;
    fabrication_monitoring_id: number;
    fabrication_monitoring_jobs_id: number;
    previous_state: string;
    new_state: string;
    updated_by: string | null;
    updated_at: Date | null;
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ jobId: string }> },
) {
    try {
        const jobId = (await params).jobId;
        if (!jobId)
            return NextResponse.json(
                { message: "Job ID must be provided" },
                { status: 400 },
            );

        if (Number.isNaN(Number(jobId)))
            return NextResponse.json(
                { message: "Invalid job ID" },
                { status: 400 },
            );

        const id = parseInt(jobId);

        const urlObj = new URL(request.url);
        const validSort: ValidSort[] = [
            {
                key: "updated_at",
                type: "date",
            },
        ];

        const advancedFilterKeys: ValidSort[] = [
            {
                key: "updated_by",
                type: "string",
            },
            {
                key: "method",
                type: "string",
            },
        ];

        const defaultOrderBy: StringDictionary = {
            id: "desc",
        };

        const { page, pageSize, where, skip, take, orderBy } =
            getApiPagination<Prisma.fabrication_monitoring_logWhereInput>(
                urlObj,
                validSort,
                advancedFilterKeys,
            );


        const { data, rowCount } = await prismaBase.$transaction(async (tx) => {
            const rawLogs =
                await prismaBase.fabrication_monitoring_log.findMany({
                    skip,
                    take,
                    where: {
                        AND: [
                            {
                                previous_state: {
                                    not: "{}",
                                },
                            },
                            {
                                new_state: {
                                    not: "{}",
                                },
                            },
                        ],
                        ...where,
                        fabrication_monitoring_jobs_id: id,
                    },
                    orderBy: orderBy ? orderBy : defaultOrderBy,
                });

            const logs = await Promise.all(
                rawLogs.map(async (log) => {
                    const userHp = log.updated_by
                        ? parseInt(log.updated_by.toString())
                        : null;

                    if (!userHp)
                        return {
                            ...log,
                            updated_by: log.updated_by.toString(),
                        };

                    const user = await tx.users.findFirst({
                        where: {
                            hp_registration: userHp,
                        },
                    });

                    if (!user)
                        return {
                            ...log,
                            updated_by: log.updated_by.toString(),
                        };

                    const userSystemName = user.username.split("@")[0];

                    return {
                        ...log,
                        updated_by: userSystemName,
                    };
                }),
            );

            const rowCount = await prismaBase.fabrication_monitoring_log.count({
                where: {
                    ...where,
                    AND: [
                        {
                            previous_state: {
                                not: "{}",
                            },
                        },
                        {
                            new_state: {
                                not: "{}",
                            },
                        },
                    ],
                    fabrication_monitoring_jobs_id: id,
                },
            });

            return {
                data: logs,
                rowCount,
            };
        });

        const payload: TPayload<typeof data> = {
            data,
            page,
            pageSize,
            rowCount,
        };

        return NextResponse.json(payload);
    } catch (err) {
        assert(err instanceof Error);
        return NextResponse.json({ message: err.message });
    }
}
