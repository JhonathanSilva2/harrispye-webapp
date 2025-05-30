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
import { JSX } from "react";

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
	return (
		<AlertDialog>
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
						onClick={onConfirm}
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
