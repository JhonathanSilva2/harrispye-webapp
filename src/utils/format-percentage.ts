export const formatPercentage = (
	value: number,
	locale = "pt-BR",
	minimumFractionDigits = 2,
	maximumFractionDigits = 2,
) => {
	return new Intl.NumberFormat(locale, {
		style: "percent",
		minimumFractionDigits: minimumFractionDigits, // Define casas decimais
		maximumFractionDigits: maximumFractionDigits, // Define o máximo de casas decimais
	}).format(value / 100); // Divide por 100 porque a API já multiplica internamente
};
