import { fetchSpool } from "@/app/i/fabrication-monitoring/_actions/fetch-spool";
import { useState } from "react"; // Importando useState e useEffect

import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { CirclePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AddSpoolButtonProps {
    job: string;
}

export default function AddSpoolButton({ job }: AddSpoolButtonProps) {
    const queryClient = useQueryClient();
    const [isLoading, setIsLoading] = useState(false); // Controle de estado para loading
    const [error, setError] = useState<string | null>(null); // Controle de erro

    const handleSpool = async () => {
        try {
            setIsLoading(true);
            const response = await fetchSpool(job);
            queryClient.invalidateQueries({ queryKey: ["fab-mon-spools"] });
            toast.success("spool created successfully!");
        } catch (error) {
            console.error("Erro ao criar spool:", error);
            setError("Occurred an error while creating the spool.");
            toast.error("Occurred an error while creating the spool.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant={"constructive"}
            onClick={handleSpool}
            disabled={isLoading}
            data-cy="addSpool"
        >
            {isLoading ? <Loader2 className="animate-spin" /> : <CirclePlus />}{" "}
            Items
        </Button>
    );
}
