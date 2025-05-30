import { FetchPagePaginationProps } from "@/app/types";
import { useQuery } from "@tanstack/react-query";
import { fetchFabricationMonitoringJobs } from "@/app/i/fabrication-monitoring/_actions/fetch-fabrication-monitoring-jobs";
import { fetchDrawings } from "@/app/i/fabrication-monitoring/[job]/_actions/fetch-drawings";

export function useDrawing(jobID:string,open: boolean ) {
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
