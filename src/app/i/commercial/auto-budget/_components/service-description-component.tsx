import { Input } from "@/components/ui/input";
import { NumericFormat } from "react-number-format";
import { useAutobudget } from "../_providers/autobudget-context";
import { BudgetComponentProps } from "./spec-component";

interface DailyPriceComponentProps<T extends "service">
	extends BudgetComponentProps<T> {
	dailyPriceType: "dailyBasePrice" | "dailySalesPrice";
}

const DailyPriceComponent = <T extends "service">({
	row,
	type,
	dailyPriceType,
	option,
}: DailyPriceComponentProps<T>) => {
	const { dispatch } = useAutobudget();
	return (
		<NumericFormat
			thousandSeparator="."
			decimalSeparator=","
			prefix="R$ "
			customInput={Input}
			decimalScale={2}
			fixedDecimalScale
			value={option}
			onValueChange={(values) => {
				const { floatValue } = values;
				dispatch({
					type: `update-${type}`,
					id: row.original.id,
					data: { [dailyPriceType]: floatValue || 0 },
				});
			}}
			allowNegative={false}
		/>
	);
};

export default DailyPriceComponent;
