import { ColumnDef } from "@tanstack/react-table";
import { RowData } from "../../types";
import ButtonAction from "../button-action";
import NCMComponent from "../ncm-component";
import PartDescriptionComponent from "../part-description-component";
import { PricePerKgComponent } from "../price-per-x-component";
import { QuantityComponents } from "../quantity-component";
import SalesPriceComponent from "../sales-price-component";
import WeightComponent from "../weight-component";

export const ManualColumns: ColumnDef<RowData<"manual">>[] = [
	{
		header: "Quantity",
		accessorKey: "quantity",
		cell: ({ row }) => (
			<QuantityComponents
				row={row}
				type={"manual"}
				value={row.original.quantity.toString()}
			/>
		),
	},
	{
		header: "Part Description",
		accessorKey: "partDescription",
		cell: ({ row }) => (
			<PartDescriptionComponent
				row={row}
				type={"manual"}
				option={row.original.partDescription}
			/>
		),
	},
	{
		header: "NCM",
		accessorKey: "ncm",
		cell: ({ row }) => (
			<NCMComponent row={row} type="manual" option={row.original.ncm} />
		),
	},
	{
		header: "Price per Kg",
		accessorKey: "pricePerKg",
		cell: ({ row }) => (
			<PricePerKgComponent<"manual">
				row={row}
				type="manual"
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
				type="manual"
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
				type="manual"
				option={row.original.salesPrice.toString()}
			/>
		),
	},
	{
		header: "Actions",
		accessorKey: "_actions",
		cell: ({ row }) => (
			<ButtonAction<"manual">
				row={row}
				title="Actions"
				type="manual"
				summaryContent={row.original.summary}
			/>
		),
	},
];
