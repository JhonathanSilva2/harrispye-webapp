"use client";

import React, { useState, useCallback } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import PDFViewer from "@/components/pdf-viewer";

interface PdfModalProps {
    children: React.ReactNode;
    pdfUrl: string;
    open?: boolean; // controle externo opcional
    setOpen?: (open: boolean) => void; // controle externo opcional
}

export default function PdfModal({
    children,
    pdfUrl,
    open: controlledOpen,
    setOpen: controlledSetOpen,
}: PdfModalProps) {
    // estado interno, usado se não for controlado externamente
    const [uncontrolledOpen, setUncontrolledOpen] = useState(false);

    const isControlled =
        controlledOpen !== undefined && controlledSetOpen !== undefined;
    const open = isControlled ? controlledOpen : uncontrolledOpen;

    const setOpen = useCallback(
        (value: boolean) => {
            if (isControlled) {
                controlledSetOpen!(value);
            } else {
                setUncontrolledOpen(value);
            }
        },
        [isControlled, controlledSetOpen],
    );

    return (
        <>
            {/* Trigger */}
            <div
                className="mx-auto flex cursor-pointer items-center gap-2"
                onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setOpen(true);
                }}
            >
                {children}
            </div>

            {/* Modal */}
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
