import { Input } from "@/components/ui/input";
import { useAutobudget } from "../_providers/autobudget-context";
import { BudgetComponentProps } from "./spec-component";

const PartDescriptionComponent = ({
	row,
	type,
	option,
}: BudgetComponentProps<"manual">) => {
	const { dispatch } = useAutobudget();
	return (
		<Input
			value={option}
			onChange={(e) => {
				const value = e.target.value;
				dispatch({
					type: `update-${type}`,
					id: row.original.id,
					data: { partDescription: value },
				});
			}}
		/>
	);
};

export default PartDescriptionComponent;
