import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { useAutobudget } from "../../_providers/autobudget-context";
import { BudgetTypes, RowData } from "../../types";
import BudgetTable from "../budget-table";
import { ManualColumns } from "./column-def";

const Manual = () => {
	const columns = useMemo(
		() => ManualColumns as unknown as ColumnDef<RowData<BudgetTypes>>[],
		[],
	);

	const { state, dispatch } = useAutobudget();

	return (
		<BudgetTable
			title="Manual List"
			type="manual"
			state={state}
			columns={columns}
			dispatch={dispatch}
		/>
	);
};

export default Manual;
