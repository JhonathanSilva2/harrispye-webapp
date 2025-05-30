import { DataTable } from "@/components/data-table";
import { useLocalStateFilters } from "@/hooks/use-filters";
import { PaginationConstants } from "@/lib/constants/pagination";
import { sortByToState, stateToSortBy } from "@/utils/table-sort-mapper";
import { SortingState, Updater } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { fabrication_monitoring_designs } from "../../../../../../../prisma/generated/client-hp-base";
import { fabricationMonitoringDrawingColumns } from "./columns-def";

interface DrawingTable {
    designs: fabrication_monitoring_designs[];
}

export function DrawingTable({ designs }: DrawingTable) {
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

    const columns = useMemo(() => fabricationMonitoringDrawingColumns, []);
    const data = designs;

    return (
        <DataTable
            data={{
                data,
                page: 1,
                pageSize: PaginationConstants.MAX_PAGE_SIZE,
                rowCount: designs?.length || 0,
            }}
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
            columns={columns}
            headerClassName="flex justify-end items-center"
        />
    );
}
