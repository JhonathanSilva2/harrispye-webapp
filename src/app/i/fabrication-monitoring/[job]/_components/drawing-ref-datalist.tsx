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
import { useDrawing } from "@/hooks/query/use-drawings";
import { useUpdateSpool } from "@/hooks/query/use-spools";
import { cn } from "@/lib/utils";
import { fabrication_monitoring } from "@/../prisma/generated/client-hp-base";
import { Row, Table } from "@tanstack/react-table";
import { useCallback } from "react";
import { PermissionValue } from "../_permissions/types";
import PdfModal from "./manage-drawings/pdf-dialog";

interface DrawingRefSelectProps<TData> {
    row: Row<fabrication_monitoring>;
    table: Table<TData>;
    permission: PermissionValue;
}

export function DrawingRefSelect<TData>({
    row,
    table,
    permission,
}: DrawingRefSelectProps<TData>) {
    const jobID = row.original.id_fabrication_monitoring_jobs ?? "";
    const spoolID = String(row.original.id); // Supondo que o ID seja "id"
    const isEditing = table.options.meta!.isEditing ?? "";
    const job = table.options.meta?.hp ?? "";
    const initialValue = row.getValue("drawing_ref") as string;
    const [open, setOpen] = React.useState(false);
    const { data, isLoading } = useDrawing(String(jobID), open);
    const [value, setValue] = React.useState(initialValue);
    const drawings = React.useMemo(() => {
        return (
            data?.data?.map((item) => ({
                value: item.display_name,
                label: item.display_name,
            })) ?? []
        );
    }, [data]);
    const url = `/api/fabrication-monitoring/designs/${row.original.id}`;
    const mutation = useUpdateSpool(job, spoolID);
    const handleSelect = useCallback(
        async (selectedValue: string) => {
            setValue(selectedValue);
            setOpen(false);
            const body = { drawing_ref: selectedValue };
            try {
                mutation.mutateAsync(body);
            } catch (error) {
                console.error("Erro ao salvar a seleção:", error);
            }
        },
        [mutation],
    );
    if (permission) {
        const canEdit = permission !== "READ";

        return isEditing && canEdit ? (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                        data-cy="spool-column-drawing_ref"
                    >
                        {value ? (
                            <span className="truncate">{value}</span>
                        ) : (
                            "Select drawing..."
                        )}
                        <ChevronsUpDown className="opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[250px] p-0">
                    <Command>
                        <CommandInput placeholder="Search drawing..." />
                        <CommandList>
                            {mutation.isPending ? (
                                <CommandItem disabled>
                                    Carregando...
                                </CommandItem>
                            ) : drawings.length === 0 ? (
                                <CommandEmpty>
                                    Nenhum drawing encontrado.
                                </CommandEmpty>
                            ) : (
                                <CommandGroup>
                                    {drawings.map((drawing) => (
                                        <CommandItem
                                            key={drawing.value}
                                            value={drawing.value}
                                            onSelect={() =>
                                                handleSelect(drawing.value)
                                            }
                                        >
                                            {drawing.label}
                                            <Check
                                                className={cn(
                                                    "ml-auto",
                                                    value === drawing.value
                                                        ? "opacity-100"
                                                        : "opacity-0",
                                                )}
                                            />
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        ) : (
            <div
                data-cy="spool-column-drawing_ref-readOnly"
                className="cursor-pointer font-medium text-green-800 dark:font-normal dark:text-green-400"
            >
                <PdfModal pdfUrl={url}>{value}</PdfModal>
            </div>
        );
    }
}
