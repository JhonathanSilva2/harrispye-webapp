import { patchSpool } from "@/app/i/fabrication-monitoring/_actions/patch-spool";
import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
type body = Record<string, string | number>;

export function useUpdateSpool(
	job: string,
	spoolID: string,
	options?: UseMutationOptions<void, Error, body>,
) {
    const queryClient = useQueryClient()
	return  useMutation<void, Error, body>({
		...options,
		mutationFn: async (data) => {
			try {
				await patchSpool(job, spoolID, data);
			} catch (error) {
				throw new Error("Failed to updated spool, please try again");
			}
		},
		onSuccess: () => {
            
            toast.success("Updated data");
            queryClient.invalidateQueries({queryKey:['fab-mon-spools']})

		},
		onError: () => {
			toast.error("Updated fail");
		},
       
	});
}
