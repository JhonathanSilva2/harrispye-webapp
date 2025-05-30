export default function calculateTaxes(taxes: { [key: string]: number }) {
	let taxAmount = 0;

	const taxKeys = Object.keys(taxes);
	const taxValues = Object.values(taxes);
	taxKeys.forEach((key) => {
		const taxRate = taxValues[taxKeys.indexOf(key)];
		taxAmount += taxRate;
	});

	return taxAmount;
}
