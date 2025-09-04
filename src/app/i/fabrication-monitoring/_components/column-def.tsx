import { FabricationMonitoringFetchReturn } from "@/app/api/fabrication-monitoring/route";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
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
            accessorKey: "job_description",
            header: "Job Description",
            cell: ({ row }) => {
                const description =
                    typeof row.original.job_description === "string"
                        ? row.original.job_description
                        : "";
                const truncated = description.length > 50;
                return truncated
                    ? description.slice(0, 50) + "..."
                    : description;
            },
        },

        {
            accessorKey: "user_organizations.organization",
            header: "Organization",
            cell: ({ row }) => {
                const organization = row.original.user_organizations
                    ? row.original.user_organizations.organization
                    : "N/A";
                return (
                    <Badge
                        className="min-w-24 justify-center"
                        variant={"outline"}
                    >
                        {organization}
                    </Badge>
                );
            },
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
            cell: ({ table, row }) => (
                <ActionsCell
                    row={row}
                    accessControl={table.options.meta?.accessControl}
                />
            ),
            enableSorting: false,
        },
    ];
