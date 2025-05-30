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
import { patchSpool } from "../../_actions/patch-spool";
import { useQueryClient } from "@tanstack/react-query";
import { useUpdateSpool } from "@/hooks/query/use-spools";

type ApprovalStatus = "APPROVED" | "DECLINED" | "PENDING";

interface ClientApprovalSelectProps {
	status: ApprovalStatus;
	isEditing: boolean;
	spoolID: string;
	hp: string;
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

const ClientApprovalSelect = ({
	status,
	isEditing,
	spoolID,
	hp,
}: ClientApprovalSelectProps) => {
	const queryClient = useQueryClient();

	const [selectedStatus, setSelectedStatus] =
		useState<ApprovalStatus>(status);
	const mutation = useUpdateSpool(hp, spoolID);
	const handleChange = useCallback(
		async (newStatus: ApprovalStatus) => {
			setSelectedStatus(newStatus);
			const body = { client_approval: newStatus };
			try {
				mutation.mutateAsync(body);
			} catch (error) {
				console.error("Erro ao salvar os dados:", error);
			} finally {
			}
		},
		[mutation],
	);
	return isEditing && status === "PENDING" ? (
		<Select
			onValueChange={handleChange}
			value={selectedStatus}
			disabled={mutation.isPending}
		>
			<SelectTrigger className="w-[180px]">
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
		<div className="flex items-center justify-center gap-1">
			<Badge className={`rounded-full ${statusColors[status]}`}>
				{statusIcons[status]}
			</Badge>
		</div>
	);
};

export default ClientApprovalSelect;
