"use client";

import { fabrication_monitoring } from "@/../prisma/generated/client-hp-base";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import Actions from "./actions";
import ApprovalSelect from "./approval-select";
import AutoSaveInput from "./auto-save-input";
import { DrawingRefSelect } from "./drawing-ref-datalist";
import { formatBrNumber } from "@/utils/brasil-format-number";

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
                    "bg-background sticky left-0 min-w-[60px] max-w-[60px] group-hover/row:bg-muted border-y transition-colors z-10",
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
                            : "NONE"
                    }
                    row={row}
                    table={table}
                />
            ),

            meta: {
                className:
                    "bg-background sticky left-[60px] min-w-[260px] max-w-[260px] group-hover/row:bg-muted border-y transition-colors z-10",
            },
        },
        {
            accessorKey: "spool_number",
            header: () => <span style={{ fontWeight: 800 }}>Item Number</span>,
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
                                : "NONE"
                        }
                    />
                );
            },

            meta: {
                className:
                    "bg-background sticky left-[320px] min-w-[180px] max-w-[180px] group-hover/row:bg-muted border-y transition-colors z-10 ",
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
                            : "NONE"
                    }
                />
            ),
            meta: {
                className: "min-w-[200px] border-y",
            },
            enableSorting: false,
            enableHiding: false,
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

                const job = table.options.meta?.job;
                if (!job) {
                    return <div>Loading...</div>; // or some fallback UI
                }

                return (
                    <ApprovalSelect
                        status={status}
                        row={row}
                        table={table}
                        select_name="client_approval"
                        job={job}
                        permission={
                            table.options.meta?.FabMonPermissions
                                ? table.options.meta.FabMonPermissions[
                                      "client_approval"
                                  ]
                                : "NONE"
                        }
                    />
                );
            },
            meta: {
                className: "border-y",
            },
            enableSorting: false,
            enableHiding: false,
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
                                : "NONE"
                        }
                    />
                );
            },
            meta: {
                className: "border-y",
            },
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "progress",
            header: () => <span style={{ fontWeight: 800 }}>Progress</span>,
            cell: ({ row, table }) => {
                const progressFields = [
                    "materials_ordered",
                    "materials_arrived",
                    "fabrication_complete",
                    "ndt_complete",
                    "pressure_test",
                    "internal_coating",
                    "external_coating",
                    "packing",
                    "dispatch",
                ];

                const fieldValues = progressFields.map((field) => {
                    const value = row.getValue(field) as number | null;
                    return value ?? 0;
                });

                const average =
                    fieldValues.reduce((a, b) => a + b, 0) /
                    progressFields.length;

                return <span>{average.toFixed(1)}%</span>;
            },
            meta: {
                className: "min-w-[180px] border-y",
            },
            enableSorting: false,
            enableHiding: false,
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
                            : "NONE"
                    }
                />
            ),
            meta: {
                className: "min-w-[180px] border-y",
            },
            enableSorting: false,
            enableHiding: false,
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
                            : "NONE"
                    }
                />
            ),
            meta: {
                className: "min-w-[180px] border-y",
            },
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "m2_fbe",
            header: () => <span style={{ fontWeight: 800 }}>M² FBE</span>,
            cell: ({ row, table }) => (
                <AutoSaveInput
                    row={row}
                    table={table}
                    type="number"
                    name={"m2_fbe"}
                    permission={
                        table.options.meta?.FabMonPermissions
                            ? table.options.meta.FabMonPermissions["m2_fbe"]
                            : "NONE"
                    }
                />
            ),
            meta: {
                className: "min-w-[180px] border-y",
            },
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "m2_galvanized",
            header: () => (
                <span style={{ fontWeight: 800 }}>M² Galvanized</span>
            ),
            cell: ({ row, table }) => (
                <AutoSaveInput
                    row={row}
                    table={table}
                    type="number"
                    name={"m2_galvanized"}
                    permission={
                        table.options.meta?.FabMonPermissions
                            ? table.options.meta.FabMonPermissions[
                                  "m2_galvanized"
                              ]
                            : "NONE"
                    }
                />
            ),
            meta: {
                className: "min-w-[180px] border-y",
            },
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "m2_price",
            header: () => <span style={{ fontWeight: 800 }}>Price per M²</span>,
            cell: ({ row, table }) => (
                <AutoSaveInput
                    row={row}
                    table={table}
                    type="currency"
                    name={"m2_price"}
                    permission={
                        table.options.meta?.FabMonPermissions
                            ? table.options.meta.FabMonPermissions["m2_price"]
                            : "NONE"
                    }
                />
            ),
            meta: {
                className: "min-w-[180px] border-y",
            },
            enableSorting: false,
            enableHiding: false,
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
                            : "NONE"
                    }
                />
            ),
            meta: {
                className: "min-w-[180px] border-y",
            },
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "gross_spool_cost",
            header: () => <span style={{ fontWeight: 800 }}>Item Cost</span>,
            cell: ({ row, table }) => {
                const mass = Number(row.getValue("mass")) || 0;
                const pricePerKg = Number(row.getValue("price_per_kg")) || 0;
                const cost = mass * pricePerKg;
                return "R$ " + formatBrNumber(cost);
            },
            meta: {
                className: "min-w-[180px] border-y",
            },
            enableSorting: false,
            enableHiding: false,
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
                            : "NONE"
                    }
                />
            ),
            meta: {
                className: "min-w-[180px] border-y",
            },
            enableSorting: false,
            enableHiding: false,
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
                            : "NONE"
                    }
                />
            ),
            meta: {
                className: "min-w-[180px] border-y",
            },
            enableSorting: false,
            enableHiding: false,
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
                            : "NONE"
                    }
                />
            ),
            meta: {
                className: "min-w-[180px] border-y",
            },
            enableSorting: false,
            enableHiding: false,
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
                            : "NONE"
                    }
                />
            ),
            meta: {
                className: "min-w-[180px] border-y",
            },
            enableSorting: false,
            enableHiding: false,
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
                            : "NONE"
                    }
                />
            ),
            meta: {
                className: "min-w-[180px] border-y",
            },
            enableSorting: false,
            enableHiding: false,
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
                            : "NONE"
                    }
                />
            ),
            meta: {
                className: "min-w-[180px] border-y",
            },
            enableSorting: false,
            enableHiding: false,
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
                            : "NONE"
                    }
                />
            ),
            meta: {
                className: "min-w-[180px] border-y",
            },
            enableSorting: false,
            enableHiding: false,
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
                            : "NONE"
                    }
                />
            ),
            meta: {
                className: "min-w-[180px] border-y",
            },
            enableSorting: false,
            enableHiding: false,
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
                            : "NONE"
                    }
                />
            ),
            meta: {
                className: "min-w-[180px] border-y",
            },
            enableSorting: false,
            enableHiding: false,
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
                            : "NONE"
                    }
                />
            ),
            meta: {
                className: "min-w-[180px] border-y",
            },
            enableSorting: false,
            enableHiding: false,
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
                            : "NONE"
                    }
                />
            ),
            meta: {
                className: "min-w-[180px] border-y",
            },
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "_actions",
            header: () => <span style={{ fontWeight: 800 }}>Actions</span>,
            cell: ({ table, row }) => {
                return (
                    <Actions
                        row={row}
                        table={table}
                        deleteSpool={
                            table.options.meta?.FabMonPermissions
                                ?.delete_spools ?? false
                        }
                    />
                );
            },
            meta: {
                className: "border-y",
            },
            enableSorting: false,
            enableHiding: false,
        },
    ];
