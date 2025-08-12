"use client";

import { DataTable } from "@/components/data-table";
import { Searchable } from "@/components/data-table/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useFabMon } from "@/hooks/query/use-fab-mon";
import { useFilters } from "@/hooks/use-filters";
import { PaginationConstants } from "@/lib/constants/pagination";
import { sortByToState, stateToSortBy } from "@/utils/table-sort-mapper";
import { SortingState, Updater } from "@tanstack/react-table";
import _ from "lodash";
import { useMemo, useState } from "react";
import { fabricationMonitoringColumns } from "./column-def";
import TableHeader from "./table-header";
import { Permissions } from "../_permissions/permissions";
import SummarySpools from "./sumary-spools";
import ChartSpools from "./chart-spools";
import { Skeleton } from "@/components/ui/skeleton";
import { Session } from "next-auth";
import AccessControl from "@/lib/auth/policy-decision-point";

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
}: {
    hp: string;
    session: Session;
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const accessControl = new AccessControl(session);

    const role = accessControl?.getRole();
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
                                <TableHeader
                                    canEdit={userAccessControlAction ?? false}
                                    canWrite={canwrite ?? false}
                                    job={hp}
                                    jobId={data?.data.job.id}
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
