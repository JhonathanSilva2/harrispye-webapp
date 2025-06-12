import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { fabrication_monitoring_designs } from "@/../prisma/generated/client-hp-base";
import { PlusCircle } from "lucide-react";
import { JSX, useState } from "react";
import { AddDrawingDialog } from "./add-drawing-dialog";
import { DrawingTable } from "./drawing-table";

interface DialogProps {
    jobId?: number;
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
    if (!jobId) {
        return null;
    }
    return (
        <Dialog onOpenChange={setOpen} open={open}>
            <DialogTrigger asChild>{triggerBtn}</DialogTrigger>
            <DialogContent className="max-h-[90vh] sm:max-w-[800px]">
                <div className="flex items-center justify-between">
                    <DialogHeader>
                        <DialogTitle className="mb-3">Drawings</DialogTitle>
                        <div className="flex justify-between">
                            <DialogDescription>
                                Manage Isometrics
                            </DialogDescription>
                        </div>
                    </DialogHeader>
                    <AddDrawingDialog
                        jobId={jobId}
                        open={fileDialogOpen}
                        setOpen={setFileDialogOpen}
                        triggerBtn={
                            <Button
                                variant="constructive"
                                className="flex items-center gap-1"
                            >
                                <PlusCircle /> Drawing
                            </Button>
                        }
                    />
                </div>
                <DrawingTable designs={designs ?? []} />
            </DialogContent>
        </Dialog>
    );
};
