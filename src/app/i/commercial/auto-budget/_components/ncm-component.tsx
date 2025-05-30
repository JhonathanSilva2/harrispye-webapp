import { SPEC_TAXES } from "../_data/spec-taxes";
import { useAutobudget } from "../_providers/autobudget-context";
import { BudgetTypes } from "../types";
import { BudgetOptions } from "./budget-options";
import { BudgetComponentProps } from "./spec-component";

const NCMComponent = <T extends BudgetTypes>({
	row,
	type,
	option,
}: BudgetComponentProps<T>) => {
	const { dispatch } = useAutobudget();
	return (
		<BudgetOptions
			title={"NCM"}
			options={Object.keys(SPEC_TAXES).map((e) => {
				return { label: e, value: e };
			})}
			value={option || ""}
			onSelect={(value) => {
				dispatch({
					type: `update-${type}`,
					id: row.original.id,
					data: { ncm: value },
				});
			}}
		/>
	);
};

export default NCMComponent;
