"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    OnChangeFn,
    PaginationOptions,
    PaginationState,
    SortingState,
    TableOptions,
    useReactTable,
} from "@tanstack/react-table";
import {
    ChevronDown,
    ChevronsUpDown,
    ChevronUp,
    CloudAlert,
} from "lucide-react";
import { JSX, useMemo, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { AdvancedFilter } from "./advanced-filter";
import Pagination from "./pagination";
import { DataTableProps, Searchable } from "./types";

/**
 * DataTable component for displaying and managing tabular data with advanced filtering, sorting, and pagination.
 *
 * @template T - The type of data being displayed in the table.
 *
 * @param {Searchable[]} searchables - An array of searchable fields for advanced filtering.
 * @param {TPayload<T[]>} [data] - The data to be displayed in the table.
 * @param {ColumnDef<T>[]} columns - The column definitions for the table.
 * @param {PaginationState} pagination - The current pagination state.
 * @param {Pick<PaginationOptions, "onPaginationChange" | "rowCount">} paginationOptions - Options for pagination.
 * @param {Record<string, string | number>} filters - The current filters applied to the table.
 * @param {() => void} resetFilters - Function to reset the filters.
 * @param {(partialFilters: Partial<Record<string, string | number>>) => void} setFilters - Function to set the filters.
 * @param {SortingState} sorting - The current sorting state.
 * @param {OnChangeFn<SortingState>} onSortingChange - Function to handle sorting changes.
 * @param {boolean} isPending - Indicates if the data is currently being loaded.
 * @param {boolean} isError - Indicates if there was an error loading the data.
 * @param {string} [headerClassName] - Optional class name for the header container.
 * @param {JSX.Element} [headerComponent] - Optional element for additional header options.
 * @param {string} [titleClassName] - Optional class name for the title.
 * @param {string} [title] - Optional title for the table.
 * @param {TableOptions<T>["meta"]} [meta] - Optional metadata object that can be used to pass custom handlers or additional information to the table and its components.

 * *
 * @returns {JSX.Element} The rendered DataTable component.
 *
 * @description
 * This component renders a table with advanced filtering, sorting, and pagination capabilities. It uses the `@tanstack/react-table` library for table management and provides a skeleton loader while data is being fetched. It also handles error states and displays a message when no data is found.
 *
 * @tutorial https://www.youtube.com/watch?v=F4zshDInsJY
 * @see https://github.com/Balastrong/tanstack-filtered-table-demo/
 */
export function DataTable<T>({
    searchables,
    data,
    columns,
    filters,
    resetFilters,
    setFilters,
    pagination,
    paginationOptions,
    sorting,
    onSortingChange,
    isPending,
    isError,
    headerClassName,
    headerComponent,
    titleClassName,
    title,
    meta,
    unpermittedColumns,
}: DataTableProps<T>): JSX.Element {
    const loader = useMemo(() => {
        const loader = [];
        for (let i = 1; i < pagination.pageSize; i++) {
            loader.push(i);
        }
        return loader;
    }, [pagination.pageSize]);
    const [rowSelection, setRowSelection] = useState({});

    const table = useReactTable({
        columns,
        data: data?.data ?? [],
        getCoreRowModel: getCoreRowModel(),
        ...paginationOptions,
        onGlobalFilterChange: (filters) => setFilters(filters),
        manualPagination: true,
        manualFiltering: true,
        manualSorting: true,
        onSortingChange,
        rowCount: data?.rowCount,
        initialState: {
            columnVisibility: unpermittedColumns,
        },
        onRowSelectionChange: setRowSelection,
        meta,

        state: {
            pagination,
            sorting,
            rowSelection,
        },
    });

    return (
        <div className="py-4">
            <div className={headerClassName}>
                {searchables ? (
                    <AdvancedFilter
                        searchables={searchables}
                        filters={filters}
                        resetFilters={resetFilters}
                        setFilters={setFilters}
                    />
                ) : null}
                {title ? (
                    <p className={`text-2xl ${titleClassName ?? ""}`}>
                        {title}
                    </p>
                ) : null}
                {headerComponent ? headerComponent : null}
            </div>
            <div className="my-4 flex max-w-[80vw] overflow-auto md:w-full md:max-w-none">
                <Table className="">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow
                                key={headerGroup.id}
                                className="group/row"
                            >
                                {headerGroup.headers.map((header) => {
                                    const metaClass =
                                        header.column.columnDef?.meta
                                            ?.className ?? "";
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className={metaClass}
                                        >
                                            {header.isPlaceholder ? null : (
                                                <>
                                                    <div
                                                        {...{
                                                            className:
                                                                header.column.getCanSort()
                                                                    ? "flex gap-1 justify-center items-center cursor-pointer select-none"
                                                                    : "",
                                                            onClick:
                                                                header.column.getCanSort()
                                                                    ? header.column.getToggleSortingHandler()
                                                                    : () => {},
                                                        }}
                                                    >
                                                        {flexRender(
                                                            header.column
                                                                .columnDef
                                                                .header,
                                                            header.getContext(),
                                                        )}
                                                        {header.column.getCanSort()
                                                            ? ({
                                                                  asc: (
                                                                      <ChevronUp />
                                                                  ),
                                                                  desc: (
                                                                      <ChevronDown />
                                                                  ),
                                                                  false: (
                                                                      <ChevronsUpDown />
                                                                  ),
                                                              }[
                                                                  header.column.getIsSorted() as string
                                                              ] ?? null)
                                                            : null}
                                                    </div>
                                                </>
                                            )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody className="text-center">
                        {isPending
                            ? loader.map((n) => (
                                  <TableRow className="space-y-2" key={n}>
                                      {columns.map((column, key) => {
                                          return (
                                              <TableCell
                                                  key={`${n}-${key}`}
                                                  className="h-10"
                                              >
                                                  <Skeleton className="h-6 w-full" />
                                              </TableCell>
                                          );
                                      })}
                                  </TableRow>
                              ))
                            : table.getRowModel().rows.map((row) => (
                                  <TableRow key={row.id} className="group/row">
                                      {row.getVisibleCells().map((cell) => {
                                          const selectedBg = row.getIsSelected()
                                              ? "bg-muted"
                                              : "";

                                          const metaClass =
                                              cell.column.columnDef?.meta
                                                  ?.className ?? "";
                                          return (
                                              <TableCell
                                                  key={cell.id}
                                                  className={`h-10 ${metaClass} ${selectedBg} `}
                                              >
                                                  {flexRender(
                                                      cell.column.columnDef
                                                          .cell,
                                                      cell.getContext(),
                                                  )}
                                              </TableCell>
                                          );
                                      })}
                                  </TableRow>
                              ))}
                        {isError ? (
                            <TableRow>
                                <TableCell colSpan={9999}>
                                    <div className="flex items-center justify-center gap-2">
                                        <div>
                                            <CloudAlert />
                                        </div>
                                        <div>No Data Found!</div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : null}
                    </TableBody>
                </Table>
            </div>
            <Pagination
                getCanPreviousPage={table.getCanPreviousPage}
                getCanNextPage={table.getCanNextPage}
                firstPage={table.firstPage}
                previousPage={table.previousPage}
                nextPage={table.nextPage}
                lastPage={table.lastPage}
                setPage={table.setPageIndex}
                pageIndex={table.getState().pagination.pageIndex}
            />
        </div>
    );
}
