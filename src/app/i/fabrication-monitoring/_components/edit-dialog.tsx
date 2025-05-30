import { AlertDialogComponent } from "@/components/alert";
import GenericInput from "@/components/forms/generic-inputs";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
	useCreateJob,
	useFabMon,
	useUpdateJob,
} from "@/hooks/query/use-fab-mon";
import { FabricationForm, FabricationFormData } from "@/schemas/fab-mon";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { JSX, useCallback, useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";

interface DialogProps {
	hp?: string;
	open: boolean;
	setOpen: (open: boolean) => void;
	triggerBtn?: JSX.Element;
	mode: "edit" | "create";
}

const handleDate = (dateString: Date) =>
	dateString ? new Date(dateString).toISOString().split("T")[0] : "";

const defaultValues: Partial<FabricationFormData> = {
	hp: "",
	client: "",
	contract_delivery_date: "",
	expected_delivery_date: "",
	po_number: "",
	mr_number: "",
	shutdown_id: "",
};

export const EditDialog = ({
	open,
	setOpen,
	triggerBtn,
	hp,
	mode,
}: DialogProps) => {
	const { data, isLoading } = useFabMon({ hp: hp || "" });
	const job = data?.data.job;
	const methods = useForm<FabricationFormData>({
		resolver: zodResolver(FabricationForm),
		defaultValues: useMemo(() => defaultValues, []),
	});
	const updateJobMutation = useUpdateJob(hp!);
	const createJobMutation = useCreateJob();

	const mutation = mode === "edit" ? updateJobMutation : createJobMutation;

	useEffect(() => {
		if (isLoading) return;
		if (mode === "edit" && job) {
			methods.reset({
				hp: job.hp,
				client: job.client,
				contract_delivery_date: handleDate(job.contract_delivery_date),
				expected_delivery_date: handleDate(job.expected_delivery_date),
				po_number: job.po_number,
				mr_number: job.mr_number ?? undefined,
				shutdown_id: job.shutdown_id ?? undefined,
			});
		} else if (mode === "create") {
			methods.reset(defaultValues);
		}
	}, [isLoading, job, methods, mode]);

	const onSubmit = useCallback(
		async (data: FabricationFormData) => {
			try {
				await mutation.mutateAsync(data);
				setOpen(false);
			} catch (error) {
				console.error("Error:", error);
			}
		},
		[mutation, setOpen],
	);

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger asChild>{triggerBtn}</DialogTrigger>
			<DialogContent className="max-h-[90vh] sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>
						{mode === "edit" ? `Edit ${hp}` : "Create Job"}
					</DialogTitle>
					<DialogDescription>
						{mode === "edit"
							? "Make changes to the job. Click save changes when done."
							: "Fill in the details to create a new job."}
					</DialogDescription>
				</DialogHeader>
				<FormProvider {...methods}>
					{isLoading ? (
						<div className="max-h-[90vh] space-y-5 sm:max-w-[500px]">
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-10 w-full" />
						</div>
					) : (
						<form
							onSubmit={methods.handleSubmit(onSubmit)}
							className="space-y-4"
						>
							<GenericInput name={"hp"} label={"HP"} />
							<GenericInput
								name={"client"}
								label={"Client Name"}
							/>
							<div className="grid grid-cols-2 gap-4">
								<GenericInput
									name={"contract_delivery_date"}
									type="date"
									label={"Contract Delivery Date"}
								/>
								<GenericInput
									name={"expected_delivery_date"}
									type="date"
									label={"Expect Delivery Date"}
								/>

								<GenericInput
									name={"po_number"}
									label={"PO Number"}
								/>
								<GenericInput
									name={"mr_number"}
									label={"MR Number"}
								/>
							</div>
							<GenericInput
								name={"shutdown_id"}
								label={"Shutdown ID"}
							/>
						</form>
					)}
				</FormProvider>
				<DialogFooter>
					<AlertDialogComponent
						actionText="This operation is irreversible. Please confirm that all data is accurate before proceeding."
						triggerBtn={
							<Button
								type="button"
								className="mt-2 w-full"
								disabled={isLoading}
							>
								{isLoading ? (
									<Loader2 className="animate-spin" />
								) : mode === "edit" ? (
									"Confirm Changes"
								) : (
									"Confirm Data"
								)}
							</Button>
						}
						onConfirm={methods.handleSubmit(onSubmit)}
					/>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
