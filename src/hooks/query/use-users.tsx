import { fetchUsers } from "@/app/i/admin/users/_actions/users";
import { FetchPagePaginationProps } from "@/app/types";
import { useQuery } from "@tanstack/react-query";

export function useUsers(props: FetchPagePaginationProps) {
    return useQuery({
        queryKey: ["users", props],
        queryFn: async () => {
            const response = await fetchUsers(props);
            if (!response.ok) {
                throw new Error(response.message);
            }
            return response.data;
        },
    });
}
