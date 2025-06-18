import { JSX, useCallback, useState } from "react";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectGroup,
    SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { Row, Table } from "@tanstack/react-table";
import { useUpdateSpool } from "@/hooks/query/use-spools";
import { fabrication_monitoring } from "prisma/generated/client-hp-base";
import { PermissionValue } from "../_permissions/types";

type ApprovalStatus = "APPROVED" | "DECLINED" | "PENDING";

interface ApprovalSelectProps<TData> {
    status: ApprovalStatus;
    select_name: "client_approval" | "manager_approval";
    row: Row<fabrication_monitoring>;
    table: Table<TData>;
    permission: PermissionValue;
}

const statusColors: Record<ApprovalStatus, string> = {
    APPROVED: "bg-green-400 hover:bg-green-500",
    DECLINED: "bg-red-400 hover:bg-red-500",
    PENDING: "bg-orange-400 hover:bg-orange-500",
};

const statusIcons: Record<ApprovalStatus, JSX.Element> = {
    APPROVED: <CheckCircle className="w-full" />,
    DECLINED: <XCircle className="w-full" />,
    PENDING: <Clock className="w-full" />,
};

export default function ClientApprovalSelect<TData>({
    status,
    select_name,
    row,
    table,
    permission,
}: ApprovalSelectProps<TData>) {
    const hp = table.options.meta!.hp ?? "";
    const spoolID = String(row.original.id);
    const isEditing = table.options.meta!.isEditing ?? "";
    const [selectedStatus, setSelectedStatus] =
        useState<ApprovalStatus>(status);
    const mutation = useUpdateSpool(hp, spoolID);
    const handleChange = useCallback(
        async (newStatus: ApprovalStatus) => {
            setSelectedStatus(newStatus);
            const body: Record<string, ApprovalStatus> = {};
            body[select_name] = newStatus;
            try {
                mutation.mutateAsync(body);
            } catch (error) {
                console.error("Erro ao salvar os dados:", error);
            } finally {
            }
        },
        [mutation, select_name],
    );
    const canEdit = permission !== "READ";

    return canEdit && isEditing && status === "PENDING" ? (
        <Select
            onValueChange={handleChange}
            value={selectedStatus}
            disabled={mutation.isPending}
        >
            <SelectTrigger
                className="w-[180px]"
                data-cy={`spool-column-${select_name}`}
            >
                <SelectValue placeholder={selectedStatus} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {(Object.keys(statusColors) as ApprovalStatus[]).map(
                        (approval) => (
                            <SelectItem key={approval} value={approval}>
                                {approval}
                            </SelectItem>
                        ),
                    )}
                </SelectGroup>
            </SelectContent>
        </Select>
    ) : (
        <div
            className="flex items-center justify-center gap-1"
            data-cy={`spool-column-${select_name}-readOnly`}
        >
            <Badge className={`rounded-full ${statusColors[status]}`}>
                {statusIcons[status]}
            </Badge>
        </div>
    );
}
