import { FabricationMonitoringLog } from "@/app/api/fabrication-monitoring/log/[jobId]/route";
import { Separator } from "@/components/ui/separator";
import { capitalizeWords } from "@/utils/capiteliza-all-words";
import { ColumnDef } from "@tanstack/react-table";

export const fabricationMonitoringLogColumns: ColumnDef<FabricationMonitoringLog>[] =
    [
        {
            id: "id",
            accessorKey: "id",
            header: () => "At",
            cell: ({ row }) => {
                const date = row.original.updated_at;
                return date ? new Date(date).toLocaleString() : "Unknown";
            },
            enableSorting: false,
            enableHiding: false,
        },
        {
            id: "fabrication_monitoring_id",
            accessorKey: "fabrication_monitoring_id",
            header: () => "Action",
            cell: ({ row }) => {
                const previousStateRaw = JSON.parse(
                    row.original.previous_state,
                );
                const message = `{{USER}} {{ACTION}} {{COLUMN}}`;
                const user = row.original.updated_by;
                const method = row.original.method;
                const columns = Object.keys(previousStateRaw).map((e) =>
                    capitalizeWords(e.replaceAll("_", " ")),
                );
                return (
                    <span>
                        {`${user || "Unknown"}`}&nbsp;
                        <span className="text-blue-400">
                            {method.toLowerCase() || "unknown"}
                        </span>
                        <Separator />
                        {columns.join(", ") || "Unknown"}
                    </span>
                );
            },
            enableSorting: false,
            enableHiding: false,
        },
        {
            id: "new_state",
            accessorKey: "new_state",
            header: () => "Value",
            cell: ({ row }) => {
                const previousStateRaw = JSON.parse(
                    row.original.previous_state,
                );
                const newStateRaw = JSON.parse(row.original.new_state);
                const previousState = Object.values(previousStateRaw);
                const newState = Object.values(newStateRaw);
                return (
                    <span className="italic">
                        <span className="text-neutral-400">
                            {previousState.join(", ") || "New"}
                        </span>
                        &nbsp;
                        <span>{`=>`}</span>&nbsp;
                        <span className="text-blue-400">
                            {newState.join(", ") || "Unknown"}
                        </span>
                    </span>
                );
            },
            enableSorting: false,
            enableHiding: false,
        },
    ];
