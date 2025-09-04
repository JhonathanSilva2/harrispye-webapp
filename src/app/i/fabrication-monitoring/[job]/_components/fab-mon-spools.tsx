"use client";

import { FabMonSpoolsPermission } from "@/app/api/fabrication-monitoring/permissions/_action/fetch-permission";
import { DataTable } from "@/components/data-table";
import { Searchable } from "@/components/data-table/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFabMon } from "@/hooks/query/use-fab-mon";
import { useFilters } from "@/hooks/use-filters";
import AccessControl from "@/lib/auth/policy-decision-point";
import { PaginationConstants } from "@/lib/constants/pagination";
import { sortByToState, stateToSortBy } from "@/utils/table-sort-mapper";
import { SortingState, Updater } from "@tanstack/react-table";
import { Session } from "next-auth";
import { useEffect, useMemo, useState } from "react";
import {
    FabMonSpoolsProvider,
    useFabMonSpools,
} from "../_providers/fab-mon-spool-provider";
import ChartSpools from "./chart-spools";
import { fabricationMonitoringColumns } from "./column-def";
import SummarySpools from "./sumary-spools";
import TableHeader from "./table-header";

const advancedSearch: Searchable[] = [
    {
        key: "drawing_ref",
        type: "text",
        title: "Drawing Ref",
    },
    {
        key: "spool_number",
        type: "text",
        title: "Spool Number",
    },
    {
        key: "description",
        type: "text",
        title: "Description",
    },
    {
        key: "client_approval",
        type: "select",
        options: [
            {
                value: "PENDING",
                label: "Pending",
            },
            {
                value: "APPROVED",
                label: "Approved",
            },
            {
                value: "DECLINED",
                label: "Declined",
            },
        ],
        title: "Client Approval",
    },
    {
        key: "manager_approval",
        type: "select",
        options: [
            {
                value: "PENDING",
                label: "Pending",
            },
            {
                value: "APPROVED",
                label: "Approved",
            },
            {
                value: "DECLINED",
                label: "Declined",
            },
        ],
        title: "Manager Approval",
    },
    {
        key: "spec",
        type: "text",
        title: "SPEC",
    },
    {
        key: "mass",
        type: "number",
        title: "Mass",
    },
    {
        key: "price_per_kg",
        type: "number",
        title: "Price Per Kg",
    },
    {
        key: "gross_spool_cost",
        type: "number",
        title: "Spool Cost",
    },
    {
        key: "dispatch",
        type: "number",
        title: "Dispatch",
    },
    {
        key: "notes",
        type: "text",
        title: "Notes",
    },
];

const FabMonSpoolsTable = ({
    hp,
    session,
    permissions,
}: {
    hp: string;
    session: Session;
    permissions: FabMonSpoolsPermission;
}) => {
    const { state, dispatch } = useFabMonSpools();
    const [isEditing, setIsEditing] = useState(false);
    const accessControl = new AccessControl(session);

    const canEdit = accessControl.hasRoleAccess(
        "EDIT",
        "fabrication-monitoring-spool-table",
    );
    const isAdmin = accessControl.isAdmin();
    const canAddSpool = isAdmin || permissions.add_spools;
    const canSeeGraphs = isAdmin || permissions.graph;
    const canViewSummary = isAdmin || permissions.summary;

    const { filters, resetFilters, setFilters } = useFilters();

    const { data, isError, isPending } = useFabMon({
        hp,
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

    let unpermittedColumns: Record<string, false> = {};

    if (!isAdmin) {
        unpermittedColumns = permissions
            ? Object.fromEntries(
                  Object.entries(permissions)
                      .filter(([, value]) => value === "NONE")
                      .map(([key]) => [key, false]),
              )
            : {};
    }

    useEffect(() => {
        if (!data?.data) return;
        dispatch({ type: "init", job: hp, payload: data.data.spools });
    }, [data, dispatch, hp]);

    const columns = useMemo(() => fabricationMonitoringColumns, []);
    const job = data?.data.job;
    return (
        <FabMonSpoolsProvider>
            <div>
                {canSeeGraphs && (
                    <ChartSpools loading={isPending} data={data} />
                )}
                {canViewSummary && (
                    <SummarySpools loading={isPending} data={data} hp={hp} />
                )}

                {!permissions && isPending ? (
                    <Skeleton className="min min-h-[250px] w-full rounded-xl" />
                ) : (
                    <Card>
                        <CardHeader>
                            <h2 className="text-lg font-semibold">
                                Fabrication Table
                            </h2>
                        </CardHeader>
                        <CardContent>
                            <DataTable
                                data={
                                    data?.data
                                        ? {
                                              ...data,
                                              data: data?.data?.spools ?? [],
                                          }
                                        : {
                                              data: [],
                                              rowCount: 0,
                                              page: 1,
                                              pageSize: 10,
                                          }
                                }
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
                                headerComponent={
                                    !isPending && !isError ? (
                                        <TableHeader
                                            canEdit={canEdit}
                                            canAddSpool={canAddSpool}
                                            job={hp}
                                            jobId={data?.data.job.id}
                                            onToggle={setIsEditing}
                                        />
                                    ) : undefined
                                }
                                unpermittedColumns={unpermittedColumns}
                                meta={{
                                    hp,
                                    isEditing,
                                    FabMonPermissions: permissions,
                                    job: job,
                                }}
                            />
                        </CardContent>
                    </Card>
                )}
            </div>
        </FabMonSpoolsProvider>
    );
};

export default FabMonSpoolsTable;
