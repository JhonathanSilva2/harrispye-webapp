import { calculateDetailedBudgetOutput } from "@/lib/autobudget/calculate-detailed-budget-output";
import calculateTaxes from "@/lib/autobudget/calculate-taxes";
import { AutoBudgetInitialRowState } from "@/lib/constants/autobudget";
import { toast } from "sonner";
import { BREAKDOWN_LIST } from "../_data/breakdown-list";
import { SPEC_TAXES } from "../_data/spec-taxes";
import { SPECS } from "../_data/specs";
import {
	AutobudgetOuterStateType,
	AutobudgetStateType,
	BudgetBreakdown,
	BudgetTypes,
	RowData,
} from "../types";

function calculateTotals(state: AutobudgetOuterStateType) {
	const totals = {
		totalRevenue: 0,
		totalSales: 0,
	};
	const budgetTypes = ["piping", "looseMaterial", "manual", "service"];
	budgetTypes.forEach((key) => {
		const list = state[key as keyof AutobudgetStateType];
		list.forEach((row) => {
			if (row.summary) {
				totals.totalRevenue += row.summary.revenue;
				totals.totalSales += row.summary.salesPrice;
			}
		});
	});
	return totals;
}

function getPricePerX(spec: string, diameter: string): number | null {
	const specData = SPECS[spec as keyof typeof SPECS];
	if (!specData) {
		toast.error(`Spec ${spec} not found`);
		return null;
	}
	const pricePerX = specData[diameter as keyof typeof specData] || null;
	if (typeof pricePerX === "number") {
		return pricePerX;
	}
	return null;
}

function getPriceBreakdown(row: RowData<"piping" | "looseMaterial">) {
	const breakdown = BREAKDOWN_LIST[row.spec as keyof typeof BREAKDOWN_LIST];
	if (!breakdown) {
		toast.error(`Breakdown for ${row.spec} not found`);
		return row;
	}
	row.breakdown = { ...breakdown };
	const type = breakdown.TYPE;

	const taxesData = Object.values(SPEC_TAXES).find(
		(taxes) => taxes.type === type,
	);
	if (!taxesData) {
		toast.error(`Taxes from ${row.spec} not found`);
		return row;
	} else {
		const taxKeys = ["pis/cofins", "icms", "ipi", "iss"];
		const taxes: {
			[key: string]: number;
		} = {};

		taxKeys.forEach((key) => {
			const Key = key as keyof typeof taxesData;
			if (taxesData[Key]) {
				taxes[key] = parseFloat(taxesData[Key]);
			}
		});

		row.ncm = taxesData.ncm;
		row.taxes = taxes;
	}
	return row;
}

function getManualPriceBreakdown(row: RowData<"manual">) {
	const ncm = row.ncm;
	if (!ncm) {
		toast.error(`NCM for ${row.partDescription} not found`);
		return null;
	}

	const taxesData = SPEC_TAXES[ncm as keyof typeof SPEC_TAXES];
	if (!taxesData) {
		toast.error(`Taxes from ${row.partDescription} not found`);
		return row;
	}
	const taxes = {
		"pis/cofins": parseFloat(taxesData["pis/cofins"]),
		icms: parseFloat(taxesData.icms),
		ipi: parseFloat(taxesData.ipi),
	};
	const partType = taxesData.type;
	const breakdown = Object.values(BREAKDOWN_LIST).find(
		(breakdown) => breakdown.TYPE === partType,
	);
	row.breakdown = {
		...breakdown,
	} as BudgetBreakdown;
	row.taxes = {
		...taxes,
	};
	return row;
}

const calculateServiceBasePrice = (
	salesPrice: number,
	tax: number,
	margin: number,
) => {
	const taxPercent = tax / 100;
	const marginPercent = margin / 100;
	return salesPrice * (1 - taxPercent) * (1 - marginPercent);
};

const calculateServiceSalesPrice = (
	basePrice: number,
	tax: number,
	margin: number,
) => {
	const taxPercent = tax / 100;
	const marginPercent = margin / 100;
	return basePrice / (1 - taxPercent) / (1 - marginPercent);
};

