"use client";

import { ColumnDef } from "@tanstack/react-table";

import { fabrication_monitoring } from "@/../prisma/generated/client-hp-base";

import { Checkbox } from "@/components/ui/checkbox";
import AutoSaveInput from "./auto-save-input";
import ClientApprovalSelect from "./client-approval-select";
import DeleteSpoolButton from "./delete-spool-button";
import { DrawingRefSelect } from "./drawing-ref-datalist";

export const fabricationMonitoringColumns: ColumnDef<fabrication_monitoring>[] =
	[
		{
			id: "select",
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
				<DrawingRefSelect row={row} table={table} />
			),
			meta: {
				className:
					"bg-background sticky left-[60px] min-w-[180px] max-w-[180px] group-hover/row:bg-muted border-y transition-colors",
			},
		},
		{
			accessorKey: "spool_number",
			header: "Spool Number",
			cell: ({ row, table }) => (
				<AutoSaveInput
					row={row}
					table={table}
					type="text"
					name={"spool_number"}
				/>
			),

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
				const hp = table.options.meta!.hp ?? "";
				const spoolID = String(row.original.id);
				const isEditing = table.options.meta!.isEditing ?? "";

				return (
					<ClientApprovalSelect
						status={status}
						isEditing={isEditing}
						spoolID={spoolID}
						hp={hp}
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
				const hp = table.options.meta!.hp ?? "";
				const spoolID = row.original.id;

				return <DeleteSpoolButton job={hp} spoolID={String(spoolID)} />;
			},
			enableSorting: false,
		},
	];
