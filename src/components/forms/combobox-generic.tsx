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
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";
type TValue = string | number;

interface Option<T extends TValue> {
    value: T;
    label: string;
}

interface ComboboxProps<T extends TValue> {
    options: Option<T>[];
    placeholder?: string;
    onChange: (value: T | "") => void;
    value: TValue;
    className?: string;
}

export function Combobox<T extends TValue>({
    options,
    placeholder = "Select an option...",
    onChange,
    value,
    className,
}: ComboboxProps<T>) {
    const [open, setOpen] = React.useState(false);
    const selectedLabel = React.useMemo(() => {
        return options.find((option) => option.value === value)?.label;
    }, [options, value]);

    const handleSelect = (currentLabel: string) => {
        const selectedOption = options.find(
            (option) =>
                option.label.toLowerCase() === currentLabel.toLowerCase(),
        );
        const selectedValue = selectedOption?.value || "";

        onChange(selectedValue === value ? "" : selectedValue);
        setOpen(false);
    };
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "w-full justify-between font-normal",
                        className,
                    )}
                >
                    {selectedLabel ? (
                        selectedLabel
                    ) : (
                        <span className="text-muted-foreground">
                            {placeholder}
                        </span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <Command>
                    <CommandInput placeholder="Search..." />
                    <CommandList>
                        <CommandEmpty>No options found.</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={option.label}
                                    onSelect={handleSelect}
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
