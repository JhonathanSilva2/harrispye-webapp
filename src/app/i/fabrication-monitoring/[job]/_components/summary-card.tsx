import {
	FloatingInput,
	FloatingLabel,
} from "@/components/ui/floating-label-input";
interface SummaryCardProps {
	label: string;
	value: string | number | Date;
}

export function SummaryCard({ label, value }: SummaryCardProps) {
	return (
		<div className="relative w-auto">
			<FloatingInput
				id="floating-customize"
				value={
					typeof value === "object" && value instanceof Date
						? value.toISOString()
						: value
				}
				className="pointer-events-none text-left"
				readOnly
			/>
			<FloatingLabel htmlFor="floating-customize">{label}</FloatingLabel>
		</div>
	);
}
