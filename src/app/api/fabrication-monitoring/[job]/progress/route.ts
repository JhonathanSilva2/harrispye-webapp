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

            const spools = await tx.fabrication_monitoring.findMany({
                where: {
                    id_fabrication_monitoring_jobs: job.id,
                },
            });

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

            return progress;
        });

        return new NextResponse(progress, {
            status: 200,
        });
    } catch (err) {
        assert(err instanceof Error);
        return new NextResponse("Unexpected Error", {
            status: 500,
        });
    }
}
