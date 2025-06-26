"use client";

import { DataTable } from "@/components/data-table";
import { Searchable } from "@/components/data-table/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useFabMon } from "@/hooks/query/use-fab-mon";
import { useFilters } from "@/hooks/use-filters";
import { PaginationConstants } from "@/lib/constants/pagination";
import { formatMoney } from "@/utils/format-currency";
import { sortByToState, stateToSortBy } from "@/utils/table-sort-mapper";
import { SortingState, Updater } from "@tanstack/react-table";
import { format } from "date-fns";
import _ from "lodash";
import { useMemo, useState } from "react";
import { EditDialog } from "../../_components/edit-dialog";
import { ChartLegend } from "./chart-legend";
import { fabricationMonitoringColumns } from "./column-def";
import JobCharts from "./job-charts";
import { DrawingDialog } from "./manage-drawings/drawing-dialog";
import { PieChartApprovals } from "./pie-chart-approval";
import { SummaryCard } from "./summary-card";
import TableHeader from "./table-header";
import { useAccessControl } from "@/hooks/use-access-control";
import AccessControl from "@/lib/auth/policy-decision-point";
import { Permissions } from "../_permissions/permissions";
import SummarySpools from "./sumary-spools";
import ChartSpools from "./chart-spools";
import { Skeleton } from "@/components/ui/skeleton";

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

const FabMonSpoolsTable = ({ hp }: { hp: string }) => {
    const [isEditing, setIsEditing] = useState(false);
    const { accessControl, loading } = useAccessControl();
    const role = accessControl?._session.user.userAttributes?.role?.role;
    // verificar se ele tem permissão de ALL

    const userAccessControlAction =
        accessControl?.hasRoleAccess(
            "ALL",
            "fabrication-monitoring-spool-table",
        ) ||
        accessControl?.hasRoleAccess(
            "EDIT",
            "fabrication-monitoring-spool-table",
        );
    const canwrite =
        accessControl?.hasRoleAccess(
            "WRITE",
            "fabrication-monitoring-spool-table",
        ) ||
        accessControl?.hasRoleAccess(
            "ALL",
            "fabrication-monitoring-spool-table",
        );
    console.log(
        "User Access Control Action:",
        accessControl,
        "Can Write:",
        canwrite,
    );
    const isAdmin = accessControl?.isAdmin();
    const columnPermissions = isAdmin || Permissions.FabMonSpoolsPermission;
    const canSeeGraphs =
        isAdmin ||
        Permissions.getFeaturePermission(
            Permissions.FabMonFeaturesPermission.graph,
            role,
        );
    const canViewSummary =
        isAdmin ||
        Permissions.getFeaturePermission(
            Permissions.FabMonFeaturesPermission.summary,
            role,
        );

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

    const permissions = Permissions.getPermissionPayload(accessControl);

    const unpermittedColumns = permissions
        ? (Object.fromEntries(
              Object.entries(permissions).filter(
                  ([key, value]) => value === false,
              ),
          ) as Record<string, false>)
        : {};

    const columns = useMemo(() => fabricationMonitoringColumns, []);
    return (
        <div>
            {canSeeGraphs && <ChartSpools loading={isPending} data={data} />}
            {canViewSummary && (
                <SummarySpools loading={isPending} data={data} hp={hp} />
            )}

            {!permissions && isPending ? (
                <Skeleton className="min min-h-[250px] w-full rounded-xl" />
            ) : (
                <Card>
                    <CardHeader>
                        <h2 className="text-lg font-semibold">Spools</h2>
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
                                <TableHeader
                                    canEdit={userAccessControlAction ?? false}
                                    canWrite={canwrite ?? false}
                                    job={hp}
                                    onToggle={setIsEditing}
                                />
                            }
                            unpermittedColumns={unpermittedColumns}
                            meta={{
                                hp,
                                isEditing,
                                FabMonPermissions: permissions,
                            }}
                        />
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default FabMonSpoolsTable;
