import { FabricationMonitoringSpoolsFetchReturn } from "@/app/api/fabrication-monitoring/[job]/route";
import { Payload } from "prisma/generated/client-hp-base/runtime/library";
import React, { useState } from "react";
import { format } from "date-fns";

import { SummaryCard } from "./summary-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EditDialog } from "../../_components/edit-dialog";
import { Button } from "@/components/ui/button";
import { DrawingDialog } from "./manage-drawings/drawing-dialog";
interface SummaryCardProps {
    data: Payload<FabricationMonitoringSpoolsFetchReturn> | undefined;
    loading: boolean;
    hp: string;
}
export default function SummarySpools({ data, loading, hp }: SummaryCardProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenDrawing, setIsOpenDrawing] = useState(false);
    return loading ? (
        <div>
            <Skeleton className="mb-4 mt-10 min-h-[180px] w-full rounded-xl" />
        </div>
    ) : (
        <Card className="mb-4 mt-10 flex flex-col">
            <CardHeader>
                <div className="flex justify-between text-center">
                    <h2 className="text-lg font-semibold">Summary</h2>
                    <div className="flex gap-2">
                        <EditDialog
                            mode="edit"
                            hp={hp}
                            triggerBtn={
                                <Button
                                    variant="outline"
                                    className="flex items-center gap-2"
                                >
                                    <span className="w-full">Manage Job</span>
                                </Button>
                            }
                            open={isOpen}
                            setOpen={setIsOpen}
                        />
                        <DrawingDialog
                            jobId={data?.data.job.id}
                            designs={data?.data.designs}
                            triggerBtn={
                                <Button
                                    variant="outline"
                                    className="flex items-center gap-2"
                                >
                                    <span className="w-full">
                                        Manage Drawings
                                    </span>
                                </Button>
                            }
                            open={isOpenDrawing}
                            setOpen={setIsOpenDrawing}
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="mb-5 flex w-full flex-wrap px-6">
                {/* não está vindo todos os summary resolver dps */}
                <div className="mb-4 grid max-h-[150px] w-full grid-cols-4 gap-4">
                    {Object.entries(data?.data.summary ?? {}).map(
                        ([label, value], index) => {
                            const defineFormatType = (label: string) => {
                                if (label.toLowerCase().includes("date")) {
                                    return "date";
                                }
                                if (
                                    label.toLowerCase().includes("cost") ||
                                    label.toLowerCase().includes("price")
                                ) {
                                    return "currency";
                                }
                                if (label.toLowerCase().includes("mass"))
                                    return "mass";
                                return "text";
                            };

                            if (
                                typeof value === "object" ||
                                value === undefined
                            )
                                return null;

                            const inputType = defineFormatType(label);

                            return (
                                <SummaryCard
                                    defineFormatType={inputType}
                                    label={label}
                                    value={value as string | number | Date}
                                    key={index}
                                />
                            );
                        },
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
