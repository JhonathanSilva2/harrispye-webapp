"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { isValidDate } from "@/utils/is-valid-date";
import { format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
    className?: string;
    placeholder?: string;
    value?: Date;
    onChange?: (dateString: string) => void;
}

export function DatePicker({ className, placeholder, value, onChange }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [date, setDate] = useState<Date | undefined>(
        typeof value === "string" ? parseISO(value) : value,
    );

    useEffect(() => {
        setDate(typeof value === "string" ? parseISO(value) : value);
    }, [value]);

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-between text-left font-normal",
                        !date && "text-muted-foreground",
                        className ?? "",
                    )}
                >
                    {isValidDate(date) ? (
                        format(date as Date, "dd/MM/yyyy")
                    ) : (
                        <span>{placeholder ?? "Pick a date"}</span>
                    )}

                    <CalendarIcon />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(selectedDate) => {
                        if (!selectedDate) return;
                        setDate(selectedDate);
                        setIsOpen(false);
                        onChange?.(format(selectedDate, "yyyy-MM-dd"));
                    }}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
}
