import { delivery_list } from "@/app/api/commercial/generate-job-number/type";
import { DetailedBudgetOutput } from "@/lib/autobudget/calculate-detailed-budget-output";
import { EnquiryRequestFormData } from "@/schemas/erf";

export interface erfData
	extends Omit<
		EnquiryRequestFormData,
		| "estimated_quote_date"
		| "expected_start_date"
		| "received_date"
		| "enquiry_source"
		| "avantis_station"
		| "avantis_services"
	> {
	created_by: string;
	acronym_number: string;
	estimated_quote_date: string;
	expected_start_date: string;
	received_date: string;
	enquiry_source: string;
	avantis_station: string;
	avantis_services: string;
}
export interface CommercialCompiledDAta {
	erfData: EnquiryRequestFormData;
	deliveryDates: delivery_list;
	budgetData: AutobudgetOuterStateType;
}
export interface AutobudgetStateType {
	piping: RowData<"piping">[];
	looseMaterial: RowData<"looseMaterial">[];
	manual: RowData<"manual">[];
	service: RowData<"service">[];
}

export interface AutobudgetOuterStateType extends AutobudgetStateType {
	totals: TotalsType;
}

export interface TotalsType {
	margin: number;
	totalRevenue: number;
	totalSales: number;
}

export type BudgetBreakdown = {
	TYPE: string;
	CLASS: number | string;
	LABOUR: number;
	MATERIALS: number;
	CONSUMBALES: number;
	"ROAD FREIGHT": number;
	"INDIRECT COST": number;
	"FOOD ALLOWANCES": number;
	"OTHER DIRECT COST": number;
	"EXTERNAL PLANT HIRE": number;
	"INSPEC TESTING TREAT": number;
};

export type RowData<T extends BudgetTypes> = {
	id: string;
	basePrice: number;
	revenue: number;
	salesPrice: number;
	taxes?: {
		"pis/cofins"?: number;
		icms?: number;
		ipi?: number;
		iss?: number;
	};
	summary?: DetailedBudgetOutput;
} & (T extends "piping"
	? {
			spec: string;
			diameter: string;
			ncm: string;
			pricePerKg: number;
			weight: number;
			breakdown?: BudgetBreakdown;
		}
	: T extends "looseMaterial"
		? {
				spec: string;
				diameter: string;
				ncm: string;
				pricePerJoint: number;
				numJoints: number;
				breakdown?: BudgetBreakdown;
			}
		: T extends "manual"
			? {
					quantity: number;
					partDescription: string;
					ncm: string;
					pricePerKg: number;
					weight: number;
					breakdown?: BudgetBreakdown;
				}
			: {
					quantity: number;
					description: string;
					serviceType: "labour" | "rental";
					calcType: "daily" | "unit";
					dailyBasePrice: number;
					dailySalesPrice: number;
					days: number;
					unitDailyPrice: number;
				});

export type AutobudgetStateTypes = Partial<RowData<BudgetTypes>>;
export type BudgetActionTypes = "add" | "update" | "delete";
export type BudgetTypes = "piping" | "looseMaterial" | "manual" | "service";
export type BudgetOuterTypes = BudgetTypes | "totals";
export type AutobudgetReducerActions = {
	type: `${BudgetActionTypes}-${BudgetOuterTypes}`;
	id: string;
	data?: Partial<RowData<BudgetTypes>>;
	totals?: Partial<TotalsType>;
};
