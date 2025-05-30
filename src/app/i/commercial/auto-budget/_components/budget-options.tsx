"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function BudgetOptions({
	options,
	title,
	value,
	onSelect,
}: {
	options: { label: string; value: string }[];
	title: string;
	value: string;
	onSelect: (e: string) => void;
}) {
	const [open, setOpen] = React.useState(false);
	const valueRef = React.useRef(value || "");

	const getCurrentLabel = () => {
		return valueRef.current
			? options.find((option) => option.value === valueRef.current)?.label
			: `Select ${title}...`;
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-fit justify-between"
				>
					{getCurrentLabel()}
					<ChevronsUpDown className="opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-fit p-0">
				<Command>
					<CommandInput
						placeholder={`Search ${title}...`}
						className="h-9"
					/>
					<CommandList>
						<CommandEmpty>No {title} found.</CommandEmpty>
						<CommandGroup>
							{options.map((option) => (
								<CommandItem
									key={option.value}
									value={option.value}
									onSelect={(currentValue) => {
										valueRef.current =
											currentValue === valueRef.current
												? ""
												: currentValue;
										onSelect(currentValue);
										setOpen(false);
									}}
								>
									{option.label}
									<Check
										className={cn(
											"ml-auto",
											valueRef.current === option.value
												? "opacity-100"
												: "opacity-0",
										)}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
