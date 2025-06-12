import { TPayload } from "@/app/types";
import { prismaBase } from "@/db/base-client";
import { getApiPagination, ValidSort } from "@/lib/pagination";
import { Prisma } from "@prisma/client";
import assert from "assert";
import { NextRequest, NextResponse } from "next/server";

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
        const validSort: ValidSort[] = [];

        const advancedFilterKeys: ValidSort[] = [];

        const { page, pageSize, where, skip, take, orderBy } =
            getApiPagination<Prisma.fabrication_monitoring_logWhereInput>(
                urlObj,
                validSort,
                advancedFilterKeys,
            );

        const data = await prismaBase.fabrication_monitoring_log.findMany({
            skip,
            take,
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
            orderBy,
        });

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