const budgetCoreCalc = <T extends BudgetTypes>({
	row,
	type,
	changes,
	margin,
}: {
	row: RowData<T>;
	type: T;
	changes: Partial<RowData<T>>;
	margin: number;
}) => {
	row = {
		...row,
		...changes,
	};

	switch (type) {
		case "piping":
			const pipingRow = row as RowData<"piping">;
			const pipingChanges = changes as Partial<RowData<"piping">>;

			if (
				Boolean(pipingChanges.spec || pipingChanges.diameter) &&
				pipingRow.spec &&
				pipingRow.diameter
			) {
				const pricePerKg = getPricePerX(
					pipingRow.spec,
					pipingRow.diameter,
				);
				if (pricePerKg !== null) {
					pipingRow.pricePerKg = pricePerKg;
				}
			}

			if (pipingChanges.spec) {
				const breakdownRow = getPriceBreakdown(pipingRow);
				if (breakdownRow) {
					pipingRow.breakdown = breakdownRow.breakdown;
					pipingRow.ncm = breakdownRow.ncm;
					pipingRow.taxes = breakdownRow.taxes;
				}
			}
			pipingRow.basePrice = pipingRow.pricePerKg * pipingRow.weight;
			const pipingDetailedOutput = calculateDetailedBudgetOutput(
				pipingRow.basePrice,
				calculateTaxes(pipingRow.taxes || {}),
				margin,
			);
			pipingRow.summary = pipingDetailedOutput;
			pipingRow.revenue = pipingDetailedOutput.revenue;
			pipingRow.salesPrice = pipingDetailedOutput.salesPrice;

			return {
				...row,
				...pipingRow,
			};
		case "looseMaterial":
			const looseMaterialRow = row as RowData<"looseMaterial">;
			const looseMaterialChanges = changes as Partial<
				RowData<"looseMaterial">
			>;
			if (
				Boolean(
					looseMaterialChanges.spec || looseMaterialChanges.diameter,
				) &&
				Boolean(looseMaterialRow.spec) &&
				Boolean(looseMaterialRow.diameter)
			) {
				const pricePerJoint = getPricePerX(
					looseMaterialRow.spec,
					looseMaterialRow.diameter,
				);
				if (pricePerJoint !== null) {
					looseMaterialRow.pricePerJoint = pricePerJoint;
				}
			}
			if (looseMaterialChanges.spec) {
				const breakdownRow = getPriceBreakdown(looseMaterialRow);
				if (breakdownRow) {
					looseMaterialRow.breakdown = breakdownRow.breakdown;
					looseMaterialRow.ncm = breakdownRow.ncm;
					looseMaterialRow.taxes = breakdownRow.taxes;
				}
			}
			looseMaterialRow.basePrice =
				looseMaterialRow.pricePerJoint * looseMaterialRow.numJoints;
			const looseMaterialDetailedOutput = calculateDetailedBudgetOutput(
				looseMaterialRow.basePrice,
				calculateTaxes(looseMaterialRow.taxes || {}),
				margin,
			);
			looseMaterialRow.summary = looseMaterialDetailedOutput;
			looseMaterialRow.revenue = looseMaterialDetailedOutput.revenue;
			looseMaterialRow.salesPrice =
				looseMaterialDetailedOutput.salesPrice;

			return {
				...row,
				...looseMaterialRow,
			};
		case "manual":
			const manualRow = row as RowData<"manual">;
			const manualChanges = changes as Partial<RowData<"manual">>;

			if (manualChanges.ncm) {
				const breakdownRow = getManualPriceBreakdown(manualRow);
				if (breakdownRow) {
					manualRow.breakdown = breakdownRow.breakdown;
					manualRow.taxes = breakdownRow.taxes;
				}
			}

			manualRow.basePrice =
				manualRow.pricePerKg * manualRow.weight * manualRow.quantity;
			const manualDetailedOutput = calculateDetailedBudgetOutput(
				manualRow.basePrice,
				calculateTaxes(manualRow.taxes || {}),
				margin,
			);
			manualRow.summary = manualDetailedOutput;
			manualRow.revenue = manualDetailedOutput.revenue;
			manualRow.salesPrice = manualDetailedOutput.salesPrice;

			return {
				...row,
				...manualRow,
			};
		case "service":
			const serviceRow = row as RowData<"service">;
			const serviceChanges = changes as Partial<RowData<"service">>;

			if (serviceChanges.serviceType) {
				serviceRow.taxes =
					serviceRow.serviceType === "labour"
						? {
								iss: 3.75,
								"pis/cofins": 9.25,
							}
						: {
								"pis/cofins": 9.25,
							};
			}

			if (serviceChanges.calcType === "unit") {
				serviceRow.days = 1;
			}

			if (serviceChanges.dailyBasePrice) {
				const dailySalesPrice = calculateServiceSalesPrice(
					serviceRow.dailyBasePrice,
					calculateTaxes(serviceRow.taxes || {}),
					margin,
				);
				serviceRow.dailySalesPrice = dailySalesPrice;
			}

			if (serviceChanges.dailySalesPrice) {
				const dailyBasePrice = calculateServiceBasePrice(
					serviceRow.dailySalesPrice,
					calculateTaxes(serviceRow.taxes || {}),
					margin,
				);
				serviceRow.dailyBasePrice = dailyBasePrice;
			}

			serviceRow.unitDailyPrice =
				serviceRow.dailySalesPrice * serviceRow.quantity;

			const basePrice =
				serviceRow.quantity *
				(serviceRow.days || 1) *
				serviceRow.dailyBasePrice;
			const serviceDetailedOutput = calculateDetailedBudgetOutput(
				basePrice,
				calculateTaxes(serviceRow.taxes || {}),
				margin,
			);

			serviceRow.summary = serviceDetailedOutput;
			serviceRow.basePrice = basePrice;
			serviceRow.revenue = serviceDetailedOutput.revenue;
			serviceRow.salesPrice = serviceDetailedOutput.salesPrice;

			return {
				...row,
				...serviceRow,
			};
		default:
			return row;
	}
};

