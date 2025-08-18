import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fabrication_monitoring_designs } from "@/../prisma/generated/client-hp-base";
import { ColumnDef } from "@tanstack/react-table";
import { FileText, MoreHorizontal, Trash2 } from "lucide-react";
import PdfModal from "./pdf-dialog";
import { Separator } from "@/components/ui/separator";
import DeleteDrawingButton from "./delete-drawing-button";
import { DrawingActions } from "./drawing-actions";

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
            cell: ({ row }) => <DrawingActions drawingId={row.original.id} />,
        },
    ];
