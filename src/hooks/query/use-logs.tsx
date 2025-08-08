import { FabricationMonitoringLog } from "@/app/api/fabrication-monitoring/log/[jobId]/route";
import { fetchLog } from "@/app/i/fabrication-monitoring/[job]/_actions/fetch-log";
import { FetchJobLogProps, TPayload } from "@/app/types";
import { useQuery } from "@tanstack/react-query";

export function useLogs(props: FetchJobLogProps) {
    return useQuery({
        queryKey: ["fab-mon-logs", props],
        queryFn: async () => {
            const response = await fetchLog(props);
            if (!response.ok) {
                throw new Error(response.message);
            }

            return response.data as TPayload<FabricationMonitoringLog[]>;
        },
    });
}
