// Função auxiliar para limpar e converter o valor para o formato numérico correto
const parseNumericValue = (value: string | number | null, type: string) => {
    if (value === null) return null;
    if (typeof value === "number") return value;
    if (type === "currency" || type === "percentage" || type === "number") {
        const cleanedValue = value
            .toString()
            .replace(/[^\d.,-]/g, "")
            .replace(",", ".");
        const parsed = parseFloat(cleanedValue);
        return isNaN(parsed) ? null : parsed;
    }
    return value;
};

export default parseNumericValue;
