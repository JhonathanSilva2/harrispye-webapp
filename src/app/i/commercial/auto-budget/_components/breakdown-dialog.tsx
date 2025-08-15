import { Button } from "@/components/ui/button";
import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { DetailedBudgetOutput } from "@/lib/autobudget/calculate-detailed-budget-output";
import { CloudCog } from "lucide-react";
import { BudgetBreakdown } from "../types";

interface BreakdownDialogProps {
    id: string;
    className?: string;
    title?: string;
    description?: string;
    breakdown?: BudgetBreakdown;
    detailedBudgetOutput?: DetailedBudgetOutput;
}

const breakdownFields = [
    { key: "CONSUMBALES", label: "Consumables" },
    { key: "EXTERNAL PLANT HIRE", label: "External Plant Hire" },
    { key: "FOOD ALLOWANCES", label: "Food Allowances" },
    { key: "INDIRECT COST", label: "Indirect Cost" },
    { key: "INSPEC TESTING TREAT", label: "Inspec Testing Treat" },
    { key: "LABOUR", label: "Labour" },
    { key: "MATERIALS", label: "Materials" },
    { key: "OTHER DIRECT COST", label: "Other Direct Cost" },
    { key: "ROAD FREIGHT", label: "Road Freight" },
] as const;

const percentTransform = (value: number) => `${(value * 100).toFixed(2)}%`;

const currencyTransform = (value: number) =>
    value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

export default function BreakdownDialog({
    id,
    className,
    title,
    description,
    breakdown,
    detailedBudgetOutput,
}: BreakdownDialogProps) {
    const basePrice = detailedBudgetOutput?.basePrice ?? 0;

    const calcBreakdown = (breakdownVal: number) => {
        const pct = breakdownVal / 100;
        const amount = basePrice * pct;
        return {
            percentage: percentTransform(pct),
            amount: currencyTransform(amount),
        };
    };

    return (
        <DialogContent className={`max-w-fit ${className || ""}`}>
            <DialogHeader>
                <DialogTitle>{title || "Breakdown"}</DialogTitle>
                {description && (
                    <DialogDescription>{description}</DialogDescription>
                )}
            </DialogHeader>

            <div className="flex items-center justify-center space-x-2">
                {breakdown ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Amount</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {breakdownFields.map((field) => {
                                const val =
                                    breakdown[
                                        field.key as keyof BudgetBreakdown
                                    ];
                                if (val == null) return null;

                                const { percentage, amount } = calcBreakdown(
                                    Number(val),
                                );

                                return (
                                    <TableRow key={field.key}>
                                        <TableCell>{field.label}</TableCell>
                                        <TableCell>{amount}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell>Base Price:</TableCell>
                                <TableCell>
                                    {currencyTransform(basePrice)}
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                ) : (
                    <div className="flex items-center justify-center gap-2">
                        <CloudCog /> Please fill the row to see the breakdown
                    </div>
                )}
            </div>

            <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                    <Button type="button" variant="secondary">
                        Close
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    );
}
