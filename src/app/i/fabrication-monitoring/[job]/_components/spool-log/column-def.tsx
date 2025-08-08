import { FabricationMonitoringLog } from "@/app/api/fabrication-monitoring/log/[jobId]/route";
import { ColumnDef } from "@tanstack/react-table";

export const fabricationMonitoringLogColumns: ColumnDef<FabricationMonitoringLog>[] =
    [
        {
            id: "fabrication_monitoring_id",
            accessorKey: "fabrication_monitoring_id",

            header: ({ table }) => "Spool Id",
            cell: ({ row }) =>
                row.getValue("fabrication_monitoring_id") || "N/A",
            enableSorting: false,
            enableHiding: false,
        },
    ];
