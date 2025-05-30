import { Row } from "@tanstack/react-table";
import { SPECS } from "../_data/specs";
import { useAutobudget } from "../_providers/autobudget-context";
import { BudgetTypes, RowData } from "../types";
import { BudgetOptions } from "./budget-options";

export type BudgetComponentProps<T extends BudgetTypes> = {
	row: Row<RowData<T>>;
	type: T;
	option?: string;
};

const SpecComponent = <T extends BudgetTypes>({
	row,
	type,
	option,
}: BudgetComponentProps<T>) => {
	const { dispatch } = useAutobudget();
	return (
		<BudgetOptions
			title="Spec"
			options={Object.keys(SPECS).map((e) => ({
				label: e,
				value: e,
			}))}
			value={option || ""}
			onSelect={(value) => {
				dispatch({
					type: `update-${type}`,
					id: row.original.id,
					data: { spec: value },
				});
			}}
		/>
	);
};

export default SpecComponent;
