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
import { Searchable } from "@/components/data-table/types";

const UsersTable = () => {
    const searchables: Searchable[] = [
        { key: "hp_registration", type: "number", title: "HP Registration" },
        {
            key: "name",
            type: "text",
            title: "Full Name",
        },
        {
            key: "username",
            type: "text",
            title: "Email",
        },
        {
            key: "role",
            type: "text",
            title: "Role",
        },
        // {
        //     key: "department",
        //     type: "text",
        //     title: "Department",
        // },
        // {
        //     key: "direct_manager",
        //     type: "text",
        //     title: "Manager",
        // },
        {
            key: "admission_date",
            type: "date",
            title: "Admission Date",
        },
    ];

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
            headerClassName="flex justify-between gap-3"
            headerComponent={<AddUserDialog />}
            searchables={searchables}
        />
    );
};

export default UsersTable;
