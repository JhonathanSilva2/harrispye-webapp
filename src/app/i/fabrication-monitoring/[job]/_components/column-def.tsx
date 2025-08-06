"use client";

import { ColumnDef } from "@tanstack/react-table";
import { fabrication_monitoring } from "@/../prisma/generated/client-hp-base";

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
            header: () => (
                <span className="pl-5" style={{ fontWeight: 800 }}>
                    Drawing Ref
                </span>
            ),
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
                    "bg-background sticky left-[60px] min-w-[230px] max-w-[230px] group-hover/row:bg-muted border-y transition-colors",
            },
        },
        {
            accessorKey: "spool_number",
            header: () => <span style={{ fontWeight: 800 }}>Spool Number</span>,
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
                    "bg-background sticky left-[290px] min-w-[180px] max-w-[180px] group-hover/row:bg-muted border-y transition-colors ",
            },
        },
        {
            accessorKey: "description",
            header: () => <span style={{ fontWeight: 800 }}>Description</span>,
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
                className: "min-w-[200px] border-y",
            },
        },
        {
            accessorKey: "client_approval",
            header: () => (
                <span style={{ fontWeight: 800 }}>Client Approval</span>
            ),
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
            meta: {
                className: "border-y",
            },
        },
        {
            accessorKey: "manager_approval",
            header: () => (
                <span style={{ fontWeight: 800 }}>Manager Approval</span>
            ),
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
            meta: {
                className: "border-y",
            },
        },
        {
            accessorKey: "spec",
            header: () => <span style={{ fontWeight: 800 }}>Spec</span>,
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
                className: "min-w-[180px] border-y",
            },
        },
        {
            accessorKey: "mass",
            header: () => <span style={{ fontWeight: 800 }}>Mass</span>,
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
                className: "min-w-[180px] border-y",
            },
        },
        {
            accessorKey: "price_per_kg",
            header: () => <span style={{ fontWeight: 800 }}>Price per KG</span>,
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
                className: "min-w-[180px] border-y",
            },
        },
        {
            accessorKey: "gross_spool_cost",
            header: () => <span style={{ fontWeight: 800 }}>Spool Cost</span>,
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
                className: "min-w-[180px] border-y",
            },
        },
        {
            accessorKey: "materials_ordered",
            header: () => (
                <span style={{ fontWeight: 800 }}>Materials Ordered</span>
            ),
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
                className: "min-w-[180px] border-y",
            },
        },
        {
            accessorKey: "materials_arrived",
            header: () => (
                <span style={{ fontWeight: 800 }}>Materials Arrived</span>
            ),
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
                className: "min-w-[180px] border-y",
            },
        },
        {
            accessorKey: "fabrication_complete",
            header: () => (
                <span style={{ fontWeight: 800 }}>Fabrication Complete</span>
            ),
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
                className: "min-w-[180px] border-y",
            },
        },
        {
            accessorKey: "scan_3d",
            header: () => <span style={{ fontWeight: 800 }}>3D Scan</span>,
            cell: ({ row, table }) => (
                <AutoSaveInput
                    row={row}
                    table={table}
                    type="percentage"
                    name={"scan_3d"}
                    permission={
                        table.options.meta?.FabMonPermissions
                            ? table.options.meta.FabMonPermissions["scan_3d"]
                            : false
                    }
                />
            ),
            meta: {
                className: "min-w-[180px] border-y",
            },
        },
        {
            accessorKey: "ndt_complete",
            header: () => <span style={{ fontWeight: 800 }}>NDT Complete</span>,
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
                className: "min-w-[180px] border-y",
            },
        },
        {
            accessorKey: "pressure_test",
            header: () => (
                <span style={{ fontWeight: 800 }}>Pressure Test</span>
            ),
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
                className: "min-w-[180px] border-y",
            },
        },
        {
            accessorKey: "internal_coating",
            header: () => (
                <span style={{ fontWeight: 800 }}>Internal Coating</span>
            ),
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
                className: "min-w-[180px] border-y",
            },
        },
        {
            accessorKey: "external_coating",
            header: () => (
                <span style={{ fontWeight: 800 }}>External Coating</span>
            ),
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
                className: "min-w-[180px] border-y",
            },
        },
        {
            accessorKey: "packing",
            header: () => <span style={{ fontWeight: 800 }}>Packing</span>,
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
                className: "min-w-[180px] border-y",
            },
        },
        {
            accessorKey: "dispatch",
            header: () => <span style={{ fontWeight: 800 }}>Dispatch</span>,
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
                className: "min-w-[180px] border-y",
            },
        },
        {
            accessorKey: "notes",
            header: () => <span style={{ fontWeight: 800 }}>Notes</span>,
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
                className: "min-w-[180px] border-y",
            },
        },
        {
            accessorKey: "_actions",
            header: () => <span style={{ fontWeight: 800 }}>Actions</span>,
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
            meta: {
                className: "border-y",
            },
            enableSorting: false,
        },
    ];
