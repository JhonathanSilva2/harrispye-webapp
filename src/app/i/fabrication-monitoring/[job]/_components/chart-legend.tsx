import { TooltipLegend } from "@/components/tool-tip-legend";

export function ChartLegend() {
	return (
		<TooltipLegend
			label=""
			payload={[
				{
					name: "Approved",
					value: 186,
					darkFill: "#5ad68a",
					fill: "#2A9C89",
				},
				{
					name: "Declined",
					value: 80,
					darkFill: "#d62467",
					fill: "#F2A458",
				},
				{
					name: "Pending",
					value: 80,
					darkFill: "#f97316",
					fill: "#1A3E46",
				},
			]}
		/>
	);
}
