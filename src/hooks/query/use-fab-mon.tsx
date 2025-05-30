import { createJob } from "@/app/i/fabrication-monitoring/[job]/_actions/create-job";
import { fetchJob } from "@/app/i/fabrication-monitoring/[job]/_actions/fetch-job";
import { updateJob } from "@/app/i/fabrication-monitoring/[job]/_actions/update-job";
import { FetchJobProps } from "@/app/types";
import { FabricationFormData } from "@/schemas/fab-mon";
import {
	useMutation,
	UseMutationOptions,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

export function useFabMon(props: FetchJobProps) {
	return useQuery({
		queryKey: ["fab-mon-spools", props],
		queryFn: async () => {
			const response = await fetchJob(props);
			if (!response.ok) {
				throw new Error(response.message);
			}
			return response.data;
		},
	});
}

export function useUpdateJob(
	hp: string,
	options?: UseMutationOptions<void, Error, FabricationFormData>,
) {
	const queryClient = useQueryClient();
	return useMutation<void, Error, FabricationFormData>({
		...options,
		mutationFn: async (data) => {
			try {
				await updateJob(hp, data);
			} catch (error) {
				throw new Error("Failed to update job. Please try again.");
			}
		},
		onSuccess: (...args) => {
			queryClient.invalidateQueries({
				queryKey: ["fab-mon-jobs"],
			});
			toast.success("Job atualizado com sucesso");

			options?.onSuccess?.(
				...(args as Parameters<NonNullable<typeof options.onSuccess>>),
			);
		},
		onError: (error) => {
			toast.error(
				`Failed to update job: ${error.message || "Erro desconhecido"}`,
			);
		},
	});
}

export function useCreateJob() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (jobData: FabricationFormData) => {
			try {
				const response = await createJob(jobData);
				if (!response || response.status >= 400) {
					throw new Error(response.message || "Erro desconhecido");
				}
				return response;
			} catch (error) {
				console.error("Erro ao criar job:", error);
				if (error instanceof Error) {
					throw new Error(error.message || "Erro desconhecido");
				} else {
					throw new Error("Erro desconhecido");
				}
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["fab-mon-jobs"],
			});
			toast.success("Job created successfully!");
		},
		onError: (error) => {
			console.error("Erro na mutação:", error);
			toast.error(
				`Erro ao criar job: ${error.message || "Erro desconhecido"}`,
			);
		},
	});
}
