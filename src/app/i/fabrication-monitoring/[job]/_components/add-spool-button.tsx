import { useState, useEffect } from "react"; // Importando useState e useEffect
import { fetchSpool } from "@/app/i/fabrication-monitoring/_actions/fetch-spool";

import { Button } from "@/components/ui/button";
import { CirclePlus, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface AddSpoolButtonProps {
    job: string;
    canWrite: boolean;
}

export default function AddSpoolButton({ job, canWrite }: AddSpoolButtonProps) {
    const queryClient = useQueryClient();
    const [isLoading, setIsLoading] = useState(false); // Controle de estado para loading
    const [error, setError] = useState<string | null>(null); // Controle de erro

    const handleSpool = async () => {
        try {
            setIsLoading(true);
            const response = await fetchSpool(job);
            queryClient.invalidateQueries({ queryKey: ["fab-mon-spools"] });
        } catch (error) {
            console.error("Erro ao criar spool:", error);
            setError("Ocorreu um erro ao criar o spool.");
        } finally {
            setIsLoading(false);
        }
    };

    const isDisabled = !canWrite || isLoading;

    return (
        <Button
            className="mx-2 my-3 hover:bg-green-800"
            variant={"outline"}
            onClick={handleSpool}
            disabled={isDisabled}
            data-cy="addSpool"
        >
            {isLoading ? <Loader2 className="animate-spin" /> : <CirclePlus />}{" "}
            Spool
        </Button>
    );
}
