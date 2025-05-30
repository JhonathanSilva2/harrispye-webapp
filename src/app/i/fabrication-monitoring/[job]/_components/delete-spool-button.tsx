import { useState, useEffect } from "react"; // Importando useState e useEffect
import { Button } from "@/components/ui/button";
import { Trash, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { deleteSpool } from "../../_actions/delete-spool";

interface AddSpoolButtonProps {
	job: string;
	spoolID: string;
}

export default function DeleteSpoolButton({
	job,
	spoolID,
}: AddSpoolButtonProps) {
	const queryClient = useQueryClient();
	const [isLoading, setIsLoading] = useState(false); // Controle de estado para loading
	const [error, setError] = useState<string | null>(null); // Controle de erro

	const handleDeleteSpool = async () => {
		try {
			setIsLoading(true);
			const response = await deleteSpool(job, spoolID);
			queryClient.invalidateQueries({ queryKey: ["fab-mon-spools"] });
		} catch (error) {
			console.error("Erro ao deletar spool:", error);
			setError("Ocorreu um erro ao deletar o spool.");
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
		>
			{isLoading ? (
				<Loader2 className="animate-spin" />
			) : (
				<Trash className="text-red-500" />
			)}
		</Button>
	);
}
