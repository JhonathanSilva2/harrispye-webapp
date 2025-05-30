import { toWords } from "number-to-words";

export const moneyToWords = (value: number): string => {
	const [integerPart, decimalPartRaw] = value.toFixed(2).split(".");
	const integerNumber = parseInt(integerPart, 10);
	const decimalNumber = parseInt(decimalPartRaw, 10);

	const realWord = integerNumber === 1 ? "real" : "reais";
	const centWord = decimalNumber === 1 ? "cent" : "cents";

	const integerInWords = toWords(integerNumber);
	const decimalInWords =
		decimalNumber > 0 ? ` and ${toWords(decimalNumber)} ${centWord}` : "";

	return `${integerInWords.charAt(0).toUpperCase() + integerInWords.slice(1)} ${realWord}${decimalInWords}`;
};
