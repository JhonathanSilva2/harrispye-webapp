import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { useAutobudget } from "../../_providers/autobudget-context";
import { BudgetTypes, RowData } from "../../types";
import BudgetTable from "../budget-table";
import { LooseMaterialColumns } from "./column-def";

const LooseMaterial = () => {
	const columns = useMemo(
		() =>
			LooseMaterialColumns as unknown as ColumnDef<
				RowData<BudgetTypes>
			>[],
		[],
	);

	const { state, dispatch } = useAutobudget();

	return (
		<BudgetTable
			title="Loose Material List"
			type="looseMaterial"
			state={state}
			columns={columns}
			dispatch={dispatch}
		/>
	);
};

export default LooseMaterial;
