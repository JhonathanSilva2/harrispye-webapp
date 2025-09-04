import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useUpdateSpool } from "@/hooks/query/use-spools";
import { Row, Table } from "@tanstack/react-table";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import {
    $Enums,
    fabrication_monitoring,
    fabrication_monitoring_jobs,
} from "prisma/generated/client-hp-base";
import { JSX, useCallback, useState } from "react";
import { toast } from "sonner";

type ApprovalStatus = "APPROVED" | "DECLINED" | "PENDING";

interface ApprovalSelectProps<TData> {
    status: ApprovalStatus;
    select_name: "client_approval" | "manager_approval";
    row: Row<fabrication_monitoring>;
    table: Table<TData>;
    permission: $Enums.fabrication_monitoring_permission_action;
    job?: fabrication_monitoring_jobs;
}

const statusColors: Record<ApprovalStatus, string> = {
    APPROVED: "bg-green-400 hover:bg-green-500",
    DECLINED: "bg-red-400 hover:bg-red-500",
    PENDING: "bg-orange-400 hover:bg-orange-500",
};

const statusIcons: Record<ApprovalStatus, JSX.Element> = {
    APPROVED: <CheckCircle size={16} />,
    DECLINED: <XCircle size={16} />,
    PENDING: <Clock size={16} />,
};

export default function ClientApprovalSelect<TData>({
    status,
    select_name,
    row,
    table,
    permission,
    job,
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
                await mutation.mutateAsync(body);
                toast.success(`Status ${newStatus} successfully!`);
            } catch (error) {
                toast.error("Failed to update status, please try again.");
                console.error("Error saving data:", error);
            }
        },
        [mutation, select_name],
    );

    const canEdit = permission === "EDIT" || permission === "ALL";

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
            className="flex h-full items-center justify-center"
            data-cy={`spool-column-${select_name}-readOnly`}
        >
            <Badge
                className={` ${statusColors[status]} h-7 w-full justify-center`}
            >
                {statusIcons[status]}
            </Badge>
        </div>
    );
}
