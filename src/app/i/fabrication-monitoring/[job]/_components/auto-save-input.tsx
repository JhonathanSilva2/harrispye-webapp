"use client";

import { Input } from "@/components/ui/input";
import { useUpdateSpool } from "@/hooks/query/use-spools";
import { formatMoney } from "@/utils/format-currency";
import { formatPercentage } from "@/utils/format-percentage";
import { fabrication_monitoring } from "@/../prisma/generated/client-hp-base";
import { Row, Table } from "@tanstack/react-table";
import { Loader2 } from "lucide-react"; // Ícone de loading
import { useCallback, useState } from "react";
import { PermissionValue } from "../_permissions/types";

interface AutoSaveInputProps<TData> {
    name: string;
    type: "text" | "number" | "currency" | "percentage";
    row: Row<fabrication_monitoring>;
    table: Table<TData>;
    onlyIntegers?: boolean;
    permission: PermissionValue;
}

export default function AutoSaveInput<TData>({
    name,
    type,
    row,
    table,
    onlyIntegers,
    permission,
}: AutoSaveInputProps<TData>) {
    const formatValue = (currentValue: string | number, typeValue: string) => {
        console.log("formatValue", currentValue, typeValue, name);
        switch (typeValue) {
            case "text":
                return currentValue || "";

            case "number":
                if (name === "mass")
                    return Number(currentValue) + " kg" || 0 + " kg";
                return Number(currentValue) || 0;

            case "currency":
                return (
                    formatMoney(Number(currentValue)) || formatMoney(Number(0))
                ); // Exemplo de formatação para números
            case "percentage":
                return (
                    formatPercentage(Number(currentValue), "pt-BR", 0, 0) ||
                    formatPercentage(0, "pt-BR", 0, 0)
                );

            default:
                return currentValue; // Retorna o valor original se o tipo não for reconhecido
        }
    };

    const secondaryValue = type === "text" ? "" : 0;
    const [value, setValue] = useState(
        (row.getValue(name) || secondaryValue) as string | number,
    );
    const isEditing = table.options.meta!.isEditing ?? "";
    const spoolID = String(row.original.id); // Supondo que o ID seja "id"
    const job = table.options.meta?.hp ?? "";
    const mutation = useUpdateSpool(job, spoolID);

    const handleBlur = useCallback(async () => {
        let bodyValue = type === "text" ? value : Number(value);
        if (typeof value === "string" && !value.trim()) return;

        // Se o tipo for moeda ou porcentagem, precisamos limpar os símbolos antes de enviar
        if (type === "currency") {
            bodyValue = parseFloat(value.toString().replace(/[^\d.-]/g, "")); // Remove símbolos de moeda
        } else if (type === "percentage") {
            bodyValue = parseFloat(value.toString().replace(/[^\d.-]/g, "")); // Remove símbolo de porcentagem e converte para decimal
        }

        const body = { [name]: bodyValue };
        try {
            mutation.mutateAsync(body);
        } catch (error) {
            console.error("Erro ao salvar os dados:", error);
        } finally {
        }
    }, [name, type, value, mutation]);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (type === "percentage") {
            let currencyValue;
            if (parseInt(e.target.value) > 100) {
                currencyValue = 100;
            } else if (parseInt(e.target.value) < 0) {
                currencyValue = 0;
            } else {
                currencyValue = parseInt(e.target.value);
            }
            setValue(currencyValue);
        } else {
            setValue(e.target.value);
        }
    };

    if (permission) {
        const canEdit = permission !== "READ";
        return isEditing && canEdit ? (
            <div className="w-full">
                <Input
                    data-cy={`spool-column-${name}`}
                    name={name}
                    type={type === "text" ? type : "number"}
                    value={value}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={type === "text" ? "Type here..." : ""}
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
        ) : (
            <div data-cy={`spool-column-${name}-readOnly`}>
                {formatValue(value, type)}
            </div>
        );
    }
}
