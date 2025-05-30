"use client";

import { Label, Pie, PieChart, Sector } from "recharts";

import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { formatMoney } from "@/utils/format-currency";

interface PieChartComponentProps {
	title: string;
	description: string;
	moeda?: string;
	data?: {
		APPROVED: number;
		DECLINED: number;
		PENDING: number;
	};
	totalsDescription?: {
		label: string;
		value: string;
	};
}

interface TChartData {
	approval: string;
	n: number;
	fill: string;
}

export function PieChartApprovals({
	data,
	moeda,
	totalsDescription,
}: PieChartComponentProps) {
	const [chartData, setChartData] = useState<TChartData[]>([]);
	const handleChartData = (data: TChartData[]) => setChartData(data);
	const approvedSpools = useRef<number>(0);
	
	const chartConfig = {
		APPROVED: {
			label: "Approved",
			color: "hsl(var(--chart-2))",
		},
		DECLINED: {
			label: "Declined",
			color: "hsl(var(--chart-5))",
		},
		PENDING: {
			label: "Pending",
			color: "hsl(var(--chart-3))",
		},
	} satisfies ChartConfig;

	useEffect(() => {
		if (data) {
			const newData = Object.entries(data).map(([approval, n]) => ({
				approval,
				n,
				fill: `var(--color-${approval})`,
			}));
			handleChartData(newData);

			approvedSpools.current =
				newData.find(
					(approvalData) => approvalData.approval === "APPROVED",
				)?.n || 0;
		}
	}, [data]);

	return (
		<div className="flex flex-col ">
			<ChartContainer
				config={chartConfig}
				className="mx-auto aspect-square max-h-[350px] min-h-[300px] w-full"
			>

				<PieChart>
					<ChartTooltip
						cursor={false}
						content={<ChartTooltipContent hideLabel />}
					/>
					<Pie
						data={chartData}
						dataKey="n"
						nameKey="approval"
						innerRadius={60}
						strokeWidth={5}
						activeShape={({
							outerRadius = 0,
							...props
						}: PieSectorDataItem) => {
							return (
								<g>
									<Sector
										{...props}
										outerRadius={outerRadius + 5}
									/>
									<Sector
										{...props}
										outerRadius={outerRadius + 15}
										innerRadius={outerRadius + 7}
									/>
								</g>
							);
						}}
					>
						<Label
							content={({ viewBox }) => {
								if (
									viewBox &&
									"cx" in viewBox &&
									"cy" in viewBox
								) {
									return (
										<text
											x={viewBox.cx}
											y={viewBox.cy}
											textAnchor="middle"
											dominantBaseline="middle"
										>
											<tspan
												x={viewBox.cx}
												y={viewBox.cy}
												className={cn(
													"fill-foreground font-bold",
													moeda
														? "text-lg"
														: "text-3xl",
												)}
											>
												{moeda
													? formatMoney(
															approvedSpools.current,
														)
													: approvedSpools.current}
											</tspan>
											<tspan
												x={viewBox.cx}
												y={(viewBox.cy || 0) + 24}
												className="fill-muted-foreground"
											>
												Approved
											</tspan>
										</text>
									);
								}
							}}
						/>
					</Pie>
				</PieChart>
			</ChartContainer>
			<div className="flex items-center justify-center gap-2 font-medium leading-none">
				Total of {totalsDescription?.value || 0}{" "}
				{totalsDescription?.label || ""}{" "}
				{/* <TrendingUp className="h-4 w-4" /> */}
				
			</div>
		</div>
	);
}
