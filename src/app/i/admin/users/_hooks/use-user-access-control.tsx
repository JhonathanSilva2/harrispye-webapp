import {
    useMutation,
    UseMutationOptions,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
    createUserAccessControl,
    deleteUserAccessControl,
    fetchUserAccessControl,
} from "../_actions/user-access-control";
import type { CreateUserAccessControl, FetchUserAccessControl } from "../types";

const queryKeyName = "user-access-control";

export function useUserAccessControl(props: FetchUserAccessControl) {
    return useQuery({
        queryKey: [queryKeyName, props],
        queryFn: async () => {
            const response = await fetchUserAccessControl(props);
            if (!response.ok) {
                throw new Error(response.message);
            }
            return response.data;
        },
    });
}

export function useCreateUserAccessControl() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (accessControl: CreateUserAccessControl) => {
            try {
                const response = await createUserAccessControl(accessControl);
                if (!response || response.status >= 400) {
                    throw new Error(response.message || "Unexpected error");
                }
                return response;
            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(error.message || "Unexpected error");
                } else {
                    throw new Error("Unexpected error");
                }
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeyName] });
            toast.success("Access provided successfully!");
        },
        onError: (error) => {
            console.error("Error at mutation:", error);
            toast.error(
                `Error at creating access: ${error.message || "Unexpected error"}`,
            );
        },
    });
}

export function useDeleteUserAccessControl(
    options?: UseMutationOptions<void, Error, CreateUserAccessControl>,
) {
    const queryClient = useQueryClient();
    return useMutation<void, Error, CreateUserAccessControl>({
        ...options,
        mutationFn: async ({ id, feature, action }) => {
            try {
                await deleteUserAccessControl({ id, feature, action });
            } catch (error) {
                throw new Error(
                    "Failed to revoke user's access. Please try again.",
                );
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeyName] });
            toast.success("Revoked user's access successfully!");
        },
        onError: (error) => {
            toast.error(
                `Failed to revoke access: ${error.message || "Unexpected error"}`,
            );
        },
    });
}
