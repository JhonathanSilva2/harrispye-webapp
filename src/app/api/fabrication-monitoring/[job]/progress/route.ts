import { prismaBase } from "@/db/base-client";
import assert from "assert";
import _ from "lodash";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ job: string }> },
) {
    try {
        const hp = (await params).job;
        if (!hp) {
            return new NextResponse("Job not found", { status: 404 });
        }

        const progress = await prismaBase.$transaction(async (tx) => {
            const job = await tx.fabrication_monitoring_jobs.findFirst({
                where: {
                    hp: hp,
                },
            });

            if (!job) {
                throw new Error("Job don't exists");
            }

            const progressFields = [
                "materials_ordered",
                "materials_arrived",
                "fabrication_complete",
                "ndt_complete",
                "pressure_test",
                "internal_coating",
                "external_coating",
                "packing",
                "dispatch",
            ];

            const aggregation = await tx.fabrication_monitoring.aggregate({
                where: {
                    id_fabrication_monitoring_jobs: job.id,
                },
                _count: { id: true },
                _sum: {
                    materials_ordered: true,
                    materials_arrived: true,
                    fabrication_complete: true,
                    ndt_complete: true,
                    pressure_test: true,
                    internal_coating: true,
                    external_coating: true,
                    packing: true,
                    dispatch: true,
                },
            });

            const totalSpools = aggregation._count.id;

            if (totalSpools === 0) {
                return "0.00";
            }

            const totalSum = _.sum(Object.values(aggregation._sum));
            const maxPossibleSum = totalSpools * progressFields.length;

            const progress = (totalSum / maxPossibleSum).toFixed(2);

            return progress;
        });

        return new NextResponse(progress, {
            status: 200,
        });
    } catch (err) {
        assert(err instanceof Error);
        console.error(err);
        return new NextResponse("Unexpected Error", {
            status: 500,
        });
    }
}
