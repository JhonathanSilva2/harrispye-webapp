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
import { useAttribute } from "@/hooks/query/use-attributes";
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
    client_ref: "",
    job_description: "",
    project_manager: "",
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
    const organization = useAttribute("organizations");
    const organizationOptions =
        organization && organization.data
            ? organization.data.map((org) => ({
                  value: org.id,
                  label: org.organization,
              }))
            : [];

    const mutation = mode === "edit" ? updateJobMutation : createJobMutation;
    const loading = isLoading || organization.isLoading;
    useEffect(() => {
        if (loading) return;
        if (mode === "edit" && job) {
            methods.reset({
                hp: job.hp,
                client: job.client,
                contract_delivery_date: handleDate(job.contract_delivery_date),
                expected_delivery_date: handleDate(job.expected_delivery_date),
                po_number: job.po_number,
                client_ref: job.client_ref ?? "",
                organization_id: job.organization_id ?? undefined,
                job_description: job.job_description ?? undefined,
                project_manager: job.project_manager ?? undefined,
            });
        } else if (mode === "create") {
            methods.reset(defaultValues);
        }
    }, [loading, job, methods, mode]);

    const onSubmit = useCallback(
        async (data: FabricationFormData) => {
            console.log("Submitting data:", data);
            try {
                await mutation.mutateAsync(data);
                setOpen(false);
            } catch (error) {
                console.error("Error:", error);
            }
        },
        [mutation, setOpen],
    );
    const skeletonList = [
        "HP",
        "PO Number",
        "Client Name",
        "Organization",
        "Contract Delivery Date",
        "Expected Delivery Date",
        "Client Ref",
        "Project Manager",
        "Job Description",
    ];
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
                    {loading ? (
                        <div className="max-h-[90vh] space-y-4 sm:max-w-[500px]">
                            <div className="grid grid-cols-2 gap-4">
                                {skeletonList.map((item) => (
                                    <div className="" key={item}>
                                        <div className="mb-2">{item}</div>
                                        <Skeleton className="h-8 w-full" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <form
                            onSubmit={methods.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <GenericInput
                                    name={"hp"}
                                    label={"HP"}
                                    placeholder="Ex: HP-12345"
                                />
                                <GenericInput
                                    name={"po_number"}
                                    label={"PO Number"}
                                    placeholder="Enter PO Number"
                                />
                                <GenericInput
                                    name={"client"}
                                    label={"Client Name"}
                                    placeholder="Ex: Client Name - MV33"
                                />
                                <GenericInput
                                    name={"organization_id"}
                                    label={"Organization"}
                                    type="combobox"
                                    placeholder="Select organization"
                                    options={organizationOptions}
                                />
                                <GenericInput
                                    name={"contract_delivery_date"}
                                    type="date"
                                    label={"Contract Delivery Date"}
                                    placeholder="Select date"
                                />
                                <GenericInput
                                    name={"expected_delivery_date"}
                                    type="date"
                                    label={"Expect Delivery Date"}
                                />
                                <GenericInput
                                    name={"client_ref"}
                                    label={"Client Ref"}
                                    placeholder="Enter Client Ref"
                                />
                                <GenericInput
                                    name={"project_manager"}
                                    label={"Project Manager"}
                                    placeholder="Enter Project Manager"
                                />
                            </div>
                            <GenericInput
                                name={"job_description"}
                                type="textarea"
                                label={"Job Description"}
                                placeholder="Enter Job Description"
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
                                disabled={loading}
                            >
                                {loading ? (
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
