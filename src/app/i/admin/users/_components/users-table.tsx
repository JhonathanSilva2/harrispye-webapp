"use client";

import { DataTable } from "@/components/data-table";
import { useUsers } from "@/hooks/query/use-users";
import { useFilters } from "@/hooks/use-filters";
import { PaginationConstants } from "@/lib/constants/pagination";
import { sortByToState, stateToSortBy } from "@/utils/table-sort-mapper";
import { SortingState, Updater } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { AddUserDialog } from "./add-user";
import { usersColumns } from "./column-def";

const UsersTable = () => {
    const { filters, resetFilters, setFilters } = useFilters();
    const { data, isError, isPending } = useUsers({
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

    const columns = useMemo(() => usersColumns, []);

    return (
        <DataTable
            data={data}
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
            headerClassName="gap-3"
            headerComponent={<AddUserDialog />}
        />
    );
};

export default UsersTable;
