export function addDays(data: string, dias: number) {
	const novaData = new Date(data);
	novaData.setDate(novaData.getDate() + dias);
	return novaData;
}
