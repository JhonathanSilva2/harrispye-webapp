import { SPECS } from "../_data/specs";
import { useAutobudget } from "../_providers/autobudget-context";
import { BudgetTypes } from "../types";
import { BudgetOptions } from "./budget-options";
import { BudgetComponentProps } from "./spec-component";

const DiameterComponent = <T extends BudgetTypes>({
	row,
	type,
	option,
}: BudgetComponentProps<T>) => {
	const { dispatch } = useAutobudget();
	const specValue = row.getValue("spec") as string;

	const diameters = SPECS[specValue as keyof typeof SPECS] || [];
	return (
		<BudgetOptions
			title={"Diameter"}
			options={Object.entries(diameters)
				.filter(([, e]) => typeof e !== "string")
				.map(([key]) => ({ label: key, value: key }))}
			value={option || ""}
			onSelect={(value) => {
				dispatch({
					type: `update-${type}`,
					id: row.original.id,
					data: { diameter: value },
				});
			}}
		/>
	);
};

export default DiameterComponent;
