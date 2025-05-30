export interface DetailedBudgetOutput {
	basePrice: number;
	salesPrice: number;
	grossMargin: number;
	revenue: number;
	taxAmount: number;
	taxPercent: number;
	netProfit: number;
	netMargin?: number;
}

/**
 * implementação do gross-up method
 * ref: https://www.investopedia.com/terms/g/gross-up.asp
 * ref: https://docs.google.com/spreadsheets/d/1OA8yImhFjGxIRmGMTSNG6fgkDaFghXzY/edit?usp=sharing&ouid=117182139145121733929&rtpof=true&sd=true
 * formula: basePrice/(1-percentual de lucro)/(1-percentual de impostos)
 * receita sendo: basePrice/(1-percentual de lucro)
 * 
 * @param {*} basePrice basePrice being price per kilogram * weight * quantity
 * @param {*} tax tax total percentage being a float between 0 and 100
 * @param {*} margin margin total percentage being a float between 25 and 100 
 * @returns {*} an object with those importante detailed values as properties => "basePrice": the base price inputted in the function; "salesPrice": the final output value with all the allowances; "grossMargin": the gross margin that was at the start of the calculation; "revenue": the tinal cost without taxes, what the company actually receives; "taxAmount": the value of the taxes; "taxPercent": the tax percentage; "netProfit": the actual profit after all the calculations is made (final tax amount - cost); "netMargin": the actual margin percentage that was made after all calculations;
 * @example {
        basePrice,
        salesPrice,
        grossMargin,
        revenue,
        taxAmount,
        taxPercent,
        netProfit,
        netMargin
    }
*/
export const calculateDetailedBudgetOutput = (
	basePrice: number,
	tax: number,
	margin: number,
): DetailedBudgetOutput => {
	if (margin <= 25) {
		margin = 25;
	} else if (margin >= 99) {
		margin = 99;
	}
	const taxPercent = tax / 100;
	const grossMargin = margin / 100;
	const grossMarginProportion = 1 - grossMargin;
	const revenue = basePrice / grossMarginProportion;
	const taxProportion = 1 - taxPercent;
	const salesPrice = revenue / taxProportion;

	const taxAmount = salesPrice * taxPercent;
	const netProfit = salesPrice - taxAmount - basePrice;

	// const netMargin = netProfit / cost // group decision is to make this not shown

	const detailedBudgetOutput = {
		basePrice,
		salesPrice,
		grossMargin,
		revenue,
		taxAmount,
		taxPercent,
		netProfit,
		// netMargin
	};

	return detailedBudgetOutput;
};
