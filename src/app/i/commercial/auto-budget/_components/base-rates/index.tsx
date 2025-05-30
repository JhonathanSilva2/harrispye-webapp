import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { FileCog, SquareMousePointer } from "lucide-react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { TRADE_RATES } from "../../_data/trade-rates";
import { useAutobudget } from "../../_providers/autobudget-context";

export function BaseRates() {
	const { state, dispatch } = useAutobudget();
	const [selectedTrades, setSelectedTrades] = useState<string[]>([]);
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" className="w-full">
					<FileCog />
				</Button>
			</DialogTrigger>
			<DialogContent className="max-h-dvh max-w-[425px] sm:max-w-fit">
				<DialogHeader>
					<DialogTitle className="text-start md:text-center">
						Base Rates
					</DialogTitle>
					<DialogDescription className="text-start md:text-center">
						Import base rates for the project. This will be pushed
						directly to Service Budget List
					</DialogDescription>
				</DialogHeader>
				<div className="max-h-[400px] overflow-auto lg:max-h-[600px]">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>
									<SquareMousePointer
										className="mx-1"
										size={15}
									/>
								</TableHead>
								<TableHead>Trade</TableHead>
								<TableHead>Unit / Daily Cost</TableHead>
								<TableHead>Calc Type</TableHead>
								<TableHead>Tax Amount</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{TRADE_RATES.map((trade) => {
								const taxAmount = Object.values(
									trade.taxes,
								).reduce((acc, tax) => acc + tax, 0);
								return (
									<TableRow key={trade.trade}>
										<TableCell className="p-0 text-center align-middle">
											<Checkbox
												className="p-0"
												checked={selectedTrades.includes(
													trade.trade,
												)}
												onCheckedChange={(
													isChecked: boolean,
												) => {
													setSelectedTrades((prev) =>
														isChecked
															? [
																	...prev,
																	trade.trade,
																]
															: prev.filter(
																	(item) =>
																		item !==
																		trade.trade,
																),
													);
												}}
											/>
										</TableCell>
										<TableCell>{trade.trade}</TableCell>
										<TableCell>R$ {trade.cost}</TableCell>
										<TableCell>
											{trade.type.toUpperCase()}
										</TableCell>
										<TableCell>{taxAmount}%</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</div>
				<DialogFooter>
					<Button
						type="button"
						onClick={() => {
							const selectedData = TRADE_RATES.filter((trade) =>
								selectedTrades.includes(trade.trade),
							);

							const updatedData = selectedData.map((trade) => {
								const id = uuidv4();
								dispatch({
									type: "add-service",
									id,
									data: {
										serviceType: "labour",
										calcType: "daily",
									},
								});
								return {
									...trade,
									id,
								};
							});
							updatedData.forEach((trade) => {
								dispatch({
									type: "update-service",
									id: trade.id,
									data: {
										description: trade.trade,
										dailySalesPrice: trade.cost,
										taxes: trade.taxes,
									},
								});
							});
							setSelectedTrades([]);
							setIsOpen(false);
						}}
					>
						Import To Service List
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
