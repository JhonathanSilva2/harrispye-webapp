import { Input } from "@/components/ui/input";
import { Row } from "@tanstack/react-table";
import { NumericFormat } from "react-number-format";
import { useAutobudget } from "../_providers/autobudget-context";
import { BudgetTypes, RowData } from "../types";

const NumJointsComponents = ({
	row,
}: {
	row: Row<RowData<"looseMaterial">>;
}) => {
	const { dispatch } = useAutobudget();
	return (
		<NumericFormat
			decimalSeparator=","
			thousandSeparator="."
			customInput={Input}
			decimalScale={0}
			fixedDecimalScale
			value={row.original.numJoints.toString()}
			onValueChange={(values) => {
				const { floatValue } = values;
				dispatch({
					type: "update-looseMaterial",
					id: row.original.id,
					data: { numJoints: floatValue || 0 },
				});
			}}
			allowNegative={false}
		/>
	);
};

const QuantityComponents = <T extends BudgetTypes>({
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
			decimalSeparator=","
			thousandSeparator="."
			customInput={Input}
			decimalScale={0}
			fixedDecimalScale
			value={value}
			onValueChange={(values) => {
				const { floatValue } = values;
				dispatch({
					type: `update-${type}`,
					id: row.original.id,
					data: { quantity: floatValue || 0 },
				});
			}}
			allowNegative={false}
		/>
	);
};

const DaysComponents = ({
	row,
	type,
	readOnly,
	value,
}: {
	row: Row<RowData<"service">>;
	type: "service";
	readOnly: boolean;
	value: string;
}) => {
	const { dispatch } = useAutobudget();
	return (
		<NumericFormat
			readOnly={readOnly}
			decimalSeparator=","
			thousandSeparator="."
			customInput={Input}
			decimalScale={0}
			fixedDecimalScale
			value={value}
			onValueChange={(values) => {
				const { floatValue } = values;
				dispatch({
					type: `update-${type}`,
					id: row.original.id,
					data: { days: floatValue || 0 },
				});
			}}
			allowNegative={false}
		/>
	);
};

export { DaysComponents, NumJointsComponents, QuantityComponents };
