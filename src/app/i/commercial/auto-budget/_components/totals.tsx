import { delivery_list } from "@/app/api/commercial/generate-job-number/type";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { clientEnv } from "@/lib/constants/config";
import { LoaderCircle, SendHorizontal } from "lucide-react";
import { memo, useState } from "react";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";
import { useEnquiryData } from "../_hooks/use-enquiry-data";
import { useAutobudget } from "../_providers/autobudget-context";
import { CommercialCompiledDAta } from "../types";
import { BaseRates } from "./base-rates";
import { DeliveryDates } from "./delivery-dates";
import { deliveryDatesInputData } from "./delivery-dates/inputData";

const DivTotalsColumn = memo(function DivTotalsColumn({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex h-full w-full items-center justify-between gap-2 md:w-fit md:flex-col">
			{children}
		</div>
	);
});

const TotalTitle = memo(function TotalTitle({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<Label className="w-full text-start font-bold md:text-center">
			{children}
		</Label>
	);
});

const Totals = () => {
	const { formData } = useEnquiryData();

	const { state, dispatch } = useAutobudget();
	const [isLoading, setIsLoading] = useState(false);
	const [values, setValues] = useState<delivery_list>(
		deliveryDatesInputData.reduce((acc: delivery_list, { name }) => {
			// Garantir que name é uma chave válida de delivery_list
			acc[name as keyof delivery_list] = 0; // Inicializa com 0

			return acc;
		}, {} as delivery_list),
	);

	const [openDeliveryDates, setOpenDeliveryDates] = useState(false);

	const submitProposal = async () => {
		setIsLoading(true);
		const commercialCompiledData = {} as CommercialCompiledDAta;
		if (!formData) return;
		const isAnyDeliveryDateFilled = Object.values(values).some(
			(value) => value !== 0,
		);
		const isAllBudgetsEmpty = () => {
			return (
				state.looseMaterial.length === 0 &&
				state.manual.length === 0 &&
				state.piping.length === 0 &&
				state.service.length === 0
			);
		};

		if (isAllBudgetsEmpty()) {
			toast.error("Error", {
				description: "At least one Budget List must be filled.",
				duration: 4000,
			});
			setIsLoading(false);
			return;
		}

		if (!isAnyDeliveryDateFilled) {
			setOpenDeliveryDates(true);
			toast.error("Error", {
				description: "Delivery Date must be filled.",
				duration: 4000,
			});
			setIsLoading(false);
			return;
			// clicar no botão generate proposal
		}

		// gerado por api
		const acronym_number = "AV-0001";
		const created_by = "tantoFaz";
		// Pegar o ERF no localStorage.
		// Pegar o created_by

		const erfData = {
			created_by,
			acronym_number,
			...formData,
		};

		// // Pegar os dados do AutoBudget
		commercialCompiledData.budgetData = state;
		commercialCompiledData.deliveryDates = values;
		commercialCompiledData.erfData = erfData;
		// Gerar Proposta
		// http://localhost:3000/api/generate-proposal
		// body:commercialCompiledDAta
		try {
			const response = await fetch(
				`${clientEnv.NEXT_PUBLIC_URL}/api/commercial/generate-job-number`,
				{
					method: "POST",
					body: JSON.stringify(commercialCompiledData),
				},
			);

			if (!response.ok) {
				throw new Error(
					`Erro ao gerar proposta: ${response.statusText}`,
				);
			}

			const blob = await response.blob();

			// Use filename from `Content-Disposition` header
			const disposition = response.headers.get("Content-Disposition");
			const match = disposition?.match(/filename="(.+)"/);
			const filename = match?.[1] ?? "downloaded-file";

			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = filename;
			a.click();
			URL.revokeObjectURL(url);
		} catch (error) {
			toast.error("Error", {
				description: "Failed to generate proposal.",
				duration: 4000,
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="sticky bottom-0 left-0 right-0 z-10 flex w-full items-center justify-center shadow-md">
			<Card className="mb-2 p-4 text-center">
				<CardContent className="px-2 py-1">
					<div className="flex flex-col items-center justify-center gap-1 md:flex-row md:gap-4">
						<DivTotalsColumn>
							<TotalTitle>BASE RATES</TotalTitle>
							<BaseRates />
						</DivTotalsColumn>
						<DivTotalsColumn>
							<TotalTitle>DELIVERY DATES</TotalTitle>
							<DeliveryDates
								values={values}
								setValues={setValues}
								shouldOpen={openDeliveryDates}
								setShouldOpen={setOpenDeliveryDates}
							/>
						</DivTotalsColumn>
						<DivTotalsColumn>
							<TotalTitle>MARGIN</TotalTitle>
							<NumericFormat
								className="w-full px-4 py-2 text-end"
								thousandSeparator="."
								decimalSeparator=","
								suffix="%"
								customInput={Input}
								decimalScale={0}
								fixedDecimalScale
								value={state.totals.margin}
								onValueChange={(values) => {
									const { floatValue } = values;
									dispatch({
										type: `update-totals`,
										id: "a",
										totals: {
											margin: floatValue || 0,
										},
									});
								}}
								allowNegative={false}
							/>
						</DivTotalsColumn>
						<DivTotalsColumn>
							<TotalTitle>TOTAL REVENUE </TotalTitle>
							<NumericFormat
								className="w-full px-4 py-2 text-end"
								readOnly
								thousandSeparator="."
								decimalSeparator=","
								prefix="R$ "
								customInput={Input}
								decimalScale={2}
								fixedDecimalScale
								value={state.totals.totalRevenue}
								allowNegative={false}
							/>
						</DivTotalsColumn>
						<DivTotalsColumn>
							<TotalTitle>TOTAL SALES</TotalTitle>
							<NumericFormat
								className="w-full px-4 py-2 text-end"
								readOnly
								thousandSeparator="."
								decimalSeparator=","
								prefix="R$ "
								customInput={Input}
								decimalScale={2}
								fixedDecimalScale
								value={state.totals.totalSales}
								allowNegative={false}
							/>
						</DivTotalsColumn>
						<DivTotalsColumn>
							<TotalTitle>GENERATE PROPOSAL</TotalTitle>

							{isLoading ? (
								<Button
									variant={"ghost"}
									className="w-full"
									disabled
								>
									<LoaderCircle className="animate-spin" />
								</Button>
							) : (
								<Button
									variant={"constructive"}
									className="w-full"
									onClick={submitProposal}
								>
									<SendHorizontal />
								</Button>
							)}
						</DivTotalsColumn>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default Totals;
