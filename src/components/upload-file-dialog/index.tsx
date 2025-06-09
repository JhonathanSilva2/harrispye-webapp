import { AlertDialogComponent } from "@/components/alert";
import GenericInput from "@/components/forms/generic-inputs"; // Será usado para a descrição
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    // DialogDescription, // Removido se não usado
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { toast } from "sonner";
import { UseMutationResult } from "@tanstack/react-query";

import { useCreateDrawing } from "@/hooks/query/use-create-drawing";
// Importe seu hook de mutação real aqui
// import { useSubmitDrawingMutation } from "@/hooks/query/use-fab-mon"; // Exemplo
import {
    FabDrawingSchema,
    FabDrawingSchemaFormData,
} from "@/schemas/fabrication-monitoring-drawing"; // Ajuste o caminho se necessário
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { JSX, useCallback, useState } from "react"; // Removido useEffect, useMemo, useCallback se não usados
import { FormProvider, useForm } from "react-hook-form";

interface DialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    triggerBtn?: JSX.Element;
    onFormSubmitSuccess?: () => void; // Callback opcional para sucesso
    createFile: UseMutationResult<void, Error, FormData>;
}

// Simulação de um hook de mutação (substitua pelo seu)

export const UploadFileDialog = ({
    open,
    setOpen,
    triggerBtn,
    onFormSubmitSuccess,
    createFile,
}: DialogProps) => {
    const methods = useForm<FabDrawingSchemaFormData>({
        defaultValues: {
            description: "",
        },
        resolver: zodResolver(FabDrawingSchema),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = methods;

    const onSubmit = useCallback(
        async (data: FabDrawingSchemaFormData) => {
            const body = new FormData();
            body.append("file", data.file, data.file.name);
            body.append("description", data.description);

            try {
                // Passa o payload e o jobId para a função de mutação
                await createFile.mutateAsync(body);
                setOpen(false);
                reset();
                if (onFormSubmitSuccess) {
                    onFormSubmitSuccess();
                }
            } catch (error: unknown) {
                console.error("Erro na submissão:", error);
                toast.error("Fail");
            }
        },
        [createFile, onFormSubmitSuccess, reset, setOpen],
    );

    const handleDialogClose = (isOpen: boolean) => {
        if (!isOpen) {
            reset(); // Limpa o formulário ao fechar o diálogo se não foi submetido
        }
        setOpen(isOpen);
    };

    return (
        <Dialog onOpenChange={handleDialogClose} open={open}>
            <DialogTrigger asChild>{triggerBtn}</DialogTrigger>
            <DialogContent className="max-h-[90vh] sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Send Isometric</DialogTitle>
                </DialogHeader>
                <FormProvider {...methods}>
                    <form id="drawing-form" className="space-y-6 py-4">
                        <div className="grid w-full items-center gap-1.5">
                            <GenericInput
                                type="file"
                                name="file"
                                label="Drawing File"
                                placeholder=""
                                accept=".pdf"
                            />
                        </div>
                        <GenericInput
                            type="text"
                            name="description"
                            label="Drawing Description"
                            placeholder="Enter a brief description..."
                        />
                    </form>
                </FormProvider>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => handleDialogClose(false)}
                        className="mt-2 w-full sm:mt-0 sm:w-auto"
                    >
                        Cancel
                    </Button>
                    <AlertDialogComponent
                        actionText="Confirm and Send" // Texto de ação mais específico
                        triggerBtn={
                            <Button
                                type="button" // O botão do trigger não deve submeter o form diretamente
                                className="w-full sm:w-auto" // Ajuste de largura para responsividade
                                disabled={createFile.isPending}
                                variant={"constructive"}
                            >
                                {createFile.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    "Review & Send"
                                )}
                            </Button>
                        }
                        onConfirm={handleSubmit(onSubmit)} // O AlertDialog agora dispara o submit validado
                    />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
