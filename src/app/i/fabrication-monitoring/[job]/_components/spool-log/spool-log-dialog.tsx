import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollText } from "lucide-react";
import SpoolLogTable from "./spool-log-table";

interface Props {
    jobId: number;
    className?: string;
}

const SpoolLogDialog = ({ jobId, className }: Props) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="">
                    <ScrollText />
                    Log
                </Button>
            </DialogTrigger>
            <DialogContent className={`flex flex-col ${className ?? ""}`}>
                <DialogHeader>
                    <DialogTitle>Spool Change Log</DialogTitle>
                    <DialogDescription>
                        Any changes made, such as create, edit, or delete, will
                        be logged here. This log is immutable and cannot be
                        modified or deleted.
                    </DialogDescription>
                </DialogHeader>
                <SpoolLogTable jobId={jobId} />
            </DialogContent>
        </Dialog>
    );
};

export default SpoolLogDialog;
