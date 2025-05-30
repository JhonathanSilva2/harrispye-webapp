"use client";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
export function TooltipLegend({
	indicator = "dot",
	label,
	payload,
	hideLabel,
	hideIndicator,
	className,
}: {
	label: string;
	hideLabel?: boolean;
	hideIndicator?: boolean;
	indicator?: "line" | "dot" | "dashed";
	payload: {
		name: string;
		value: number;
		fill: string;
		darkFill: string;
	}[];
	nameKey?: string;
	labelKey?: string;
} & React.ComponentProps<"div">) {
	const { theme } = useTheme();
	const tooltipLabel = hideLabel ? null : (
		<div className="font-medium">{label}</div>
	);

	if (!payload?.length) {
		return null;
	}

	const nestLabel = payload.length === 1 && indicator !== "dot";

	return (
		<div
			className={cn(
				"grid h-fit min-w-[8rem] items-start gap-1.5 rounded-lg bg-background px-2.5 py-1.5 text-xs transition-all ease-in-out hover:-translate-y-0.5",
				className,
			)}
		>
			{!nestLabel ? tooltipLabel : null}
			<div className="grid justify-center gap-2 py-2">
				{payload.map((item, index) => {
					const currentColor =
						theme === "dark" ? item.darkFill : item.fill;

					return (
						<div
							key={index}
							className={cn(
								"flex w-full items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
								indicator === "dot" && "items-center",
							)}
						>
							<>
								{!hideIndicator && (
									<div
										className={cn(
											`shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]`,
											{
												"h-2.5 w-2.5":
													indicator === "dot",
												"w-1": indicator === "line",
												"w-0 border-[1.5px] border-dashed bg-transparent":
													indicator === "dashed",
												"my-0.5":
													nestLabel &&
													indicator === "dashed",
											},
										)}
										style={
											{
												"--color-bg": currentColor,
												"--color-border": currentColor,
											} as React.CSSProperties
										}
									/>
								)}
								<div
									className={cn(
										"flex flex-1 justify-between leading-none",
										nestLabel
											? "items-end"
											: "items-center",
									)}
								>
									<div className="grid gap-1.5">
										{nestLabel ? tooltipLabel : null}
										<span className="text-muted-foreground">
											{item.name}
										</span>
									</div>
								</div>
							</>
						</div>
					);
				})}
			</div>
		</div>
	);
}
