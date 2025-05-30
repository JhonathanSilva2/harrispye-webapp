import { Input } from "@/components/ui/input";
import { useAutobudget } from "../_providers/autobudget-context";
import { BudgetComponentProps } from "./spec-component";

const DescriptionComponent = ({
	row,
	type,
	option,
}: BudgetComponentProps<"service">) => {
	const { dispatch } = useAutobudget();
	return (
		<Input
			value={option}
			onChange={(e) => {
				const value = e.target.value;
				dispatch({
					type: `update-${type}`,
					id: row.original.id,
					data: { description: value },
				});
			}}
		/>
	);
};

export default DescriptionComponent;
