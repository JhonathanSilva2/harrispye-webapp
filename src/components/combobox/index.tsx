"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
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

export interface ComboboxOption {
    value: string;
    label: string;
}

interface ComboboxProps {
    options: ComboboxOption[];
    value: string | null;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    width?: string | number;
}

export function Combobox({
    options,
    value,
    onChange,
    placeholder = "Select...",
    className,
    width = 200,
}: ComboboxProps) {
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("");

    // Filtra opções conforme input do usuário
    const filteredOptions = React.useMemo(() => {
        if (!inputValue) return options;
        return options.filter((option) =>
            option.label.toLowerCase().includes(inputValue.toLowerCase()),
        );
    }, [inputValue, options]);
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(className)}
                    style={{ width }}
                >
                    {value
                        ? options.find((option) => option["label"] === value)
                              ?.label
                        : placeholder}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" style={{ width }}>
                <Command>
                    <CommandInput
                        placeholder={`Search ${placeholder.toLowerCase()}`}
                        className="h-9"
                        value={inputValue}
                        onValueChange={setInputValue}
                        autoFocus
                    />
                    <CommandList>
                        {filteredOptions.length === 0 && (
                            <CommandEmpty>No results found.</CommandEmpty>
                        )}
                        <CommandGroup>
                            {filteredOptions.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={option.value}
                                    onSelect={(currentValue) => {
                                        onChange(
                                            currentValue === value
                                                ? ""
                                                : currentValue,
                                        );
                                        setOpen(false);
                                        setInputValue("");
                                    }}
                                >
                                    {option.label}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            value === option.value
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
