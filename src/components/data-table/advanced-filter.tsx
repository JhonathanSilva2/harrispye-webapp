"use client";

import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { Filter, FilterX, X } from "lucide-react";
import { DatePicker } from "../forms/date-picker-generic";
import { Input } from "../ui/input";
import { AdvancedFilterProps } from "./types";

export function AdvancedFilter({
	className,
	searchables,
	filters,
	resetFilters,
	setFilters,
}: AdvancedFilterProps) {
	const handleInputChange = (key: string, value: string) => {
		setFilters({
			...filters,
			[key]: value,
		});
	};

	const ButtonClearFilter = ({ filterKey }: { filterKey: string }) => (
		<Button
			variant={"ghost"}
			onClick={() => handleInputChange(filterKey, "")}
		>
			<X />
		</Button>
	);

	return (
		<Drawer>
			<DrawerTrigger asChild>
				<Button variant="outline" className={`${className}`}>
					<Filter />
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<div className="mx-auto w-full max-w-sm">
					<DrawerHeader>
						<DrawerTitle>Advanced Search</DrawerTitle>
						<DrawerDescription>
							Filter your search results
						</DrawerDescription>
					</DrawerHeader>

					<div className="flex flex-col gap-2 p-4">
						{searchables?.map((searchable) =>
							searchable.type === "date" ? (
								<div className="flex" key={searchable.key}>
									<DatePicker
										placeholder={searchable.title}
										// Use a controlled prop "selected" instead of "initialSelect"
										value={
											filters[searchable.key]
												? new Date(
														filters[searchable.key],
													)
												: undefined
										}
										onChange={(date) =>
											handleInputChange(
												searchable.key,
												date.toString(),
											)
										}
									/>
									<ButtonClearFilter
										filterKey={searchable.key}
									/>
								</div>
							) : (
								<div className="flex" key={searchable.key}>
									<Input
										type={searchable.type}
										placeholder={searchable.title}
										value={filters[searchable.key] ?? ""}
										onChange={(e) =>
											handleInputChange(
												searchable.key,
												e.target.value,
											)
										}
									/>
									<ButtonClearFilter
										filterKey={searchable.key}
									/>
								</div>
							),
						) || null}
					</div>

					<DrawerFooter>
						<div className="flex w-full">
							<DrawerClose asChild>
								<Button variant="ghost" className="flex-grow">
									Close
								</Button>
							</DrawerClose>
							<DrawerClose asChild>
								<Button
									variant="outline"
									className="flex-grow"
									onClick={resetFilters}
								>
									<FilterX />
									Clear All Filters
								</Button>
							</DrawerClose>
						</div>
					</DrawerFooter>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
