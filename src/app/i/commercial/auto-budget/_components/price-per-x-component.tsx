import { Input } from "@/components/ui/input";
import { NumericFormat } from "react-number-format";
import { useAutobudget } from "../_providers/autobudget-context";
import { BudgetComponentProps } from "./spec-component";

const PricePerKgComponent = <T extends "piping" | "manual">({
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
					data: { pricePerKg: floatValue || 0 },
				});
			}}
			allowNegative={false}
		/>
	);
};

const PricePerJointComponent = ({
	row,
	type,
	option,
}: BudgetComponentProps<"looseMaterial">) => {
	const { dispatch } = useAutobudget();
	return (
		<NumericFormat
			thousandSeparator="."
			decimalSeparator=","
			customInput={Input}
			decimalScale={2}
			fixedDecimalScale
			value={option}
			onValueChange={(values) => {
				const { floatValue } = values;
				dispatch({
					type: `update-${type}`,
					id: row.original.id,
					data: { pricePerJoint: floatValue || 0 },
				});
			}}
			allowNegative={false}
		/>
	);
};

export { PricePerJointComponent, PricePerKgComponent };
