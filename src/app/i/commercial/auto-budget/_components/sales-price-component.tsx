import { Input } from "@/components/ui/input";
import { NumericFormat } from "react-number-format";
import { useAutobudget } from "../_providers/autobudget-context";
import { BudgetTypes } from "../types";
import { BudgetComponentProps } from "./spec-component";

const SalesPriceComponent = <T extends BudgetTypes>({
	row,
	type,
	option,
}: BudgetComponentProps<T>) => {
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
					data: { salesPrice: floatValue || 0 },
				});
			}}
			allowNegative={false}
		/>
	);
};

export default SalesPriceComponent;
