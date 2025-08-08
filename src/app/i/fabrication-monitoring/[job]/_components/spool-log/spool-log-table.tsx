import { useLogs } from "@/hooks/query/use-logs";
import { Loader2 } from "lucide-react";
import React, { useMemo, useState } from "react";
import { fabricationMonitoringLogColumns } from "./column-def";
import { DataTable } from "@/components/data-table";
import { useFilters, useLocalStateFilters } from "@/hooks/use-filters";
import { PaginationConstants } from "@/lib/constants/pagination";
import { sortByToState, stateToSortBy } from "@/utils/table-sort-mapper";
import { SortingState, Updater } from "@tanstack/react-table";

interface Props {
    jobId: number;
}

const SpoolLogTable = ({ jobId }: Props) => {
    const { filters, resetFilters, setFilters } = useLocalStateFilters();
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
    const columns = useMemo(() => fabricationMonitoringLogColumns, []);

    const { data, error, isError, isPending, isLoading } = useLogs({ jobId });

    if (isError) {
        return <div>Error loading logs: {error.message}</div>;
    }
    if (isPending || isLoading) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="animate-spin" />
            </div>
        );
    }

    return (
        <DataTable
            data={
                data?.data
                    ? data
                    : {
                          data: [],
                          rowCount: 0,
                          page: 1,
                          pageSize: 10,
                      }
            }
            columns={columns}
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
        />
    );
};

export default SpoolLogTable;
