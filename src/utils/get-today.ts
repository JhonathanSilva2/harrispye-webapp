export function formatDataHoje(): string {
	const hoje = new Date();
	const dia = String(hoje.getDate()).padStart(2, "0"); // Adiciona 0 à frente do dia, se necessário
	const mes = String(hoje.getMonth() + 1).padStart(2, "0"); // Meses começam do 0, então adiciona 1
	const ano = hoje.getFullYear();

	return `${dia}/${mes}/${ano}`;
}
