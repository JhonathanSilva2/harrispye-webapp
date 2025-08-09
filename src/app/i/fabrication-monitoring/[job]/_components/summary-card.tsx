import {
    FloatingInput,
    FloatingLabel,
} from "@/components/ui/floating-label-input";
import { formatBrNumber } from "@/utils/brasil-format-number";
import { formatMoney } from "@/utils/format-currency";
interface SummaryCardProps {
    label: string;
    value: string | number | Date;
    defineFormatType?: "text" | "currency" | "date" | "mass" | "percentage";
}

export function SummaryCard({
    label,
    value,
    defineFormatType,
}: SummaryCardProps) {
    const displayValue = () => {
        if (typeof value === "object" && value instanceof Date) {
            return value.toLocaleDateString();
        }
        if (defineFormatType === "currency") {
            return formatMoney(value as number);
        }
        if (defineFormatType === "percentage") {
            return `${value as number}%`;
        }
        if (defineFormatType === "mass") {
            // formatar tipo de numeração para decimal e ponto para br

            return `${formatBrNumber(Number(value))} kg`; // Assuming value is in kg, adjust as necessary
        }
        return value;
    };
    return (
        <div className="relative w-auto">
            <FloatingInput
                id="floating-customize"
                value={displayValue() || ""}
                className="pointer-events-none text-left"
                readOnly
            />
            <FloatingLabel htmlFor="floating-customize">{label}</FloatingLabel>
        </div>
    );
}
