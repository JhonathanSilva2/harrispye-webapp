"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import PDFViewer from "@/components/pdf-viewer";
interface PdfModalProps {
    children: React.ReactNode;
    pdfUrl: string;
}
export default function PdfModal({ children, pdfUrl }: PdfModalProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <DropdownMenuItem
                onClick={(event) => {
                    event.preventDefault(); // Evita fechar o dropdown
                    setOpen(true);
                }}
            >
                {children}
            </DropdownMenuItem>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-5xl p-4">
                    <DialogHeader>
                        <DialogTitle>View Drawing</DialogTitle>
                    </DialogHeader>
                    <PDFViewer fileUrl={pdfUrl} />
                </DialogContent>
            </Dialog>
        </>
    );
}
