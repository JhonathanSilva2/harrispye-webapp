import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { JSX, useState } from "react";

interface AlertDialogProps {
    actionText?: string;
    actionClassname?: string;
    triggerBtn: JSX.Element;
    onConfirm: () => void;
}

export function AlertDialogComponent({
    actionText = "",
    actionClassname = "",
    triggerBtn,
    onConfirm,
}: AlertDialogProps) {
    const [open, setOpen] = useState(false);

    function handleConfirm() {
        onConfirm();
        setOpen(false); // fecha o diálogo
    }
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>{triggerBtn}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {actionText}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        // className="bg-red-500 text-white hover:bg-red-600"
                        className={`${actionClassname}`}
                    >
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
