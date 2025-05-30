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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// Importe seu hook de mutação real aqui
// import { useSubmitDrawingMutation } from "@/hooks/query/use-fab-mon"; // Exemplo
import {
    FabDrawingSchema,
    FabDrawingSchemaFormData,
} from "@/schemas/fabrication-monitoring-drawing"; // Ajuste o caminho se necessário
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { JSX, useState } from "react"; // Removido useEffect, useMemo, useCallback se não usados
import { FormProvider, useForm } from "react-hook-form";

interface DialogProps {
    jobId: number; // jobId é necessário para a URL
    open: boolean;
    setOpen: (open: boolean) => void;
    triggerBtn?: JSX.Element;
    onFormSubmitSuccess?: () => void; // Callback opcional para sucesso
}

// Simulação de um hook de mutação (substitua pelo seu)
const useSubmitDrawingMutation = (jobId: number) => {
    const [isLoading, setIsLoading] = useState(false);
    const mutateAsync = async ({
        payload,
        jobId,
    }: {
        payload: FormData;
        jobId: number;
    }) => {
        setIsLoading(true);
        const apiUrl = `http://localhost:3000/api/fabrication-monitoring/designs?jobId=${jobId}`;
        console.log(`Enviando FormData para: ${apiUrl}`);
        console.log("Payload:", Object.fromEntries(payload));

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                body: payload,
                // Não defina 'Content-Type': 'multipart/form-data' manualmente para FormData.
                // O navegador define isso automaticamente com o boundary correto.
            });

            setIsLoading(false);

            if (!response.ok) {
                const errorData = await response
                    .json()
                    .catch(() => ({ message: response.statusText }));
                console.error("Falha no upload:", response.status, errorData);
                throw new Error(
                    errorData.message ||
                        `Erro ${response.status} ao enviar o desenho.`,
                );
            }

            const result = await response.json();
            console.log("Upload bem-sucedido:", result);
            return result;
        } catch (error) {
            setIsLoading(false);
            console.error("Erro na chamada fetch:", error);
            throw error; // Re-throw para ser pego no onSubmit
        }
    };

    return { mutateAsync, isLoading };
};

export const AddDrawingDialog = ({
    jobId,
    open,
    setOpen,
    triggerBtn,
    onFormSubmitSuccess,
}: DialogProps) => {
    const { mutateAsync: submitDrawing, isLoading } =
        useSubmitDrawingMutation(jobId); // Seu hook de mutação

    const methods = useForm<FabDrawingSchemaFormData>({
        resolver: zodResolver(FabDrawingSchema),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = methods;

    const onSubmit = async (data: FabDrawingSchemaFormData) => {
        const formDataPayload = new FormData();
        formDataPayload.append("file", data.file, data.file.name);
        formDataPayload.append("description", data.description);

        try {
            // Passa o payload e o jobId para a função de mutação
            await submitDrawing({ payload: formDataPayload, jobId });
            alert("Desenho enviado com sucesso!");
            setOpen(false);
            reset();
            if (onFormSubmitSuccess) {
                onFormSubmitSuccess();
            }
        } catch (error: unknown) {
            console.error("Erro na submissão:", error);
            alert(
                `Erro ao enviar: ${
                    error instanceof Error
                        ? error.message
                        : "Não foi possível completar a operação."
                }`,
            );
        }
    };

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
                    <DialogTitle>Enviar Desenho</DialogTitle>
                </DialogHeader>
                <FormProvider {...methods}>
                    <form id="drawing-form" className="space-y-6 py-4">
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="file-input">Drawing File</Label>
                            <Input
                                className="mt-2"
                                id="file-input"
                                type="file"
                                {...register("file")}
                            />
                            {errors.file && (
                                <p className="text-sm font-medium text-destructive">
                                    {errors.file.message}
                                </p>
                            )}
                        </div>
                        <GenericInput
                            name="description"
                            label="Drawing Description"
                            placeholder="Insira uma breve descrição..."
                        />
                        {errors.description && (
                            <p className="mt-4 text-sm font-medium text-destructive">
                                {errors.description.message}
                            </p>
                        )}
                    </form>
                </FormProvider>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => handleDialogClose(false)}
                        className="mt-2 w-full sm:mt-0 sm:w-auto"
                    >
                        Cancelar
                    </Button>
                    <AlertDialogComponent
                        actionText="Confirmar e Enviar" // Texto de ação mais específico
                        triggerBtn={
                            <Button
                                type="button" // O botão do trigger não deve submeter o form diretamente
                                className="w-full sm:w-auto" // Ajuste de largura para responsividade
                                disabled={isLoading}
                                variant={"constructive"}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Enviando...
                                    </>
                                ) : (
                                    "Revisar e Enviar"
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
