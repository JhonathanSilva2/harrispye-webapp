import { FabricationMonitoringFetchReturn } from "@/app/api/fabrication-monitoring/route";
import { AlertDialogComponent } from "@/components/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { clientEnv } from "@/lib/constants/config";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Edit2, MoreHorizontal, Send, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteJob } from "../[job]/_actions/delete-job";
import { EditDialog } from "./edit-dialog";
import { ActionsCell } from "./actions-cell";

export const fabricationMonitoringJobsColumns: ColumnDef<FabricationMonitoringFetchReturn>[] =
	[
		{
			accessorKey: "hp",
			header: "HP",
			cell: ({ row }) => <Badge>{row.getValue("hp")}</Badge>,
		},
		{
			accessorKey: "po_number",
			header: "PO Number",
		},
		{
			accessorKey: "client",
			header: "Client",
		},
		{
			accessorKey: "expected_delivery_date",
			header: "Delivery Date",
			cell: ({ row }) => {
				// 1. Forçar tipagem para string
				const dateString = row.getValue(
					"expected_delivery_date",
				) as string;

				// 2. Extrair apenas a parte da data (YYYY-MM-DD)
				const [year, month, day] = dateString.split("T")[0].split("-");

				// 3. Formatar para DD/MM/YYYY
				return `${day}/${month}/${year}`;
			},
		},
		{
			accessorKey: "grossCost",
			header: "Gross Cost",
			cell: ({ row }) => {
				const amount = parseFloat(row.getValue("grossCost"));
				const formatted = new Intl.NumberFormat("pt-BR", {
					style: "currency",
					currency: "BRL",
				}).format(amount);
				return formatted;
			},
			enableSorting: false,
		},
		{
			accessorKey: "progress",
			header: "Progress",
			cell: ({ row }) => {
				const progress = parseFloat(row.getValue("progress")) || 0;
				return <Badge className="bg-emerald-500">{progress}%</Badge>;
			},
			enableSorting: false,
		},
		{
			accessorKey: "_actions",
			header: "Actions",
			cell: ({ row }) => <ActionsCell row={row} />,
			enableSorting: false,
		},
	];
