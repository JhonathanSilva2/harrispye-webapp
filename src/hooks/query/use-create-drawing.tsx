import { createDrawing } from "@/app/i/fabrication-monitoring/[job]/_actions/create-drawing";
import {
    useMutation,
    UseMutationOptions,
    useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateDrawing(
    jobId: number,
    options?: UseMutationOptions<void, Error, FormData>,
) {
    const queryClient = useQueryClient();
    return useMutation<void, Error, FormData>({
        ...options,
        mutationFn: async (data) => {
            const createDrawingReturn = await createDrawing(jobId, data);
            if (!createDrawingReturn.ok) {
                throw new Error(createDrawingReturn.message || "Unknown error");
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
