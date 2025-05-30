export function capitalizeWords(words: string) {
	return words
		.split(" ") // Divide a string em palavras
		.map(
			(word: string) =>
				word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
		) // Capitaliza a primeira letra de cada palavra
		.join(" "); // Junta as palavras de volta em uma string
}
