import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { useAutobudget } from "../../_providers/autobudget-context";
import { BudgetTypes, RowData } from "../../types";
import BudgetTable from "../budget-table";
import { serviceColumns } from "./column-def";

const Service = ({ className }: { className?: string }) => {
	const columns = useMemo(
		() => serviceColumns as unknown as ColumnDef<RowData<BudgetTypes>>[],
		[],
	);

	const { state, dispatch } = useAutobudget();

	return (
		<BudgetTable
			title="Service List"
			type="service"
			state={state}
			columns={columns}
			className={className}
			dispatch={dispatch}
		/>
	);
};

export default Service;
