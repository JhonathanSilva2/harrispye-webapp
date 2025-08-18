import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileText, MoreHorizontal } from "lucide-react";
import React from "react";
import DeleteDrawingButton from "./delete-drawing-button";
import PdfModal from "./pdf-dialog";

// Componente para a coluna de ações
export function DrawingActions({ drawingId }: { drawingId: number }) {
    const [open, setOpen] = React.useState(false);
    const url = `/api/fabrication-monitoring/designs/${drawingId}`;

    return (
        <>
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

                    <DropdownMenuItem
                        onSelect={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setOpen(true);
                        }}
                    >
                        <div
                            className="flex cursor-pointer items-center gap-2"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <FileText />
                            <PdfModal
                                pdfUrl={url}
                                open={open}
                                setOpen={setOpen}
                            >
                                Open
                            </PdfModal>
                        </div>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <DeleteDrawingButton url={url} drawingId={drawingId} />
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
