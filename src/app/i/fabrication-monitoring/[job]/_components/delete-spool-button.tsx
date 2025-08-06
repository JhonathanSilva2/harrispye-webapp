import { useState, useEffect } from "react"; // Importando useState e useEffect
import { Button } from "@/components/ui/button";
import { Trash, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { deleteSpool } from "../../_actions/delete-spool";
import { toast } from "sonner";

interface AddSpoolButtonProps {
    job: string;
    spoolID: string;
    disabled: boolean;
}

export default function DeleteSpoolButton({
    job,
    spoolID,
    disabled,
}: AddSpoolButtonProps) {
    const queryClient = useQueryClient();
    const [isLoading, setIsLoading] = useState(false); // Controle de estado para loading
    const [error, setError] = useState<string | null>(null); // Controle de erro

    const handleDeleteSpool = async () => {
        try {
            setIsLoading(true);
            const response = await deleteSpool(job, spoolID);
            queryClient.invalidateQueries({ queryKey: ["fab-mon-spools"] });
            toast.success("Spool deleted successfully!");
        } catch (error) {
            console.error("Error when trying to delete spool:", error);
            setError("Error when trying to delete.");
            toast.error("Occurred an error while deleting the spool.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant={"ghost"}
            size={"icon"}
            onClick={handleDeleteSpool}
            className=""
            disabled={disabled}
            data-cy="deleteSpoolRow"
            data-
        >
            {isLoading ? (
                <Loader2 className="animate-spin" />
            ) : (
                <Trash className="text-red-500" />
            )}
        </Button>
    );
}
