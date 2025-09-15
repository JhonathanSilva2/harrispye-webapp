import { prismaBase } from "@/db/base-client";
import { FabricationMonitoringProgressWeight } from "@/lib/constants/fabrication-monitoring";
import { Prisma } from "prisma/generated/client-hp-base";

export const progressFields = [
    "materials_ordered",
    "materials_arrived",
    "fabrication_cutting",
    "fabrication_welding",
    "ndt_complete",
    "pressure_test",
    "internal_coating",
    "external_coating",
    "packing",
    "dispatch",
];

export async function getJobProgress(jobId: number) {
    const [row] = await prismaBase.$queryRaw<
        { weighted_progress: number }[]
    >(Prisma.sql`
        SELECT
          COALESCE(
            SUM(
              \`mass\` * (
                COALESCE(\`fabrication_cutting\`, 0) * ${FabricationMonitoringProgressWeight.fabrication_cutting} +
                COALESCE(\`fabrication_welding\`, 0) * ${FabricationMonitoringProgressWeight.fabrication_welding} +
                COALESCE(\`external_coating\`, 0) * ${FabricationMonitoringProgressWeight.external_coating}
              )
            ), 0
          ) / NULLIF(SUM(\`mass\`), 0) AS weighted_progress
        FROM \`fabrication_monitoring\`
        WHERE \`id_fabrication_monitoring_jobs\` = ${jobId};
      `);

    return Number(row?.weighted_progress ?? 0).toFixed(2);
}
