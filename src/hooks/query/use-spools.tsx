import { patchSpool } from "@/app/i/fabrication-monitoring/_actions/patch-spool";
import {
    useMutation,
    UseMutationOptions,
    useQueryClient,
} from "@tanstack/react-query";
import { fabrication_monitoring } from "prisma/generated/client-hp-base";
import { toast } from "sonner";
type body = Record<string, string | number | null>;

export function useUpdateSpool(
    job: string,
    spoolID: string,
    options?: UseMutationOptions<void, Error, body>,
) {
    const queryClient = useQueryClient();
    return useMutation<void, Error, body>({
        ...options,
        mutationFn: async (data) => {
            const response = await patchSpool(
                job,
                spoolID,
                data as fabrication_monitoring,
            );
            if (!response.ok) {
                throw new Error(response.message);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["fab-mon-spools"] });
            toast.success("Updated successfully");
        },
        onError: () => {
            toast.error("Updated fail");
        },
    });
}
