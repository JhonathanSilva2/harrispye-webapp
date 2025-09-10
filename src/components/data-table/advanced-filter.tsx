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
import { useRef, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

export function AdvancedFilter({
    className,
    searchables,
    filters,
    resetFilters,
    setFilters,
}: AdvancedFilterProps) {
    const [localFilters, setLocalFilters] = useState(filters);
    const debounceTimeouts = useRef<Record<string, NodeJS.Timeout>>({});

    // Local filters -> handleLocalFilters -> onChange
    const handleLocalFilters = (key: string, value: string) => {
        setLocalFilters((prev) => ({
            ...prev,
            [key]: value,
        }));

        // Limpa o timeout anterior se existir
        if (debounceTimeouts.current[key]) {
            clearTimeout(debounceTimeouts.current[key]);
        }

        // Define um novo timeout
        debounceTimeouts.current[key] = setTimeout(() => {
            handleInputChange(key, value);
        }, 1500); // tempo de espera em ms
    };

    // Filters -> handleInputChange -> onBBlur

    const handleInputChange = (key: string, value: string) => {
        setFilters({
            ...localFilters,
            [key]: value,
        });
    };

    const handleClearInput = (key: string) => {
        const updated = { ...localFilters, [key]: "" };
        setLocalFilters(updated);
        setFilters(updated);
    };

    const ButtonClearFilter = ({ filterKey }: { filterKey: string }) => (
        <Button variant={"ghost"} onClick={() => handleClearInput(filterKey)}>
            <X />
        </Button>
    );

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button
                    variant="outline"
                    className={`${className}`}
                    size={"sm"}
                >
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
                        {searchables?.map((searchable) => {
                            const filterValue = localFilters[searchable.key];
                            switch (searchable.type) {
                                case "date":
                                    return (
                                        <div
                                            className="flex"
                                            key={searchable.key}
                                        >
                                            <DatePicker
                                                placeholder={searchable.title}
                                                // Use a controlled prop "selected" instead of "initialSelect"
                                                value={
                                                    localFilters[searchable.key]
                                                        ? new Date(
                                                              localFilters[
                                                                  searchable.key
                                                              ],
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
                                    );
                                case "text":
                                case "number":
                                    return (
                                        <div
                                            className="flex"
                                            key={searchable.key}
                                        >
                                            <Input
                                                type={searchable.type}
                                                placeholder={searchable.title}
                                                value={filterValue ?? ""}
                                                onChange={(e) =>
                                                    handleLocalFilters(
                                                        searchable.key,
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <ButtonClearFilter
                                                filterKey={searchable.key}
                                            />
                                        </div>
                                    );
                                case "select":
                                    return (
                                        <div
                                            className="flex"
                                            key={searchable.key}
                                        >
                                            <Select
                                                value={
                                                    typeof filterValue ===
                                                    "number"
                                                        ? filterValue.toString()
                                                        : (filterValue ?? "")
                                                }
                                                onValueChange={(e) =>
                                                    handleLocalFilters(
                                                        searchable.key,
                                                        e,
                                                    )
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue
                                                        placeholder={
                                                            searchable.title
                                                        }
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {searchable.options?.map(
                                                        (option) => (
                                                            <SelectItem
                                                                key={
                                                                    option.value
                                                                }
                                                                value={
                                                                    option.value
                                                                }
                                                            >
                                                                {option.label}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <ButtonClearFilter
                                                filterKey={searchable.key}
                                            />
                                        </div>
                                    );
                                default:
                                    return null;
                            }
                        }) || null}
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
                                    onClick={() => {
                                        setLocalFilters({});
                                        setFilters({});
                                    }}
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
