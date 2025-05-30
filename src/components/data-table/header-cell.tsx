"use client";

import { Button } from "../ui/button";
import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const HeaderCell = ({ header, apiKey }: { header: string; apiKey: string }) => {
	const router = useRouter();
	const searchParams = useSearchParams();

	// Read current sorting state from URL
	const currentSort = searchParams.get("sort") || "";
	const currentOrder = searchParams.get("order") || "";

	const isSorted = currentSort === apiKey;
	const isSortedDesc = isSorted && currentOrder === "desc";

	const onClick = () => {
		let newOrder = "asc";
		if (isSorted) {
			newOrder = currentOrder === "asc" ? "desc" : "asc";
		}
		// Build new URL updating sort parameters
		const url = new URL(window.location.href);
		url.searchParams.set("sort", apiKey);
		url.searchParams.set("order", newOrder);
		router.push(url.toString());
	};

	return (
		<Button variant="ghost" onClick={onClick}>
			{header}
			{isSorted ? (
				!isSortedDesc ? (
					<ChevronDown className="ml-2 h-4 w-4" />
				) : (
					<ChevronUp className="ml-2 h-4 w-4" />
				)
			) : (
				<ChevronsUpDown className="ml-2 h-4 w-4" />
			)}
		</Button>
	);
};

export default HeaderCell;
