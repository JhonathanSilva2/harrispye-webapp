import { FetchPagePaginationProps } from "@/app/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchFabricationMonitoringJobs } from "@/app/i/fabrication-monitoring/_actions/fetch-fabrication-monitoring-jobs";
import { fetchDrawings } from "@/app/i/fabrication-monitoring/[job]/_actions/fetch-drawings";
import { toast } from "sonner";
import { deleteDrawing } from "@/app/i/fabrication-monitoring/[job]/_actions/delete-drawing";

export function useDrawing(jobID: string, open: boolean) {
    return useQuery({
        queryKey: ["use-drawings", { jobID }],
        queryFn: async () => {
            const response = await fetchDrawings(jobID);
            if (!response.ok) {
                throw new Error(response.message);
            }
            return response.data;
        },
        enabled: !!jobID && open,
    });
}

export function useDeleteDrawing() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (jobId: number) => {
            const response = await deleteDrawing(jobId);
            if (!response.ok) {
                throw new Error(response.message);
            }
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["fab-mon-spools"],
            });
            toast.success("Drawing deleted successfully!");
        },
        onError: (error) => {
            console.error("Mutation Error:", error);
            toast.error(
                `Error when trying to delete drawing: ${error.message || "Unknown error"}`,
            );
        },
    });
}
