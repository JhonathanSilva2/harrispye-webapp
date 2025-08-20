import { fetchFabricationMonitoringJobs } from "@/app/i/fabrication-monitoring/_actions/fetch-fabrication-monitoring-jobs";
import { FetchPagePaginationProps } from "@/app/types";
import { useQuery } from "@tanstack/react-query";

export function useFabMonJobs({ filters }: FetchPagePaginationProps) {
    return useQuery({
        queryKey: ["fab-mon-jobs", { filters }],
        queryFn: async () => {
            const response = await fetchFabricationMonitoringJobs({
                filters,
            });
            if (!response.ok) {
                throw new Error(response.message);
            }
            return response.data;
        },
    });
}
