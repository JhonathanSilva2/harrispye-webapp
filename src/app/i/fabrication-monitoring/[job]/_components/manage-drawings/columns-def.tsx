import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { fabrication_monitoring_designs } from "../../../../../../../prisma/generated/client-hp-base";

export const fabricationMonitoringDrawingColumns: ColumnDef<fabrication_monitoring_designs>[] =
    [
        {
            accessorKey: "id",
            header: "Nº",
        },
        {
            accessorKey: "display_name",
            header: "Drawing Name",
        },
        {
            accessorKey: "_actions",
            header: "Actions",
            cell: ({ row }) => <Button variant={"ghost"}>...</Button>,
            enableSorting: false,
        },
    ];
