import GenericInput from "@/components/forms/generic-inputs";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { AccessControlForm } from "@/schemas/access-control";
import { zodResolver } from "@hookform/resolvers/zod";
import { user_access_control_action } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateUserAccessControl } from "../_hooks/use-user-access-control";

const AddAccessForm = ({
    id,
    className,
    submitFn,
}: {
    id: number;
    className?: string;
    submitFn?: () => void;
}) => {
    const form = useForm<z.infer<typeof AccessControlForm>>({
        resolver: zodResolver(AccessControlForm),
        defaultValues: {
            id: id.toString(),
            feature: "",
            action: "",
        },
    });

    const { mutate, isPending } = useCreateUserAccessControl();
    function onSubmit(values: z.infer<typeof AccessControlForm>) {
        mutate(
            {
                id: Number(values.id),
                feature: values.feature,
                action: values.action.toUpperCase() as user_access_control_action,
            },
            {
                onSuccess: () => {
                    if (submitFn) {
                        submitFn();
                    }
                },
            },
        );
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className={className}>
                    <GenericInput
                        className="m-0"
                        name={"feature"}
                        label={"Feature"}
                    />
                    <GenericInput
                        type="select"
                        options={Object.values(user_access_control_action).map(
                            (action) => {
                                return {
                                    value: action.toUpperCase(),
                                    label: action,
                                };
                            },
                        )}
                        name={"action"}
                        label={"Action"}
                    />

                    {isPending ? (
                        <Button type="button" variant={"ghost"}>
                            <Loader2 className="animate-spin" />
                        </Button>
                    ) : (
                        <Button type="submit">Submit</Button>
                    )}
                </div>
            </form>
        </Form>
    );
};

export default AddAccessForm;