export const budgetActions = {
	add: <T extends BudgetTypes>(
		id: string,
		type: T,
		state: AutobudgetOuterStateType,
		data: Partial<RowData<T>> = {},
	): Pick<AutobudgetOuterStateType, T> => {
		const list = state[type] as unknown as RowData<T>[];
		const templateRow =
			list.length > 0
				? list[list.length - 1]
				: AutoBudgetInitialRowState[type];

		const newRow: RowData<T> = {
			...(templateRow as RowData<T>),
			id,
			description: "",
			...(data as Partial<RowData<T>>),
		};

		return {
			[type]: [...list, newRow],
		} as unknown as Pick<AutobudgetOuterStateType, T>;
	},
	update: (
		id: string,
		type: BudgetTypes,
		state: AutobudgetOuterStateType,
		data: Partial<RowData<BudgetTypes>>,
	) => {
		const list = state[type];

		const oldRow = list.find((row) => row.id === id);
		if (!oldRow) {
			console.log(`Row ${id} not found`);
			return {
				...state,
				[`${type}`]: list,
			};
		}
		const newRow = budgetCoreCalc({
			row: oldRow,
			type,
			changes: data,
			margin: state.totals.margin,
		});

		const newPipingRow = {
			...oldRow,
			...newRow,
		};

		const newState = {
			...state,
			[`${type}`]: list.map((row) =>
				row.id === id ? newPipingRow : row,
			),
		};

		const totals = calculateTotals(newState);

		return {
			...newState,
			totals: {
				...newState.totals,
				...totals,
			},
		};
	},
	delete: (id: string, type: BudgetTypes, state: AutobudgetStateType) => {
		return {
			...state,
			[`${type}`]: state[type].filter((row) => row.id !== id),
		};
	},
};
