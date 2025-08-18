import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TableCell } from "@/components/ui/table";
import React from "react";

interface BadgeAttributesProps {
    attribute: string | null;
    loading?: boolean;
}

export default function BadgeAttributes({
    attribute,
    loading,
}: BadgeAttributesProps) {
    if (loading) {
        return (
            <TableCell colSpan={2} className="text-center">
                <Skeleton className="h-5 w-full rounded-md" />
            </TableCell>
        );
    }

    const getBadgeVariant = (attr: string | null) =>
        attr ? "default" : "outline";

    const value = attribute ?? "No value selected";

    return (
        <TableCell colSpan={2} className="text-center">
            <Badge
                variant={getBadgeVariant(attribute)}
                className="h-[90%] min-w-[100%] text-center"
            >
                {value}
            </Badge>
        </TableCell>
    );
}
