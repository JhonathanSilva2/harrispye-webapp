import { useAutobudget } from "../_providers/autobudget-context";
import { BudgetTypes } from "../types";
import { BudgetOptions } from "./budget-options";
import { BudgetComponentProps } from "./spec-component";

const ServiceTypeComponent = <T extends BudgetTypes>({
	row,
	type,
	option,
}: BudgetComponentProps<T>) => {
	const { dispatch } = useAutobudget();

	return (
		<BudgetOptions
			title={"Calc Type"}
			options={[
				{ label: "Labour", value: "labour" },
				{ label: "Rental", value: "rental" },
			]}
			value={option || ""}
			onSelect={(value) => {
				console.log(value);
				dispatch({
					type: `update-${type}`,
					id: row.original.id,
					data: {
						serviceType: value as "labour" | "rental" | undefined,
					},
				});
			}}
		/>
	);
};

export default ServiceTypeComponent;
