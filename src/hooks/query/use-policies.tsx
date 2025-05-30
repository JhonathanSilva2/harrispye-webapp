import { PoliciesKeys } from "@/app/api/policies/types";
import { createPolicy } from "@/app/i/admin/policies/_actions/create-policies";
import { fetchPolicies } from "@/app/i/admin/policies/_actions/fetch-policies";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function usePoliciy(policy: PoliciesKeys) {
	return useQuery({
		queryKey: ["policy", policy],
		queryFn: async () => {
			const response = await fetchPolicies(policy);
			if (!response.ok) {
				throw new Error(response.message);
			}
			return response.data;
		},
	});
}

export function useCreatePolicyMutation(
	policy: PoliciesKeys,
	newPolicy: string,
) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: () => createPolicy(policy, newPolicy),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["policy", policy],
			});
			toast.success("Policy created successfully!");
		},
	});
}
