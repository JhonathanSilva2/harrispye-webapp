import path from "path";
import fs from "fs";
import ExcelJS from "exceljs";
import { erfData } from "@/app/i/commercial/auto-budget/types";

type CellStyle = {
	fill?: ExcelJS.Fill;
	font?: Partial<ExcelJS.Font>;
	alignment?: Partial<ExcelJS.Alignment>;
	numFmt?: string;
};

export class BudgetLedger {
	private enquiryRequestData;
	private headers;
	constructor(enquiryRequestData: Array<erfData>) {
		this.enquiryRequestData = enquiryRequestData;
		this.headers = [
			"Description:",
			"Client Name and Division:",
			"Client Contact Name:",
			"Client Contact Email Address:",
			"Invoicing Address:",
			"Avantis Station:",
			"Avantis Services:",
			"Requester:",
			"Estimated Quote Date:",
			"Estimated Quote Value:",
			"Expected Start Date:",
			"Expected Duration:",
			"Probability of Award (A, B, C):",
		];
	}
	private getCellStyle(header: string): CellStyle {
		if (header.includes("Date")) {
			return {
				alignment: { horizontal: "center" },
				numFmt: "dd/mm/yyyy",
			};
		}
		if (header.includes("Value")) {
			return {
				alignment: { horizontal: "center" },
				numFmt: '_(R$* #,##0.00_);_(R$* (#,##0.00);_(R$* "-"??_);_(@_)',
			};
		}
		if (
			header.includes("Expected Duration:") ||
			header.includes("Probability of Award (A, B, C):")
		) {
			return {
				alignment: { horizontal: "center" },
			};
		}
		return {
			alignment: { horizontal: "left" },
		};
	}
	mapRow(item: erfData) {
		return [
			item.description,
			`${item.client_name} - ${item.division}`,
			item.client_contact_name,
			item.client_email,
			item.invoicing_address,
			item.avantis_station,
			item.avantis_services,
			item.requester,
			new Date(item.estimated_quote_date),
			item.estimated_quote_value,
			new Date(item.expected_start_date),
			item.expected_duration,
			item.probability_award,
		];
	}
	private async prepareFolders(): Promise<{
		uploadFolder: string;
		stagingFolder: string;
	}> {
		const basePublic = path.join(process.cwd(), "public");
		const uploadFolder = path.join(basePublic, "commercial_uploads");
		const stagingFolder = path.join(basePublic, "staging");

		await fs.promises.mkdir(uploadFolder, { recursive: true });
		await fs.promises.mkdir(stagingFolder, { recursive: true });

		return {
			uploadFolder,
			stagingFolder,
		};
	}

	public async generateExcel(): Promise<string> {
		const { uploadFolder } = await this.prepareFolders();
		const now = new Date();
		const formattedDate = `${now.getFullYear()}.${(now.getMonth() + 1)
			.toString()
			.padStart(
				2,
				"0",
			)}.${now.getDate().toString().padStart(2, "0")}-${now
			.getHours()
			.toString()
			.padStart(
				2,
				"0",
			)}hr${now.getMinutes().toString().padStart(2, "0")}min`;
		const fileName = `Budget Ledger - ${formattedDate}.xlsx`;

		const filePath = path.join(uploadFolder, fileName);

		const workbook = new ExcelJS.Workbook();
		const sheet = workbook.addWorksheet("Budget Ledger");

		// Cabeçalho
		sheet.addRow(this.headers);
		const headerRow = sheet.getRow(1);
		headerRow.eachCell((cell: ExcelJS.Cell, colNumber: number) => {
			cell.fill = {
				type: "pattern",
				pattern: "solid",
				fgColor: { argb: "FF156082" },
			};
			cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
			cell.alignment = { vertical: "middle", horizontal: "center" };
		});

		// Dados
		this.enquiryRequestData.forEach((item) => {
			const row = this.mapRow(item);
			const newRow = sheet.addRow(row);

			newRow.eachCell((cell: ExcelJS.Cell, colNumber: number) => {
				const header = this.headers[colNumber - 1];
				const style = this.getCellStyle(header);

				if (style.alignment)
					cell.alignment = { ...style.alignment, vertical: "middle" };
				if (style.font) cell.font = style.font;
				if (style.fill) cell.fill = style.fill;
				if (style.numFmt) cell.numFmt = style.numFmt;
			});
		});

		// Ajuste de colunas
		sheet.columns.forEach((column, index) => {
			if (column.eachCell) {
				let maxLength = 10;
				const header = this.headers[index];

				column.eachCell({ includeEmpty: true }, (cell) => {
					let length = 10;

					if (typeof cell.value === "string") {
						length = cell.value.length;
					} else if (typeof cell.value === "number") {
						length = cell.value.toString().length;
					}

					if (length > maxLength) maxLength = length;
				});

				// Limita colunas de data a 12 de largura (ajustável)
				if (header.includes("Date")) {
					column.width = 22;
				} else {
					column.width = maxLength + 2;
				}
			}
		});

		// Salva o arquivo
		await workbook.xlsx.writeFile(filePath);
		return filePath;
	}
}
