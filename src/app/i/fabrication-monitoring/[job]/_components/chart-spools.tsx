import React from "react";
import JobCharts from "./job-charts";
import { PieChartApprovals } from "./pie-chart-approval";
import { Payload } from "prisma/generated/client-hp-base/runtime/library";

import { FabricationMonitoringSpoolsFetchReturn } from "@/app/api/fabrication-monitoring/[job]/route";
import { formatMoney } from "@/utils/format-currency";
import { ChartLegend } from "./chart-legend";
import { Skeleton } from "@/components/ui/skeleton";

interface ApprovedType {
    APPROVED: number;
    DECLINED: number;
    PENDING: number;
}

interface ChartLegendProps {
    data: Payload<FabricationMonitoringSpoolsFetchReturn> | undefined;
    loading: boolean;
}
export default function ChartSpools({ data, loading }: ChartLegendProps) {
    const approvals = data?.data?.summary?.approvals;
    const spoolsCount = data?.data?.summary["Spools Count"] ?? 0;
    const grossSpoolCostByApproval = data?.data?.summary[
        "Gross Spool Cost By Approval"
    ] as ApprovedType;
    const approvalChartDescription = {
        label: "spools",
        value: String(spoolsCount),
    };
    const grossSpoolCostChartDescription = {
        label: "Gross Cost",
        value: String(
            formatMoney(
                Number(data?.data?.summary["Total Gross Spool Cost"] ?? 0),
            ),
        ),
    };

    return loading ? (
        <div className="flex justify-center gap-x-5">
            <Skeleton className="min min-h-[250px] w-1/4 rounded-xl" />
            <Skeleton className="min min-h-[250px] w-1/4 rounded-xl" />
        </div>
    ) : (
        <div className="flex justify-center" data-cy="chartSpools">
            <JobCharts title={""} description={""}>
                <PieChartApprovals
                    title={""}
                    description={""}
                    data={approvals}
                    totalsDescription={approvalChartDescription}
                />
                <ChartLegend />

                <PieChartApprovals
                    title={""}
                    description={""}
                    data={grossSpoolCostByApproval}
                    moeda={"BRL"}
                    totalsDescription={grossSpoolCostChartDescription}
                />
            </JobCharts>
        </div>
    );
}
