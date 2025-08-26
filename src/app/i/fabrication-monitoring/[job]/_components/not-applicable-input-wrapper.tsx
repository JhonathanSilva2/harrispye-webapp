// NotApplicableInputWrapper.tsx (Versão Corrigida)

"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Loader2, Ban, Circle } from "lucide-react";
import { useState, useCallback, useEffect } from "react"; // Adicionado useEffect
import { useUpdateSpool } from "@/hooks/query/use-spools";

interface NotApplicableInputWrapperProps {
    name: string;
    type: "text" | "number" | "currency" | "percentage";
    value: string | number | null;
    handleSave: (
        name: string,
        valueBody: string | number | null,
    ) => Promise<void>;
    handleBlur: () => void;
    setValue: (val: string | number | null) => void;
    spoolID: string;
    job: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function NotApplicableInputWrapper({
    name,
    type,
    value,
    setValue,
    handleBlur,
    handleSave,
    spoolID,
    job,
    onChange,
}: NotApplicableInputWrapperProps) {
    const mutation = useUpdateSpool(job, spoolID);
    const [naActive, setNaActive] = useState(value === null);

    useEffect(() => {
        setNaActive(value === null);
    }, [value]);

    const displayValue = naActive ? "N/A" : (value ?? "");

    const toggleNA = () => {
        if (mutation.isPending) return;

        const newNA = !naActive;
        setNaActive(newNA);

        if (newNA) {
            setValue(null);
            handleSave(name, null);
            console.log("Set to N/A", { name, value: null });
        } else {
            const defineValue =
                type === "number" ||
                type === "currency" ||
                type === "percentage";
            handleSave(name, defineValue ? 0 : "");
            setValue(defineValue ? 0 : "");
            console.log("UnSet N/A", { name, value: defineValue ? 0 : "" });
        }
    };

    return (
        <div className="group relative w-full">
            <Input
                data-cy={`spool-column-${name}`}
                name={name}
                type={type === "text" ? "text" : "number"}
                value={displayValue}
                onChange={onChange}
                onBlur={handleBlur}
                placeholder={type === "text" ? "Type here..." : ""}
                className={`w-full appearance-none rounded border p-2 transition-all [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
                    mutation.isPending || naActive
                        ? "cursor-not-allowed opacity-70"
                        : ""
                }`}
                disabled={mutation.isPending || naActive}
            />

            {!mutation.isPending && (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 opacity-0 transition-opacity group-hover:opacity-100"
                            onClick={toggleNA}
                        >
                            {naActive ? (
                                <Ban className="h-4 w-4 text-red-500" />
                            ) : (
                                <Circle className="h-4 w-4 text-gray-400" />
                            )}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent className="text-info bg-secondary">
                        Not Applicable
                    </TooltipContent>
                </Tooltip>
            )}

            {mutation.isPending && (
                <Loader2
                    className="absolute right-2 top-2 animate-spin text-primary"
                    size={20}
                />
            )}
        </div>
    );
}
