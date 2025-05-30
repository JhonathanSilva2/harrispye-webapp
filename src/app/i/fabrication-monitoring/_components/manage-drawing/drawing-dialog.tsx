import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { JSX, useState } from "react";
import { fabrication_monitoring_designs } from "../../../../../../prisma/generated/client-hp-base";

import { DrawingTable } from "./drawing-table";
import { FileDialog } from "./file-dialog";

interface DialogProps {
    jobId: string;

    designs?: fabrication_monitoring_designs[];
    open: boolean;
    setOpen: (open: boolean) => void;
    triggerBtn?: JSX.Element;
}

export const DrawingDialog = ({
    jobId,
    open,
    setOpen,
    triggerBtn,
    designs,
}: DialogProps) => {
    const [fileDialogOpen, setFileDialogOpen] = useState(false);

    return (
        <Dialog onOpenChange={setOpen} open={open}>
            <DialogTrigger asChild>{triggerBtn}</DialogTrigger>
            <DialogContent className="max-h-[90vh] sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle className="mb-3">Drawings</DialogTitle>
                    <div className="flex justify-between">
                        <DialogDescription>Manage Isometrics</DialogDescription>
                        <FileDialog
                            jobId={jobId}
                            open={fileDialogOpen}
                            setOpen={setFileDialogOpen}
                            triggerBtn={
                                <Button
                                    variant="outline"
                                    className="flex items-center gap-2"
                                >
                                    <span className="w-full">Add Drawing</span>
                                </Button>
                            }
                        />
                    </div>
                </DialogHeader>
                <DrawingTable designs={designs ?? []} />
            </DialogContent>
        </Dialog>
    );
};
