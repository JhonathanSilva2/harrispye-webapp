import { TFiltersHook } from "@/components/data-table/types";
import { cleanEmptyParams } from "@/utils/clear-empty-params";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

export function useFilters(): TFiltersHook {
	const router = useRouter();

	const searchParams = useSearchParams();
	const pathname = usePathname();

	const filters = useMemo(() => {
		const params: Record<string, string> = {};
		searchParams.forEach((value, key) => {
			params[key] = value;
		});
		return params;
	}, [searchParams]);

	const setFilters = (
		partialFilters: Partial<Record<string, string | number>>,
	) => {
		const updatedFilters = cleanEmptyParams({
			...filters,
			...partialFilters,
		});

		const params = new URLSearchParams();
		Object.entries(updatedFilters).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				params.set(key, value.toString());
			}
		});

		const queryString = params.toString();
		const url = queryString ? `${pathname}?${queryString}` : pathname;

		router.push(url);
	};

	const resetFilters = () => {
		router.push(pathname);
	};

	return { filters, setFilters, resetFilters };
}

export function useLocalStateFilters(): TFiltersHook {
	const [filters, setFiltersState] = useState<Record<string, string>>({});

	const setFilters = (
		partialFilters: Partial<Record<string, string | number>>,
	) => {
		// Merge current filters with new partial filters
		const merged = { ...filters, ...partialFilters };

		// Clean empty values from the merged filters
		const cleaned = cleanEmptyParams(merged);

		// Convert all values to strings to match URLSearchParams behavior
		const converted = Object.fromEntries(
			Object.entries(cleaned).map(([key, value]) => [
				key,
				value?.toString() ?? "",
			]),
		);

		setFiltersState(converted);
	};

	const resetFilters = () => {
		setFiltersState({});
	};

	return {
		filters,
		setFilters,
		resetFilters,
	};
}
