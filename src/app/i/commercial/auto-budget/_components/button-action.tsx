import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DetailedBudgetOutput } from "@/lib/autobudget/calculate-detailed-budget-output";
import { Row } from "@tanstack/react-table";
import {
	DollarSign,
	FileSpreadsheet,
	MoreHorizontal,
	Trash2,
} from "lucide-react";
import { useState } from "react";
import { useAutobudget } from "../_providers/autobudget-context";
import { BudgetBreakdown, BudgetTypes, RowData } from "../types";
import BreakdownDialog from "./breakdown-dialog";
import SummaryDialog from "./summary-dialog";

interface ButtonActionProps<T extends BudgetTypes> {
	row: Row<RowData<T>>;
	title: string;
	type: T;
	summaryContent?: DetailedBudgetOutput;
	breakdownContent?: BudgetBreakdown;
}
const ButtonAction = <T extends BudgetTypes>({
	row,
	title,
	type,
	summaryContent,
	breakdownContent,
}: ButtonActionProps<T>) => {
	const [isOpen, setIsOpen] = useState(false);
	const { dispatch } = useAutobudget();

	return (
		<DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
			<DropdownMenuTrigger asChild>
				<Button className="h-6" variant="ghost">
					<MoreHorizontal />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<DropdownMenuLabel className="text-center">
					{title}
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					{summaryContent && (
						<Dialog
							onOpenChange={(dialogOpen) => {
								if (!dialogOpen) {
									setIsOpen(false);
								}
							}}
						>
							<DialogTrigger asChild>
								<DropdownMenuItem
									onSelect={(e) => {
										e.preventDefault();
									}}
								>
									<DollarSign />
									<span>Summary</span>
								</DropdownMenuItem>
							</DialogTrigger>
							<SummaryDialog
								id={row.original.id}
								title={`Summary - ${title}`}
								description="Summary of the detailed budget output"
								detailedBudgetOutput={summaryContent}
							/>
						</Dialog>
					)}

					{breakdownContent ? (
						<Dialog
							onOpenChange={(dialogOpen) => {
								if (!dialogOpen) {
									setIsOpen(false);
								}
							}}
						>
							<DialogTrigger asChild>
								<DropdownMenuItem
									onSelect={(e) => e.preventDefault()}
								>
									<FileSpreadsheet />
									<span>Breakdown</span>
								</DropdownMenuItem>
							</DialogTrigger>
							<BreakdownDialog
								id={row.original.id}
								title={`Cost Breakdown - ${title}`}
								description="Detailed cost breakdown applied to base price"
								breakdown={breakdownContent}
								detailedBudgetOutput={summaryContent}
							/>
						</Dialog>
					) : null}

					<DropdownMenuSeparator className="my-1" />
					<DropdownMenuItem
						className="bg-red-950"
						onClick={() =>
							dispatch({
								type: `delete-${type}`,
								id: row.original.id,
							})
						}
					>
						<Trash2 />
						<span>Delete</span>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default ButtonAction;
