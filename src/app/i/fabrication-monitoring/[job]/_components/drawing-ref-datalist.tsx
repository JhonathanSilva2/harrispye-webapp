"use client";

import { Check, ChevronsUpDown, FileUp } from "lucide-react";
import * as React from "react";

import {
    $Enums,
    fabrication_monitoring,
} from "@/../prisma/generated/client-hp-base";
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
import { Row, Table } from "@tanstack/react-table";
import { useCallback } from "react";
import PdfModal from "./manage-drawings/pdf-dialog";

interface DrawingRefSelectProps<TData> {
    row: Row<fabrication_monitoring>;
    table: Table<TData>;
    permission: $Enums.fabrication_monitoring_permission_action;
}

interface DrawingRefSelectValue {
    value: string;
    designID: number | null;
    label: string | null;
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
    const initialValue = {
        value: row.getValue("drawing_ref") as string,
        designID: row.original.fabrication_monitoring_design_id ?? null,
        label: null,
    } as DrawingRefSelectValue;
    const [open, setOpen] = React.useState(false);
    const { data, isLoading } = useDrawing(String(jobID), open);
    const drawings = React.useMemo(() => {
        return (
            data?.data?.map((item) => ({
                value: item.display_name,
                label: item.display_name,
                designID: item.id,
            })) ?? []
        );
    }, [data]);
    const [selectedDrawing, setSelectedDrawing] = React.useState(initialValue);

    const url = `/api/fabrication-monitoring/designs/${selectedDrawing.designID}`;
    const mutation = useUpdateSpool(job, spoolID);
    const isRenderIcon = Boolean(selectedDrawing.value);
    const handleSelect = useCallback(
        async (selectedValue: DrawingRefSelectValue) => {
            setSelectedDrawing(selectedValue);
            setOpen(false);
            const body = {
                drawing_ref: selectedValue.value,
                fabrication_monitoring_design_id: Number(
                    selectedValue.designID,
                ),
            };
            try {
                mutation.mutateAsync(body);
            } catch (error) {
                console.error("Erro ao salvar a seleção:", error);
            }
        },
        [mutation],
    );
    if (permission !== "NONE") {
        const canEdit = permission === "EDIT" || permission === "ALL";

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
                        {selectedDrawing.value ? (
                            <span className="">{selectedDrawing.value}</span>
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
                                                handleSelect({
                                                    value: drawing.value,
                                                    label: drawing.label,
                                                    designID: drawing.designID,
                                                })
                                            }
                                        >
                                            {drawing.label}
                                            <Check
                                                className={cn(
                                                    "ml-auto",
                                                    selectedDrawing.value ===
                                                        drawing.value
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
            <div className="">
                <PdfModal pdfUrl={url}>
                    <div
                        data-cy="spool-column-drawing_ref-readOnly"
                        className="w-full cursor-pointer font-medium text-primary"
                    >
                        <Button
                            variant={"link"}
                            size={"icon"}
                            className="my-1 flex w-full justify-start gap-x-2"
                        >
                            {isRenderIcon && <FileUp />}
                            <span className="">{selectedDrawing.value}</span>
                        </Button>
                    </div>
                </PdfModal>
            </div>
        );
    }
}
