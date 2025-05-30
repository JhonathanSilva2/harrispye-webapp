import { CloudCog } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { DetailedBudgetOutput } from "@/lib/autobudget/calculate-detailed-budget-output";

interface SummaryDialogProps {
	id: string;
	className?: string;
	title?: string;
	description?: string;
	detailedBudgetOutput?: DetailedBudgetOutput;
}

const percentTransform = (value: number) => {
	const percentCalculation = value * 100;
	return `${percentCalculation.toFixed(2)}%`;
};

const currencyTransform = (value: number) => {
	const currencyCalculation = value.toLocaleString("pt-BR", {
		style: "currency",
		currency: "BRL",
	});
	return currencyCalculation;
};

export default function SummaryDialog({
	id,
	className,
	title,
	description,
	detailedBudgetOutput,
}: SummaryDialogProps) {
	return (
		<DialogContent className={`max-w-fit ${className || ""}`}>
			<DialogHeader>
				<DialogTitle>{title || "Summary"}</DialogTitle>
				{description ? (
					<DialogDescription>{description}</DialogDescription>
				) : null}
			</DialogHeader>
			<div className="flex items-center justify-center space-x-2">
				{detailedBudgetOutput ? (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Amount</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							<TableRow>
								<TableCell>Base Price</TableCell>
								<TableCell>
									{currencyTransform(
										detailedBudgetOutput.basePrice,
									)}
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Gross Margin</TableCell>
								<TableCell>
									{percentTransform(
										detailedBudgetOutput.grossMargin,
									)}
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Net Profit</TableCell>
								<TableCell>
									{currencyTransform(
										detailedBudgetOutput.netProfit,
									)}
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Revenue</TableCell>
								<TableCell>
									{currencyTransform(
										detailedBudgetOutput.revenue,
									)}
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Sales Price</TableCell>
								<TableCell>
									{currencyTransform(
										detailedBudgetOutput.salesPrice,
									)}
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Tax Amount</TableCell>
								<TableCell>
									{currencyTransform(
										detailedBudgetOutput.taxAmount,
									)}
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Tax Percent</TableCell>
								<TableCell>
									{percentTransform(
										detailedBudgetOutput.taxPercent,
									)}
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				) : (
					<div className="flex items-center justify-center gap-2">
						<CloudCog /> Please fill the row to see the summary
					</div>
				)}
			</div>
			<DialogFooter className="sm:justify-start">
				<DialogClose asChild>
					<Button type="button" variant="secondary">
						Close
					</Button>
				</DialogClose>
			</DialogFooter>
		</DialogContent>
	);
}
