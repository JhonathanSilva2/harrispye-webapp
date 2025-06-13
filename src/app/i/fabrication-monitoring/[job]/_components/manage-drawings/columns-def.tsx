import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fabrication_monitoring_designs } from "@/../prisma/generated/client-hp-base";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import PdfModal from "./pdf-dialog";

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
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const url = `/api/fabrication-monitoring/designs/${row.original.id}`;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel className="text-center">
                                Actions
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <PdfModal pdfUrl={url}>Open Dialog</PdfModal>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
