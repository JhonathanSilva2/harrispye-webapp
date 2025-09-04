"use client";

import {
    $Enums,
    fabrication_monitoring,
} from "@/../prisma/generated/client-hp-base";
import { Input } from "@/components/ui/input";
import { useUpdateSpool } from "@/hooks/query/use-spools";
import { Row, Table } from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import { useCallback, useState } from "react";
import { NotApplicableInputWrapper } from "./not-applicable-input-wrapper";
import { formatValue } from "../_utils/format-number";

interface AutoSaveInputProps<TData> {
    name: string;
    type: "text" | "number" | "currency" | "percentage";
    row: Row<fabrication_monitoring>;
    table: Table<TData>;
    onlyIntegers?: boolean;
    permission: $Enums.fabrication_monitoring_permission_action;
}

// Função auxiliar para limpar e converter o valor para o formato numérico correto
const parseNumericValue = (value: string | number | null, type: string) => {
    if (value === null) return null;
    if (typeof value === "number") return value;
    if (type === "currency" || type === "percentage" || type === "number") {
        const cleanedValue = value
            .toString()
            .replace(/[^\d.,-]/g, "")
            .replace(",", ".");
        const parsed = parseFloat(cleanedValue);
        return isNaN(parsed) ? null : parsed;
    }
    return value;
};

export default function AutoSaveInput<TData>({
    name,
    type,
    row,
    table,
    onlyIntegers,
    permission,
}: AutoSaveInputProps<TData>) {
    const initialValue = row.getValue(name) as string | number | null;
    const [value, setValue] = useState(initialValue);

    const isEditing = table.options.meta!.isEditing ?? "";
    const spoolID = String(row.original.id);
    const job = table.options.meta?.hp ?? "";
    const mutation = useUpdateSpool(job, spoolID);
    const handleSave = useCallback(
        async (name: string, valueToSave: string | number | null) => {
            try {
                const bodyValue = parseNumericValue(valueToSave, type);
                if (bodyValue === initialValue) return;

                await mutation.mutateAsync({ [name]: bodyValue });
            } catch (error) {
                console.error("Erro ao salvar os dados:", error);
            }
        },
        [type, initialValue, mutation],
    );

    const handleBlur = useCallback(() => {
        handleSave(name, value);
    }, [handleSave, name, value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setValue(handleInputNumValue(inputValue));
    };

    const handleInputNumValue = (inputValue: string) => {
        const numValue = parseInt(inputValue);
        if (type === "percentage") {
            if (numValue > 100) {
                return "100";
            } else if (numValue < 0) {
                return "0";
            } else {
                return isNaN(numValue) ? "" : String(numValue);
            }
        } else {
            return inputValue || "";
        }
    };

    if (permission !== "NONE") {
        const canEdit = permission === "EDIT" || permission === "ALL";

        return isEditing && canEdit ? (
            <div className="relative w-full">
                {type === "number" ||
                type === "percentage" ||
                type === "currency" ? (
                    <NotApplicableInputWrapper
                        name={name}
                        type={type}
                        handleSave={handleSave}
                        value={value}
                        setValue={setValue}
                        handleBlur={handleBlur}
                        onChange={handleChange}
                        spoolID={spoolID}
                        job={job}
                    />
                ) : (
                    <div className="relative w-full">
                        <Input
                            data-cy={`spool-column-${name}`}
                            name={name}
                            type="text"
                            value={value ?? ""}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Type here..."
                            className={`w-full rounded border p-2 transition-all ${
                                mutation.isPending
                                    ? "cursor-not-allowed opacity-70"
                                    : ""
                            }`}
                            disabled={mutation.isPending}
                        />
                        {mutation.isPending && (
                            <Loader2
                                className="absolute right-2 top-2 animate-spin text-primary"
                                size={20}
                            />
                        )}
                    </div>
                )}
            </div>
        ) : (
            <div data-cy={`spool-column-${name}-readOnly`}>
                {formatValue(name, value, type)}
            </div>
        );
    }

    return (
        <div data-cy={`spool-column-${name}-readOnly`}>
            {formatValue(name, value, type)}
        </div>
    );
}
