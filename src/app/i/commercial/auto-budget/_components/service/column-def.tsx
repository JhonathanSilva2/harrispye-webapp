import { ColumnDef } from "@tanstack/react-table";
import { RowData } from "../../types";
import ButtonAction from "../button-action";
import CalcTypeComponent from "../calc-type-component";
import DescriptionComponent from "../description-component";
import { DaysComponents, QuantityComponents } from "../quantity-component";
import SalesPriceComponent from "../sales-price-component";
import DailyPriceComponent from "../service-description-component";
import ServiceTypeComponent from "../service-type-component";
import UnitDailyRateComponent from "../unit-daily-rate";

export const serviceColumns: ColumnDef<RowData<"service">>[] = [
	{
		header: "Quantity",
		accessorKey: "quantity",
		cell: ({ row }) => (
			<QuantityComponents<"service">
				row={row}
				type="service"
				value={row.original.quantity.toString()}
			/>
		),
	},
	{
		header: "Description",
		accessorKey: "description",
		cell: ({ row }) => (
			<DescriptionComponent
				row={row}
				type="service"
				option={row.original.description}
			/>
		),
	},
	{
		header: "Service Type",
		accessorKey: "serviceType",
		cell: ({ row }) => (
			<ServiceTypeComponent<"service">
				row={row}
				type="service"
				option={row.original.serviceType}
			/>
		),
	},
	{
		header: "Calc Type",
		accessorKey: "calcType",
		cell: ({ row }) => (
			<CalcTypeComponent<"service">
				row={row}
				type="service"
				option={row.original.calcType}
			/>
		),
	},
	{
		header: "Daily Base Price",
		accessorKey: "dailyBasePrice",
		cell: ({ row }) => (
			<DailyPriceComponent<"service">
				row={row}
				type="service"
				dailyPriceType="dailyBasePrice"
				option={row.original.dailyBasePrice.toString()}
			/>
		),
	},
	{
		header: "Daily Sales Price",
		accessorKey: "dailySalesPrice",
		cell: ({ row }) => (
			<DailyPriceComponent<"service">
				row={row}
				type="service"
				dailyPriceType="dailySalesPrice"
				option={row.original.dailySalesPrice.toString()}
			/>
		),
	},
	{
		header: "Days",
		accessorKey: "days",
		cell: ({ row }) => (
			<DaysComponents
				row={row}
				type="service"
				readOnly={row.original.calcType === "unit" ? true : false}
				value={row.original.days.toString()}
			/>
		),
	},
	{
		header: "Unit Daily Rate",
		accessorKey: "unitDailyPrice",
		cell: ({ row }) => (
			<UnitDailyRateComponent
				row={row}
				type="service"
				option={row.original.unitDailyPrice.toString()}
			/>
		),
	},
	{
		header: "Sales Price",
		accessorKey: "salesPrice",
		cell: ({ row }) => (
			<SalesPriceComponent
				row={row}
				type="service"
				option={row.original.salesPrice.toString()}
			/>
		),
	},
	{
		header: "Actions",
		accessorKey: "_actions",
		cell: ({ row }) => (
			<ButtonAction<"service">
				row={row}
				title="Actions"
				type="service"
				summaryContent={row.original.summary}
			/>
		),
	},
];
