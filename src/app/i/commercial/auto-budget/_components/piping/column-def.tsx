import { ColumnDef } from "@tanstack/react-table";
import { RowData } from "../../types";
import ButtonAction from "../button-action";
import DiameterComponent from "../diameter-component";
import { PricePerKgComponent } from "../price-per-x-component";
import SalesPriceComponent from "../sales-price-component";
import SpecComponent from "../spec-component";
import WeightComponent from "../weight-component";

export const PipingColumns: ColumnDef<RowData<"piping">>[] = [
	{
		header: "Spec",
		accessorKey: "spec",
		cell: ({ row }) => (
			<SpecComponent row={row} type="piping" option={row.original.spec} />
		),
	},
	{
		header: "Diameter",
		accessorKey: "diameter",
		cell: ({ row }) => (
			<DiameterComponent
				row={row}
				type="piping"
				option={row.original.diameter}
			/>
		),
	},
	{
		header: "Price per Kg",
		accessorKey: "pricePerKg",
		cell: ({ row }) => (
			<PricePerKgComponent<"piping">
				row={row}
				type="piping"
				option={row.original.pricePerKg.toString()}
			/>
		),
	},
	{
		header: "Weight",
		accessorKey: "weight",
		cell: ({ row }) => (
			<WeightComponent
				row={row}
				type="piping"
				value={row.original.weight.toString()}
			/>
		),
	},
	{
		header: "Sales Price",
		accessorKey: "salesPrice",
		cell: ({ row }) => (
			<SalesPriceComponent
				row={row}
				type="piping"
				option={row.original.salesPrice.toString()}
			/>
		),
	},
	{
		header: "Actions",
		accessorKey: "_actions",
		cell: ({ row }) => (
			<ButtonAction<"piping">
				row={row}
				title="Actions"
				type="piping"
				summaryContent={row.original.summary}
				breakdownContent={row.original.breakdown}
			/>
		),
	},
];
