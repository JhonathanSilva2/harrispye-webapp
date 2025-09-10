import { FabricationMonitoringSpoolsFetchReturn } from "@/app/api/fabrication-monitoring/[job]/route";
import { ColumnDefinition, ExcelWriter } from "../ExcelWriter";

type ReportData = FabricationMonitoringSpoolsFetchReturn;
type SpoolData = FabricationMonitoringSpoolsFetchReturn["spools"][0];
type DesignData = FabricationMonitoringSpoolsFetchReturn["designs"][0];

export class FabricationReportGenerator {
    private writer: ExcelWriter;
    private data: ReportData;

    constructor(data: ReportData) {
        this.writer = new ExcelWriter();
        this.data = data;
    }

    public async build(): Promise<ArrayBuffer> {
        this._jobDetailsSheet();
        this._addFabricationItemsSheet();
        this._designListSheet();
        this._summarySheet();
        return this.writer.getBuffer();
    }

    /**
     * Formata as datas na tabela vertical usando `cellFormats` para precisão.
     */
    private _jobDetailsSheet(): void {
        const jobData = this.data.job;
        this.writer.addSheet({
            name: "Job Details",
            data: [
                {
                    id: jobData.id ?? "N/A",
                    hp: jobData.hp ?? "N/A",
                    client_ref: jobData.client_ref ?? "N/A",
                    client: jobData.client ?? "N/A",
                    contract_delivery_date: jobData.contract_delivery_date
                        ? new Date(jobData.contract_delivery_date)
                        : "N/A",
                    expected_delivery_date: jobData.expected_delivery_date
                        ? new Date(jobData.expected_delivery_date)
                        : "N/A",
                    po_number: jobData.po_number ?? "N/A",
                    job_description: jobData.job_description ?? "N/A",
                },
            ],

            verticalTable: true,
            // Formatação de célula para campos de data específicos
            cellFormats: {
                B5: "date", // contract_delivery_date
                B6: "date", // expected_delivery_date
            },
        });
    }

    /**
     * Usa `columnFormats` para formatar colunas inteiras de números e porcentagens.
     */
    private _addFabricationItemsSheet(): void {
        const fabricationColumns: ColumnDefinition<SpoolData>[] = [
            { key: "id", header: "ID", width: 8, selector: (job) => job.id },
            {
                key: "drawing_ref",
                header: "Drawing Ref",
                width: 30,
                selector: (job) => job.drawing_ref,
            },
            {
                key: "Item_number",
                header: "Item Number",
                width: 15,
                selector: (job) => job.spool_number,
            },
            {
                key: "description",
                header: "Description",
                width: 40,
                selector: (job) => job.description,
            },
            {
                key: "mass",
                header: "Mass (Kg)",
                width: 15,
                format: "text",
                selector: (job) => (Number(job.mass) || 0) + " Kg",
            },
            {
                key: "dispatch",
                header: "Dispatch",
                width: 15,
                format: "percentage",
                selector: (job) => Number(job.dispatch) || 0,
            },
            {
                key: "updated_at",
                header: "Updated At",
                width: 18,
                format: "date",
                selector: (job) =>
                    job.updated_at ? new Date(job.updated_at) : "N/A",
            },
            {
                key: "approved_by",
                header: "Approved By",
                width: 20,
                selector: (job) =>
                    job.updated_by ? job.updated_by + " - Matricula" : "N/A",
            },
        ];

        // A chamada ao addSheet agora é limpa e declarativa
        this.writer.addSheet<SpoolData>({
            name: "Fabrication Items",
            useTableFormat: true,
            sourceData: this.data.spools,
            columnDefinitions: fabricationColumns,
        });
    }

    /**
     * Formata a coluna de data.
     */
    private _designListSheet(): void {
        const designColumns: ColumnDefinition<DesignData>[] = [
            {
                key: "id",
                header: "ID",
                width: 8,
                selector: (design) => design.id,
            },
            {
                key: "display_name",
                header: "Display Name",
                width: 45,
                selector: (design) => design.display_name ?? "N/A",
            },
            {
                key: "created_date",
                header: "Created Date",
                width: 18,
                format: "date",
                selector: (design) =>
                    design.created_at ? new Date(design.created_at) : null,
            },
        ];

        this.writer.addSheet<DesignData>({
            name: "Design List",
            useTableFormat: true,
            sourceData: this.data.designs,
            columnDefinitions: designColumns,
        });
    }

    /**
     * Usa um layout customizado e `cellFormats` para formatar um resumo com tipos de dados mistos.
     */
    private _summarySheet(): void {
        const summary = this.data.summary;

        this.writer.addSheet({
            name: "Summary",
            keyValueData: [
                {
                    description: "Total Spools",
                    value: summary["Spools Count"] ?? 0,
                    format: "integer",
                },
                {
                    description: "Total Mass (Kg)",
                    value: Number(summary["Total Mass"]) ?? 0,
                    format: "numeric",
                },
                {
                    description: "Approved Spools",
                    value: Number(summary["Approved Spools"]) ?? 0,
                    format: "integer",
                },
            ],
        });
    }
}
