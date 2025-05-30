"use client";

import {
	HydrationBoundary,
	QueryCache,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "sonner";

interface Props {
	children: React.ReactNode;
}

const QueryProvider = ({ children }: Props) => {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				// change the default options for all queries
				defaultOptions: {
					queries: {
						refetchOnWindowFocus: false,
					},
				},
				queryCache: new QueryCache({
					onError: (error) => {
						console.error(error.message);
						return toast.error(`Something went wrong`, {
							description: error.message,
						});
					},
				}),
			}),
	);

	return (
		<QueryClientProvider client={queryClient}>
			<HydrationBoundary>{children}</HydrationBoundary>
		</QueryClientProvider>
	);
};

export default QueryProvider;
