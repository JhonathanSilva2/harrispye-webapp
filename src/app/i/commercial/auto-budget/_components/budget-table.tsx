import { DataTable } from "@/components/data-table";
import { Searchable } from "@/components/data-table/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocalStateFilters } from "@/hooks/use-filters";
import { PaginationConstants } from "@/lib/constants/pagination";
import { sortByToState, stateToSortBy } from "@/utils/table-sort-mapper";
import { ColumnDef, SortingState, Updater } from "@tanstack/react-table";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useAutobudget } from "../_providers/autobudget-context";
import {
	AutobudgetReducerActions,
	AutobudgetStateType,
	BudgetTypes,
	RowData,
} from "../types";

interface BudgetTableProps {
	title: string;
	type: BudgetTypes;
	state: AutobudgetStateType;
	columns: ColumnDef<RowData<BudgetTypes>>[];
	className?: string;
	advancedSearch?: Searchable[];
	dispatch: React.Dispatch<AutobudgetReducerActions>;
}

const BudgetTable = ({ title, type, columns, className }: BudgetTableProps) => {
	const { filters, resetFilters, setFilters } = useLocalStateFilters();
	const [pagination, setPagination] = useState({
		pageIndex: PaginationConstants.DEFAULT_PAGE_INDEX,
		pageSize: PaginationConstants.MAX_PAGE_SIZE,
	});
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

	const { state: autobudgetState, dispatch } = useAutobudget();
	const data = autobudgetState[type];

	return (
		<Card className={`${className}`}>
			<CardContent>
				<div>
					<DataTable
						data={{
							data,
							page: 1,
							pageSize: PaginationConstants.MAX_PAGE_SIZE,
							rowCount: autobudgetState[type]?.length || 0,
						}}
						columns={columns}
						pagination={pagination}
						paginationOptions={{
							onPaginationChange: setPaginationState,
							rowCount: PaginationConstants.MAX_PAGE_SIZE,
						}}
						filters={filters}
						resetFilters={resetFilters}
						setFilters={setFilters}
						sorting={sortingState}
						onSortingChange={onSortingChange}
						isPending={false}
						isError={false}
						headerClassName="flex justify-between items-center"
						headerComponent={
							<Button
								variant={"constructive"}
								size={"icon"}
								className=""
								onClick={() => {
									const action: AutobudgetReducerActions = {
										type: `add-${type}`,
										id: uuidv4(),
									};
									dispatch(action);
								}}
							>
								<PlusCircle />
							</Button>
						}
						title={title}
					/>
				</div>
			</CardContent>
		</Card>
	);
};

export default BudgetTable;
