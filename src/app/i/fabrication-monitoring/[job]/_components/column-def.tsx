"use client";

import { ColumnDef } from "@tanstack/react-table";
import { fabrication_monitoring } from "@prisma/client-hp-base";
import { Checkbox } from "@/components/ui/checkbox";
import ApprovalSelect from "./approval-select";
import AutoSaveInput from "./auto-save-input";
import DeleteSpoolButton from "./delete-spool-button";
import { DrawingRefSelect } from "./drawing-ref-datalist";
import { Table } from "lucide-react";
import Actions from "./actions";

export const fabricationMonitoringColumns: ColumnDef<fabrication_monitoring>[] =
    [
        {
            id: "select",
            accessorKey: "select",

            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) =>
                        table.toggleAllPageRowsSelected(!!value)
                    }
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            meta: {
                className:
                    "bg-background sticky left-0 min-w-[60px] max-w-[60px] group-hover/row:bg-muted border-y transition-colors",
            },
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "drawing_ref",
            header: "Drawing Ref",
            cell: ({ row, table }) => (
                <DrawingRefSelect
                    permission={
                        table.options.meta?.FabMonPermissions
                            ? table.options.meta.FabMonPermissions[
                                  "drawing_ref"
                              ]
                            : false
                    }
                    row={row}
                    table={table}
                />
            ),
            meta: {
                className:
                    "bg-background sticky left-[60px] min-w-[180px] max-w-[180px] group-hover/row:bg-muted border-y transition-colors",
            },
        },
        {
            accessorKey: "spool_number",
            header: "Spool Number",
            cell: ({ row, table }) => {
                return (
                    <AutoSaveInput
                        row={row}
                        table={table}
                        type="text"
                        name={"spool_number"}
                        permission={
                            table.options.meta?.FabMonPermissions
                                ? table.options.meta.FabMonPermissions[
                                      "spool_number"
                                  ]
                                : false
                        }
                    />
                );
            },

            meta: {
                className:
                    "bg-background sticky left-[240px] min-w-[180px] max-w-[180px] group-hover/row:bg-muted border-y transition-colors",
            },
        },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({ row, table }) => (
                <AutoSaveInput
                    row={row}
                    table={table}
                    type="text"
                    name={"description"}
                    permission={
                        table.options.meta?.FabMonPermissions
                            ? table.options.meta.FabMonPermissions[
                                  "description"
                              ]
                            : false
                    }
                />
            ),
            meta: {
                className: "min-w-[200px]",
            },
        },
        {
            accessorKey: "client_approval",
            header: "Client Approval",
            cell: ({ row, table }) => {
                const status = row.getValue("client_approval") as
                    | "APPROVED"
                    | "DECLINED"
                    | "PENDING";

                return (
                    <ApprovalSelect
                        status={status}
                        row={row}
                        table={table}
                        select_name="client_approval"
                        permission={
                            table.options.meta?.FabMonPermissions
                                ? table.options.meta.FabMonPermissions[
                                      "client_approval"
                                  ]
                                : false
                        }
                    />
                );
            },
        },
        {
            accessorKey: "manager_approval",
            header: "Manager Approval",
            cell: ({ row, table }) => {
                const status = row.getValue("manager_approval") as
                    | "APPROVED"
                    | "DECLINED"
                    | "PENDING";

                return (
                    <ApprovalSelect
                        status={status}
                        row={row}
                        table={table}
                        select_name="manager_approval"
                        permission={
                            table.options.meta?.FabMonPermissions
                                ? table.options.meta.FabMonPermissions[
                                      "manager_approval"
                                  ]
                                : false
                        }
                    />
                );
            },
        },
        {
            accessorKey: "spec",
            header: "Spec",
            cell: ({ row, table }) => (
                <AutoSaveInput
                    row={row}
                    table={table}
                    type="text"
                    name={"spec"}
                    permission={
                        table.options.meta?.FabMonPermissions
                            ? table.options.meta.FabMonPermissions["spec"]
                            : false
                    }
                />
            ),
            meta: {
                className: "min-w-[180px]",
            },
        },
        {
            accessorKey: "mass",
            header: "Mass",
            cell: ({ row, table }) => (
                <AutoSaveInput
                    row={row}
                    table={table}
                    type="number"
                    name={"mass"}
                    permission={
                        table.options.meta?.FabMonPermissions
                            ? table.options.meta.FabMonPermissions["mass"]
                            : false
                    }
                />
            ),
            meta: {
                className: "min-w-[180px]",
            },
        },
        {
            accessorKey: "price_per_kg",
            header: "Price per KG",
            cell: ({ row, table }) => (
                <AutoSaveInput
                    row={row}
                    table={table}
                    type="currency"
                    name={"price_per_kg"}
                    permission={
                        table.options.meta?.FabMonPermissions
                            ? table.options.meta.FabMonPermissions[
                                  "price_per_kg"
                              ]
                            : false
                    }
                />
            ),
            meta: {
                className: "min-w-[180px]",
            },
        },
        {
            accessorKey: "gross_spool_cost",
            header: "Gross Spool Cost",
            cell: ({ row, table }) => (
                <AutoSaveInput
                    row={row}
                    table={table}
                    type="currency"
                    name={"gross_spool_cost"}
                    permission={
                        table.options.meta?.FabMonPermissions
                            ? table.options.meta.FabMonPermissions[
                                  "gross_spool_cost"
                              ]
                            : false
                    }
                />
            ),
            meta: {
                className: "min-w-[180px]",
            },
        },
        {
            accessorKey: "materials_ordered",
            header: "Materials Ordered",
            cell: ({ row, table }) => (
                <AutoSaveInput
                    row={row}
                    table={table}
                    type="percentage"
                    name={"materials_ordered"}
                    permission={
                        table.options.meta?.FabMonPermissions
                            ? table.options.meta.FabMonPermissions[
                                  "materials_ordered"
                              ]
                            : false
                    }
                />
            ),
            meta: {
                className: "min-w-[180px]",
            },
        },
        {
            accessorKey: "materials_arrived",
            header: "Materials Arrived",
            cell: ({ row, table }) => (
                <AutoSaveInput
                    row={row}
                    table={table}
                    type="percentage"
                    name={"materials_arrived"}
                    permission={
                        table.options.meta?.FabMonPermissions
                            ? table.options.meta.FabMonPermissions[
                                  "materials_ordered"
                              ]
                            : false
                    }
                />
            ),
            meta: {
                className: "min-w-[180px]",
            },
        },
        {
            accessorKey: "fabrication_complete",
            header: "Fabrication Complete",
            cell: ({ row, table }) => (
                <AutoSaveInput
                    row={row}
                    table={table}
                    type="percentage"
                    name={"fabrication_complete"}
                    permission={
                        table.options.meta?.FabMonPermissions
                            ? table.options.meta.FabMonPermissions[
                                  "fabrication_complete"
                              ]
                            : false
                    }
                />
            ),
            meta: {
                className: "min-w-[180px]",
            },
        },
        {
            accessorKey: "ndt_complete",
            header: "NDT Complete",
            cell: ({ row, table }) => (
                <AutoSaveInput
                    row={row}
                    table={table}
                    type="percentage"
                    name={"ndt_complete"}
                    permission={
                        table.options.meta?.FabMonPermissions
                            ? table.options.meta.FabMonPermissions[
                                  "ndt_complete"
                              ]
                            : false
                    }
                />
            ),
            meta: {
                className: "min-w-[180px]",
            },
        },
        {
            accessorKey: "pressure_test",
            header: "Pressure Test",
            cell: ({ row, table }) => (
                <AutoSaveInput
                    row={row}
                    table={table}
                    type="percentage"
                    name={"pressure_test"}
                    permission={
                        table.options.meta?.FabMonPermissions
                            ? table.options.meta.FabMonPermissions[
                                  "pressure_test"
                              ]
                            : false
                    }
                />
            ),
            meta: {
                className: "min-w-[180px]",
            },
        },
        {
            accessorKey: "internal_coating",
            header: "Internal Coating",
            cell: ({ row, table }) => (
                <AutoSaveInput
                    row={row}
                    table={table}
                    type="percentage"
                    name={"internal_coating"}
                    permission={
                        table.options.meta?.FabMonPermissions
                            ? table.options.meta.FabMonPermissions[
                                  "internal_coating"
                              ]
                            : false
                    }
                />
            ),
            meta: {
                className: "min-w-[180px]",
            },
        },
        {
            accessorKey: "external_coating",
            header: "External Coating",
            cell: ({ row, table }) => (
                <AutoSaveInput
                    row={row}
                    table={table}
                    type="percentage"
                    name={"external_coating"}
                    permission={
                        table.options.meta?.FabMonPermissions
                            ? table.options.meta.FabMonPermissions[
                                  "external_coating"
                              ]
                            : false
                    }
                />
            ),
            meta: {
                className: "min-w-[180px]",
            },
        },
        {
            accessorKey: "packing",
            header: "Packing",
            cell: ({ row, table }) => (
                <AutoSaveInput
                    row={row}
                    table={table}
                    type="percentage"
                    name={"packing"}
                    permission={
                        table.options.meta?.FabMonPermissions
                            ? table.options.meta.FabMonPermissions["packing"]
                            : false
                    }
                />
            ),
            meta: {
                className: "min-w-[180px]",
            },
        },
        {
            accessorKey: "dispatch",
            header: "Dispatch",
            cell: ({ row, table }) => (
                <AutoSaveInput
                    row={row}
                    table={table}
                    type="percentage"
                    name={"dispatch"}
                    permission={
                        table.options.meta?.FabMonPermissions
                            ? table.options.meta.FabMonPermissions["dispatch"]
                            : false
                    }
                />
            ),
            meta: {
                className: "min-w-[180px]",
            },
        },
        {
            accessorKey: "notes",
            header: "Notes",
            cell: ({ row, table }) => (
                <AutoSaveInput
                    row={row}
                    table={table}
                    type="text"
                    name={"notes"}
                    permission={
                        table.options.meta?.FabMonPermissions
                            ? table.options.meta.FabMonPermissions["notes"]
                            : false
                    }
                />
            ),
            meta: {
                className: "min-w-[180px]",
            },
        },
        {
            accessorKey: "_actions",
            header: "Actions",
            cell: ({ table, row }) => {
                return (
                    <Actions
                        row={row}
                        table={table}
                        permission={
                            table.options.meta?.FabMonPermissions
                                ? table.options.meta.FabMonPermissions[
                                      "_actions"
                                  ]
                                : false
                        }
                    />
                );
            },
            enableSorting: false,
        },
    ];
