import { Input } from "@/components/ui/input";
import { Row } from "@tanstack/react-table";
import { NumericFormat } from "react-number-format";
import { useAutobudget } from "../_providers/autobudget-context";
import { BudgetTypes, RowData } from "../types";

const WeightComponent = <T extends BudgetTypes>({
	row,
	type,
	value,
}: {
	row: Row<RowData<T>>;
	type: T;
	value: string;
}) => {
	const { dispatch } = useAutobudget();
	return (
		<NumericFormat
			thousandSeparator="."
			decimalSeparator=","
			suffix=" Kg"
			customInput={Input}
			decimalScale={2}
			fixedDecimalScale
			value={value}
			onValueChange={(values) => {
				const { floatValue } = values;
				dispatch({
					type: `update-${type}`,
					id: row.original.id,
					data: { weight: floatValue || 0 },
				});
			}}
			allowNegative={false}
		/>
	);
};

export default WeightComponent;
