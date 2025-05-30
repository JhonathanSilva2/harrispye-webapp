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

interface ApprovedType {
    APPROVED: number;
    DECLINED: number;
    PENDING: number;
}
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

    const { filters, resetFilters, setFilters } = useFilters();
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenDrawing, setIsOpenDrawing] = useState(false);

    const { data, isError, isPending } = useFabMon({
        hp,
        filters,
    });
    const designs = [
        {
            id: 4,
            fabrication_monitoring_jobs_id: 2,
            filename:
                "0f61ab2b897919cba9e5f49ab1d7085f061e029a0d80b31c3f23d54647181a7e.jpg",
            display_name: "obaoba.jpg",
            created_at: new Date("2025-04-01T14:45:49.000Z"),
        },
        {
            id: 5,
            fabrication_monitoring_jobs_id: 2,
            filename:
                "b34ebcd63fd12523cd49bee4aeaec09de6bba59ac4c113296a0a252f122e7f10.png",
            display_name: "Captura de tela 2025-03-29 130358.png",
            created_at: new Date("2025-04-01T14:46:04.000Z"),
        },
    ];
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
    const columns = useMemo(() => fabricationMonitoringColumns, []);
    const formatLabel = (targetLabel: string) => {
        // se tiver _, separar em palavras pegar os 2 primeiros e capitalizar
        // se tiver somente 2 palavras, uppercase
        // se tiver somente 1 palavra, capitalizar
        let label;
        if (targetLabel.includes("_")) {
            label = targetLabel
                .split("_")
                .slice(0, 2)
                .map((word: string) => _.capitalize(word))
                .join(" ");
        } else if (targetLabel.split("").length === 2) {
            label = targetLabel.toUpperCase();
        } else {
            label = _.capitalize(targetLabel) as string;
        }
        return label;
    };
    const approvals = data?.data?.summary?.approvals;
    const spoolsCount = data?.data?.summary["Spools Count"] ?? 0;
    const grossSpoolCostByApproval = data?.data?.summary[
        "Gross Spool Cost By Approval"
    ] as ApprovedType;
    const approvalChartDescription = {
        label: "spools",
        value: String(spoolsCount),
    };
    const grossSpoolCostChartDescription = {
        label: "Gross Cost",
        value: String(
            formatMoney(
                Number(data?.data?.summary["Total Gross Spool Cost"] ?? 0),
            ),
        ),
    };
    return (
        <div className="">
            <div className="flex justify-center">
                <JobCharts title={""} description={""}>
                    <PieChartApprovals
                        title={""}
                        description={""}
                        data={approvals}
                        totalsDescription={approvalChartDescription}
                    />
                    <ChartLegend />

                    <PieChartApprovals
                        title={""}
                        description={""}
                        data={grossSpoolCostByApproval}
                        moeda={"BRL"}
                        totalsDescription={grossSpoolCostChartDescription}
                    />
                </JobCharts>
            </div>
            <Card className="mb-4 mt-10 flex flex-col">
                <CardHeader>
                    <div className="flex justify-between text-center">
                        <h2 className="text-lg font-semibold">Summary</h2>
                        <div className="flex gap-2">
                            <EditDialog
                                mode="edit"
                                hp={hp}
                                triggerBtn={
                                    <Button
                                        variant="outline"
                                        className="flex items-center gap-2"
                                    >
                                        <span className="w-full">
                                            Manage Job
                                        </span>
                                    </Button>
                                }
                                open={isOpen}
                                setOpen={setIsOpen}
                            />
                            <DrawingDialog
                                jobId={data?.data.job.id}
                                designs={data?.data.designs}
                                triggerBtn={
                                    <Button
                                        variant="outline"
                                        className="flex items-center gap-2"
                                    >
                                        <span className="w-full">
                                            Manage Drawings
                                        </span>
                                    </Button>
                                }
                                open={isOpenDrawing}
                                setOpen={setIsOpenDrawing}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="mb-5 flex w-full flex-wrap px-6">
                    {/* SUMMARY */}
                    <div className="mb-4 grid max-h-[150px] w-full grid-cols-4 gap-4">
                        {Object.entries(data?.data.summary ?? {}).map(
                            ([label, value], index) => {
                                if (typeof value === "object") return null;
                                return (
                                    <SummaryCard
                                        label={label}
                                        value={value}
                                        key={index}
                                    />
                                );
                            },
                        )}
                        {/* JOB */}
                        {Object.entries(data?.data.job ?? {}).map(
                            ([key, value], index) => {
                                const label = formatLabel(key);
                                const formattedValue =
                                    key === "expected_delivery_date" ||
                                    key === "contract_delivery_date"
                                        ? format(value as Date, "dd/MM/yyyy")
                                        : value || "";

                                return (
                                    <SummaryCard
                                        label={label}
                                        value={formattedValue}
                                        key={index}
                                    />
                                );
                            },
                        )}
                    </div>
                </CardContent>
            </Card>

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
                            <TableHeader job={hp} onToggle={setIsEditing} />
                        }
                        meta={{ hp, isEditing }}
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default FabMonSpoolsTable;
