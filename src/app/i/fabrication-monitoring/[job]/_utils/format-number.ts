import { formatBrNumber } from "@/utils/brasil-format-number";
import { formatMoney } from "@/utils/format-currency";
import { formatPercentage } from "@/utils/format-percentage";

export const formatValue = (
    name: string,
    currentValue: string | number | null,
    typeValue: string,
) => {
    if (currentValue === null) return "N/A"; // Exibe N/A para valores nulos
    switch (typeValue) {
        case "text":
            return currentValue || "";

        case "number":
            if (name === "mass")
                return (formatBrNumber(Number(currentValue)) || "0") + " kg";
            return Number(currentValue) || 0;

        case "currency":
            return formatMoney(Number(currentValue)) || formatMoney(Number(0));
        case "percentage":
            return (
                formatPercentage(Number(currentValue), "pt-BR", 0, 0) ||
                formatPercentage(0, "pt-BR", 0, 0)
            );

        default:
            return currentValue;
    }
};
