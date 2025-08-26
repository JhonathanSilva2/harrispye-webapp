"use client";

import {
    $Enums,
    fabrication_monitoring,
} from "@/../prisma/generated/client-hp-base";
import { Input } from "@/components/ui/input";
import { useUpdateSpool } from "@/hooks/query/use-spools";
import { formatBrNumber } from "@/utils/brasil-format-number";
import { formatMoney } from "@/utils/format-currency";
import { formatPercentage } from "@/utils/format-percentage";
import { Row, Table } from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import { useCallback, useState } from "react";
import { NotApplicableInputWrapper } from "./not-applicable-input-wrapper";

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
    // ... (a função formatValue continua a mesma)
    const formatValue = (
        currentValue: string | number | null,
        typeValue: string,
    ) => {
        if (currentValue === null) return "N/A"; // Exibe N/A para valores nulos
        switch (typeValue) {
            case "text":
                return currentValue || "";

            case "number":
                if (name === "mass")
                    return (
                        (formatBrNumber(Number(currentValue)) || "0") + " kg"
                    );
                return Number(currentValue) || 0;

            case "currency":
                return (
                    formatMoney(Number(currentValue)) || formatMoney(Number(0))
                );
            case "percentage":
                return (
                    formatPercentage(Number(currentValue), "pt-BR", 0, 0) ||
                    formatPercentage(0, "pt-BR", 0, 0)
                );

            default:
                return currentValue;
        }
    };

    const initialValue = row.getValue(name) as string | number | null;
    const [value, setValue] = useState(initialValue);

    const isEditing = table.options.meta!.isEditing ?? "";
    const spoolID = String(row.original.id);
    const job = table.options.meta?.hp ?? "";
    const mutation = useUpdateSpool(job, spoolID);
    const handleSave = useCallback(
        // 👇 ALTERAÇÃO AQUI: Adicione os dois argumentos
        async (name: string, valueToSave: string | number | null) => {
            try {
                const bodyValue = parseNumericValue(valueToSave, type);

                // O valor inicial precisa ser obtido de forma mais direta,
                // já que não podemos mais confiar no `initialValue` do escopo externo
                // se o nome do campo puder variar. Mas para este caso, podemos manter.
                // A comparação ainda é válida.
                if (bodyValue === initialValue) return;

                await mutation.mutateAsync({ [name]: bodyValue });
            } catch (error) {
                console.error("Erro ao salvar os dados:", error);
            }
        },
        // 👇 ALTERAÇÃO AQUI: Remova 'name' das dependências, pois agora é um argumento
        [type, initialValue, mutation],
    );
    // ALTERADO: Envolvendo com useCallback
    const handleBlur = useCallback(() => {
        handleSave(name, value);
    }, [handleSave, name, value]);

    // O `handleChange` agora é mais simples e genérico
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        if (type === "percentage") {
            const numValue = parseInt(inputValue);
            if (numValue > 100) {
                setValue("100");
            } else if (numValue < 0) {
                setValue("0");
            } else {
                setValue(isNaN(numValue) ? "" : String(numValue));
            }
        } else {
            setValue(inputValue);
        }
    };

    if (permission !== "NONE") {
        const canEdit = permission === "EDIT" || permission === "ALL";

        return isEditing && canEdit ? (
            <div className="relative w-full">
                {type === "number" ||
                type === "percentage" ||
                type === "currency" ? ( // Adicionado currency
                    <NotApplicableInputWrapper
                        name={name}
                        type={type}
                        handleSave={handleSave}
                        value={value}
                        setValue={setValue} // Passa a função para o filho controlar este estado
                        handleBlur={handleBlur} // << LINHA ADICIONADA
                        onChange={handleChange} // Passa o handler correto
                        spoolID={spoolID}
                        job={job}
                    />
                ) : (
                    // Lógica para input de texto simples
                    <div className="relative w-full">
                        <Input
                            data-cy={`spool-column-${name}`}
                            name={name}
                            type="text"
                            value={value ?? ""} // Garante que o valor nunca seja null/undefined para o input
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
                {formatValue(value, type)}
            </div>
        );
    }

    // Se não houver permissão, retorna o valor formatado sem a capacidade de edição
    return (
        <div data-cy={`spool-column-${name}-readOnly`}>
            {formatValue(value, type)}
        </div>
    );
}
