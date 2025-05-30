"use client";

import { DataTable } from "@/components/data-table";
import { Searchable } from "@/components/data-table/types";
import { useFabMonJobs } from "@/hooks/query/use-fab-mon-jobs";
import { useFilters } from "@/hooks/use-filters";
import { PaginationConstants } from "@/lib/constants/pagination";
import { sortByToState, stateToSortBy } from "@/utils/table-sort-mapper";
import { SortingState, Updater } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { AddHp } from "./add-hp";
import { fabricationMonitoringJobsColumns } from "./column-def";

const advancedSearch: Searchable[] = [
	{
		key: "hp",
		type: "text",
		title: "HP",
	},
	{
		key: "po_number",
		type: "text",
		title: "PO Number",
	},
	{
		key: "client",
		type: "text",
		title: "Client",
	},
	{
		key: "expected_delivery_date",
		type: "date",
		title: "Expected Delivery",
	},
];

const FabMonJobsTable = () => {
	const { filters, resetFilters, setFilters } = useFilters();
	const { data, isError, isPending } = useFabMonJobs({
		filters,
	});

	const initialPagination = {
		pageIndex: filters.page
			? Number(filters.page) - 1
			: PaginationConstants.DEFAULT_PAGE_INDEX,
		pageSize: filters.pageSize
			? Number(filters.pageSize)
			: PaginationConstants.DEFAULT_PAGE_SIZE,
	};
	const [pagination, setPagination] = useState(initialPagination);
	const setPaginationState = (
		updaterOrValue:
			| { pageIndex: number; pageSize: number }
			| ((old: { pageIndex: number; pageSize: number }) => {
					pageIndex: number;
					pageSize: number;
			  }),
	) => {
		if (typeof updaterOrValue === "function") {
			const newPagination = updaterOrValue(pagination);
			setPagination(newPagination);
			setFilters({
				...filters,
				page: newPagination.pageIndex + 1,
				pageSize: newPagination.pageSize,
			});
		} else {
			setPagination(updaterOrValue);
			setFilters({
				...filters,
				page: updaterOrValue.pageIndex + 1,
				pageSize: updaterOrValue.pageSize,
			});
		}
	};
	const sortingState = sortByToState(
		filters.sortBy as `${string}.asc` | `${string}.desc` | undefined,
	);
	const onSortingChange = (updaterOrValue: Updater<SortingState>) => {
		const newSortingState =
			typeof updaterOrValue === "function"
				? updaterOrValue(sortingState)
				: updaterOrValue;
		return setFilters({ sortBy: stateToSortBy(newSortingState) });
	};

	const columns = useMemo(() => fabricationMonitoringJobsColumns, []);

	return (
		<DataTable
			data={data}
			columns={columns}
			searchables={advancedSearch}
			pagination={pagination}
			paginationOptions={{
				onPaginationChange: setPaginationState,
				rowCount: data?.rowCount,
			}}
			filters={filters}
			resetFilters={resetFilters}
			setFilters={setFilters}
			sorting={sortingState}
			onSortingChange={onSortingChange}
			isPending={isPending}
			isError={isError}
			headerClassName="flex justify-between items-center"
			headerComponent={<AddHp />}
		/>
	);
};

export default FabMonJobsTable;
