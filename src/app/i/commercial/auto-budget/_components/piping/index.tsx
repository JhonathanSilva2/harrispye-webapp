import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { useAutobudget } from "../../_providers/autobudget-context";
import { BudgetTypes, RowData } from "../../types";
import BudgetTable from "../budget-table";
import { PipingColumns } from "./column-def";

const Piping = () => {
	const columns = useMemo(
		() => PipingColumns as unknown as ColumnDef<RowData<BudgetTypes>>[],
		[],
	);

	const { state, dispatch } = useAutobudget();

	return (
		<BudgetTable
			title="Piping List"
			type="piping"
			state={state}
			columns={columns}
			dispatch={dispatch}
		/>
	);
};

export default Piping;
