import { ColumnDef } from "@tanstack/react-table";
import { RowData } from "../../types";
import ButtonAction from "../button-action";
import DiameterComponent from "../diameter-component";
import { PricePerJointComponent } from "../price-per-x-component";
import { NumJointsComponents } from "../quantity-component";
import SalesPriceComponent from "../sales-price-component";
import SpecComponent from "../spec-component";

export const LooseMaterialColumns: ColumnDef<RowData<"looseMaterial">>[] = [
	{
		header: "Spec",
		accessorKey: "spec",
		cell: ({ row }) => (
			<SpecComponent
				row={row}
				type={"looseMaterial"}
				option={row.original.spec}
			/>
		),
	},
	{
		header: "Diameter",
		accessorKey: "diameter",
		cell: ({ row }) => (
			<DiameterComponent
				row={row}
				type={"looseMaterial"}
				option={row.original.diameter}
			/>
		),
	},
	{
		header: "Price per Joint",
		accessorKey: "pricePerJoint",
		cell: ({ row }) => (
			<PricePerJointComponent
				row={row}
				type={"looseMaterial"}
				option={row.original.pricePerJoint.toString()}
			/>
		),
	},
	{
		header: "Number of Joints",
		accessorKey: "numJoints",
		cell: ({ row }) => <NumJointsComponents row={row} />,
	},
	{
		header: "Sales Price",
		accessorKey: "salesPrice",
		cell: ({ row }) => (
			<SalesPriceComponent
				row={row}
				type="looseMaterial"
				option={row.original.salesPrice.toString()}
			/>
		),
	},
	{
		header: "Actions",
		accessorKey: "_actions",
		cell: ({ row }) => (
			<ButtonAction<"looseMaterial">
				row={row}
				title="Actions"
				type="looseMaterial"
				summaryContent={row.original.summary}
			/>
		),
	},
];
