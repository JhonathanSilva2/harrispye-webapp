import {
    AttributeKeys,
    Attributes,
    UserAttributesResponse,
} from "@/app/api/type";
import {
    fetchAllAttributes,
    fetchAttributes,
    fetchUserAttributes,
} from "@/app/i/admin/attributes/_actions/fetch-attributes";
import { updateUserAttributes } from "@/app/i/admin/users/_actions/user-attributes";
import { createAttribute } from "@/app/i/admin/attributes/_actions/create-attributes";
import {
    useMutation,
    UseMutationOptions,
    useQuery,
    useQueryClient,
    UseQueryResult,
} from "@tanstack/react-query";
import { toast } from "sonner";

interface UpdateUserAttributesPayload {
    department_id?: number | null;
    localization_id?: number | null;
    organization_id?: number | null;
    role_id?: number | null;
    clearances?: string;
}
type CreateAttributePayload = {
    AttributeKey: AttributeKeys;
    AttributeValue: string;
};

export function useAttribute<T extends AttributeKeys>(
    attribute: T,
): UseQueryResult<Attributes[T], Error> {
    return useQuery({
        queryKey: ["attribute", attribute],
        queryFn: async () => {
            const response = await fetchAttributes(attribute);
            if (!response.ok) {
                throw new Error(response.message);
            }
            return response.data;
        },
    });
}
export function useAllAttributes() {
    return useQuery<Attributes, Error>({
        queryKey: ["Attributes"],
        queryFn: async () => {
            const response = await fetchAllAttributes();

            if (!response || !response.data)
                throw new Error("Failed to fetch attributes");
            return response.data;
        },
    });
}
export const useUserAttributes = (userId: number) => {
    return useQuery<UserAttributesResponse, Error>({
        queryKey: ["userAttributes", userId],
        queryFn: async () => {
            const response = await fetchUserAttributes(userId);
            if (!response || !response.data)
                throw new Error("Failed to fetch attributes");
            return response.data;
        },
    });
};

export function useUpdateUserAttributes(
    userId: number,
    options?: UseMutationOptions<void, Error, UpdateUserAttributesPayload>,
) {
    const queryClient = useQueryClient();

    return useMutation<void, Error, UpdateUserAttributesPayload>({
        ...options,
        mutationFn: async (payload) => {
            const response = await updateUserAttributes(userId, payload);
            if (!response || !response.data) {
                throw new Error("Failed to update attributes");
            }
            // No return needed, just return void
        },

        onSuccess: (_, payload) => {
            toast.success("User attributes updated");

            // Invalida somente a query específica do usuário
            queryClient.invalidateQueries({
                queryKey: ["userAttributes", userId],
            });

            // Se quiser, podemos atualizar localmente o cache para refletir mudanças imediatas
            queryClient.setQueryData(
                ["userAttributes", userId],
                (oldData: UserAttributesResponse | undefined) => ({
                    ...oldData,
                    ...payload,
                }),
            );
        },

        onError: (error) => {
            toast.error(error.message || "Failed to update user attributes");
        },
    });
}

export function useCreateAttributes() {
    const queryClient = useQueryClient();

    return useMutation<void, Error, CreateAttributePayload>({
        mutationFn: async ({ AttributeKey, AttributeValue }) => {
            const response = await createAttribute(
                AttributeKey,
                AttributeValue,
            );

            if (!response || !response.data) {
                throw new Error("Failed to create attributes");
            }
        },
        onSuccess: () => {
            toast.success("Attributes created");
            queryClient.invalidateQueries({ queryKey: ["attribute"] });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to create attributes");
        },
    });
}
