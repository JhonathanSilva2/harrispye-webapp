import { createDrawing } from "@/app/i/fabrication-monitoring/[job]/_actions/create-drawing";
import {
    useMutation,
    UseMutationOptions,
    useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateDrawing(
    jobID: number,
    options?: UseMutationOptions<void, Error, FormData>,
) {
    const queryClient = useQueryClient();
    return useMutation<void, Error, FormData>({
        ...options,
        mutationFn: async (data) => {
            try {
                await createDrawing(jobID, data);
            } catch (error) {
                throw new Error("Failed to create Drawings, please try again");
            }
        },

        onSuccess: () => {
            toast.success("Drawing Created");
            queryClient.invalidateQueries({ queryKey: ["fab-mon-spools"] });
        },
        onError: () => {
            toast.error("Drawing Creation Failed");
        },
    });
}
