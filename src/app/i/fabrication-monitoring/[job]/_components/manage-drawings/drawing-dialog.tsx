import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { JSX, useState } from "react";
import { fabrication_monitoring_designs } from "../../../../../../../prisma/generated/client-hp-base";
import { DrawingTable } from "./drawing-table";
import { useCreateDrawing } from "@/hooks/query/use-create-drawing";
import { UploadFileDialog } from "@/components/upload-file-dialog";

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

    const mutation = useCreateDrawing(jobId);
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
                    <UploadFileDialog
                        createFile={mutation}
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

                <div className="max-h-[65vh] overflow-y-auto px-4">
                    <DrawingTable designs={designs ?? []} />
                </div>
            </DialogContent>
        </Dialog>
    );
};
