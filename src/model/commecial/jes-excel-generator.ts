import { CostingData } from "@/app/api/commercial/generate-job-number/type";
import { addDays } from "@/utils/add-days";
import { capitalizeWords } from "@/utils/capiteliza-all-words";
import type { Workbook, Worksheet } from "exceljs";
import ExcelJS from "exceljs";

type formula = {
	formula: string;
	result?: number;
};
export class JesDocGenerator {
	private inputJson: CostingData;
	private workbook: Workbook;
	private sheet!: Worksheet;
	private currentRow: number;
	private erfData;
	private looseMaterialData;
	private pipingData;
	private serviceData;
	private manualData;
	private margin;
	private totals;
	private sheetCount = 1;
	private col = 0;
	private pipingHeader = [
		"Area",
		"Description",
		"Item",
		"Size",
		"Material",
		"Qty",
		"NCM",
		"PIS/COFINS",
		"ICMS",
		"IPI",
		"Labour",
		"Materials",
		"Consumables",
		"Road Freight",
		"Indirect cost",
		"Food Allowances",
		"Other Direct Costs",
		"External Plant Hire",
		"Inspect Testing Threat",
		"Raw cost",
		"Margin",
		"Total Sell",
		"Comments",
	];
	private serviceHeader = [
		"Area",
		"Quantity",
		"Description",
		"Days",
		"Service Type",
		"PIS/COFINS",
		"ISS",
		"Unit Daily Rate",
		"Margin",
		"Total Sell",
		"Comments",
	];
	private looseMaterialHeader = [
		"Area",
		"Description",
		"Item",
		"Size",
		"Material",
		"Qty",
		"NCM",
		"PIS/COFINS",
		"ICMS",
		"IPI",
		"Labour",
		"Materials",
		"Consumables",
		"Road Freight",
		"Indirect cost",
		"Food Allowances",
		"Other Direct Costs",
		"External Plant Hire",
		"Inspect Testing Threat",
		"Raw cost",
		"Margin",
		"Total Sell",
		"Comments",
	];
	private manualHeader = [
		"Area",
		"Description",
		"Item",
		"Size",
		"Material",
		"Qty",
		"NCM",
		"PIS/COFINS",
		"ICMS",
		"IPI",
		"Labour",
		"Materials",
		"Consumables",
		"Road Freight",
		"Indirect cost",
		"Food Allowances",
		"Other Direct Costs",
		"External Plant Hire",
		"Inspect Testing Threat",
		"Raw cost",
		"Margin",
		"Total Sell",
		"Comments",
	];
	private finalCostRefs: Record<string, string> = {
		pipingNett: "",
		pipingSell: "",
		serviceNett: "",
		serviceSell: "",
		looseMaterialsNett: "",
		looseMaterialsSell: "",
		manualNett: "",
		manualSell: "",
	};

	constructor(inputJson: CostingData) {
		this.inputJson = inputJson;
		this.looseMaterialData = this.inputJson.budgetData.looseMaterial;
		this.pipingData = this.inputJson.budgetData.piping;
		this.serviceData = this.inputJson.budgetData.service;
		this.manualData = this.inputJson.budgetData.manual;
		this.erfData = this.inputJson.erfData;
		this.totals = this.inputJson.budgetData.totals;
		this.margin = this.totals.margin;
		this.workbook = new ExcelJS.Workbook();
		this.currentRow = 2;
	}

	async generate(): Promise<Buffer<ArrayBufferLike> | null> {
		try {
			this.writeFrontSheet();
			this.writePipingBreakdown();
			this.writeLooseMaterialBreakdown();
			this.writeManualBreakdown();
			this.writeServiceBreakdown();
			this.writeFinalCosting();

			return (await this.workbook.xlsx.writeBuffer()) as unknown as Buffer<ArrayBufferLike>;
		} catch (err) {
			console.error("Erro ao gerar planilha:", err);
			return null;
		}
	}

	private formatDateForExcel(date: string | number | Date): string {
		if (!date) return "N/A";

		const parsed_date =
			typeof date === "string" || typeof date === "number"
				? new Date(date)
				: date;

		if (isNaN(parsed_date.getTime())) {
			return "N/A";
		}

		const day = String(parsed_date.getDate()).padStart(2, "0");
		const month = String(parsed_date.getMonth() + 1).padStart(2, "0");
		const year = parsed_date.getFullYear();

		return `${day}/${month}/${year}`;
	}
	private getCostPorcent(cost: number, raw_cost: number): number {
		const result = cost / raw_cost;
		return result;
	}
	private findColumnLetterByValue(
		sheet: ExcelJS.Worksheet,
		value: string,
		row: number,
	): string {
		for (let col = 1; col <= sheet.columnCount; col++) {
			const cell = sheet.getCell(
				`${String.fromCharCode(64 + col)}${row}`,
			);
			if (cell.value === value) {
				return String.fromCharCode(64 + col);
			}
		}
		return "";
	}

	// styles
	private getHeaderFormat(): object {
		return {
			font: { bold: true, color: { argb: "FFFFFFFF" } },
			alignment: { horizontal: "center" },
			fill: {
				type: "pattern",
				pattern: "solid",
				fgColor: { argb: "0f4159" },
			},
		};
	}
	private getValuesFormat(): object {
		return {
			alignment: { horizontal: "center" },
		};
	}
	private applyCellTypeFormatting(cell_ref: string, cell_type: string) {
		const cell = this.sheet.getCell(cell_ref);

		switch (cell_type) {
			case "date":
				// Formato de data: YYYY-MM-DD
				cell.numFmt = "yyyy-mm-dd";
				break;
			case "currency":
				// Formato de moeda: R$ com duas casas decimais
				cell.numFmt = '"R$"#,##0.00;[Red]\-"R$"#,##0.00';
				break;
			case "numeric":
				// Formato numérico com duas casas decimais
				cell.numFmt = "#,##0.00";
				break;
			case "percentage":
				// Formato de porcentagem com duas casas decimais
				cell.numFmt = "0.00%";
				break;
			case "string":
			default:
				// Formato de texto (geral)
				cell.numFmt = "@";
				break;
		}
	}

	// headers and constructors
	private writeBreakdownHeader(sheet: Worksheet, header: string[]): void {
		header.forEach((value, index) => {
			const column_number = index + 1;
			const cell = sheet.getCell(1, column_number); // linha 1, coluna N

			// Define o valor do cabeçalho
			cell.value = capitalizeWords(value); // Ensure compatibility with ExcelJS

			// Define largura da coluna
			const column_letter = sheet.getColumn(column_number);
			column_letter.width = 20;

			// Aplica estilo de cabeçalho
			Object.assign(cell.style, this.getHeaderFormat());
		});
	}
	private setPipingValue(
		row: number,
		sheet: Worksheet,
		value: string | number | formula = "N/A",
		format: string | null = null,
	): void {
		// Converte número da coluna para letra (1 -> A, 2 -> B, etc.)
		const cell_letter = String.fromCharCode(64 + this.col);
		if (cell_letter === "[") return;
		const cell_ref = `${cell_letter}${row}`;

		sheet.getCell(cell_ref).value = value ?? "N/A";
		this.col++; // Atualiza a coluna para a próxima célula (caso use por referência, pode ajustar)

		if (format) {
			this.applyCellTypeFormatting(cell_ref, format);
		}
	}

	private getERF(key: keyof typeof this.erfData): string {
		const value = this.erfData[key] ?? "N/A";
		return value instanceof Date
			? this.formatDateForExcel(value)
			: String(value);
	}

	// Abas
	private writeFrontSheet(): void {
		const today = new Date();
		const total_days = this.erfData.expected_duration;

		this.sheet = this.workbook.addWorksheet("Front Sheet");

		// Ajustar colunas
		this.sheet.getColumn(1).width = 30; // Coluna A
		this.sheet.getColumn(2).width = 40; // Coluna B

		// Mapeamento de dados (célula, rótulo, valor, tipo)
		const map: Record<
			string,
			[
				cell: string,
				label: string,
				value: string | number | formula,
				type: string,
			]
		> = {
			form_name: [
				"A1",
				"Form Name",
				"Estimation and Job Authorisation Package",
				"string",
			],
			date: ["A2", "Date", this.formatDateForExcel(today), "date"],
			client: ["A3", "Client", this.getERF("client_name"), "string"],
			project_number: [
				"A4",
				"Project Number",
				this.erfData.acronym_number ?? "N/A",
				"string",
			],
			location: ["A5", "Location", "N/A", "string"],
			description: [
				"A6",
				"Description",
				this.getERF("description"),
				"string",
			],
			job_description: [
				"A7",
				"Job Description",
				this.getERF("avantis_services"),
				"string",
			],
			currency: ["A8", "Currency", "BRL", "string"],
			total_days: [
				"A9",
				"Total Days",
				this.getERF("expected_duration"),
				"numeric",
			],
			payment_terms: ["A10", "Payment Terms", "N/A", "string"],
			client_po: ["A11", "Client PO", "N/A", "string"],
			requested_by: ["A12", "Requested By", "N/A", "string"],
			est_start_date: [
				"A13",
				"Est Start Date",
				this.formatDateForExcel(this.getERF("expected_start_date")),
				"date",
			],
			est_finish_date: [
				"A14",
				"Est Finish Date",
				this.formatDateForExcel(
					addDays(
						this.getERF("expected_start_date"),
						Number(this.getERF("expected_duration")),
					),
				),
				"date",
			],
			notes: ["A15", "Notes", "N/A", "string"],
			workshop_involvement: [
				"A16",
				"Workshop Involvement",
				"N/A",
				"string",
			],
			estimated_cost: [
				"A17",
				"Estimated Cost",
				{ formula: "='Final Costings'!B6", result: 0 },
				"numeric",
			],
			estimated_sales: [
				"A18",
				"Estimated Sales",
				{ formula: "='Final Costings'!B6/(1-B19)", result: 0 },
				"numeric",
			],
			est_margin: ["A19", "Est Margin", this.margin / 100, "percentage"],
		};

		Object.values(map).forEach(([cell, label, value, type]) => {
			const row = parseInt(cell.slice(1), 10); // número da linha (ex: 1 de "A1")
			const col_label = this.sheet.getCell(cell);
			col_label.value = label;
			col_label.style = this.getHeaderFormat();

			this.sheet.getCell(`B${row}`).value = value ?? "N/A";
			this.applyCellTypeFormatting(`B${row}`, type);
		});

		// Alinhar valores da coluna B à direita
		for (let i = 1; i <= 20; i++) {
			this.sheet.getCell(`B${i}`).alignment = { horizontal: "right" };
		}
		// removendo a borda de celulas vazias desnecessarias
		const border_style: Partial<ExcelJS.Borders> = {
			top: { style: "thin", color: { argb: "FFFFFFFF" } },
			left: { style: "thin", color: { argb: "FFFFFFFF" } },
			bottom: { style: "thin", color: { argb: "FFFFFFFF" } },
			right: { style: "thin", color: { argb: "FFFFFFFF" } },
		};

		for (let row = 1; row <= 50; row++) {
			for (let col = 1; col <= 26; col++) {
				const cell = this.sheet.getCell(row, col);

				if (cell.value == null) {
					if (col === 3) {
						const { left, ...border_without_left } = border_style;
						cell.border = border_without_left;
					} else if (row === 20) {
						const { top, ...border_without_top } = border_style;
						cell.border = border_without_top;
					} else {
						cell.border = border_style;
					}
				}
			}
		}
	}

	private writeLooseMaterialBreakdown(): void {
		if (!this.looseMaterialData) return;

		// Criar nova aba
		this.sheet = this.workbook.addWorksheet("Loose Materials Breakdown");
		this.sheetCount++;
		this.writeBreakdownHeader(this.sheet, this.looseMaterialHeader);

		let row = 2;
		this.col = 1;
		this.looseMaterialData.forEach((item, key) => {
			const rawCost = key + 1;
			const jointName = "JOINT " + (key + 1);

			this.setPipingValue(row, this.sheet, "N/A", "string");
			this.setPipingValue(row, this.sheet, item.spec, "string");
			this.setPipingValue(row, this.sheet, jointName, "string");
			this.setPipingValue(row, this.sheet, item.diameter, "numeric");
			this.setPipingValue(
				row,
				this.sheet,
				item.breakdown?.TYPE,
				"string",
			);
			this.setPipingValue(row, this.sheet, "1", "numeric");
			this.setPipingValue(row, this.sheet, item.ncm, "percentage");
			this.setPipingValue(
				row,
				this.sheet,
				(item.taxes?.["pis/cofins"] ?? 0) / 100,
				"percentage",
			);
			this.setPipingValue(
				row,
				this.sheet,
				(item.taxes?.icms ?? 0) / 100,
				"percentage",
			);
			this.setPipingValue(
				row,
				this.sheet,
				(item.taxes?.ipi ?? 0) / 100,
				"percentage",
			);
			const breakdown = item.breakdown;
			if (breakdown) {
				this.setPipingValue(
					row,
					this.sheet,
					this.getPercent(item.basePrice, breakdown["LABOUR"] ?? 0),
					"currency",
				);
				this.setPipingValue(
					row,
					this.sheet,
					this.getPercent(
						item.basePrice,
						breakdown["MATERIALS"] ?? 0,
					),
					"currency",
				);
				this.setPipingValue(
					row,
					this.sheet,
					this.getPercent(
						item.basePrice,
						breakdown["CONSUMBALES"] ?? 0,
					),
					"currency",
				);
				this.setPipingValue(
					row,
					this.sheet,
					this.getPercent(
						item.basePrice,
						breakdown["ROAD FREIGHT"] ?? 0,
					),
					"currency",
				);
				this.setPipingValue(
					row,
					this.sheet,
					this.getPercent(
						item.basePrice,
						breakdown["INDIRECT COST"] ?? 0,
					),
					"currency",
				);
				this.setPipingValue(
					row,
					this.sheet,
					this.getPercent(
						item.basePrice,
						breakdown["FOOD ALLOWANCES"] ?? 0,
					),
					"currency",
				);
				this.setPipingValue(
					row,
					this.sheet,
					this.getPercent(
						item.basePrice,
						breakdown["OTHER DIRECT COST"] ?? 0,
					),
					"currency",
				);
				this.setPipingValue(
					row,
					this.sheet,
					this.getPercent(
						item.basePrice,
						breakdown["EXTERNAL PLANT HIRE"] ?? 0,
					),
					"currency",
				);
				this.setPipingValue(
					row,
					this.sheet,
					this.getPercent(
						item.basePrice,
						breakdown["INSPEC TESTING TREAT"] ?? 0,
					),
					"currency",
				);
			}

			// Raw cost calculation and margin formula
			this.setPipingValue(
				row,
				this.sheet,
				{ formula: `SUM(K${row}:S${row})`, result: 0 },
				"currency",
			);
			this.setPipingValue(
				row,
				this.sheet,
				this.margin / 100,
				"percentage",
			);
			this.setPipingValue(
				row,
				this.sheet,
				{
					formula: `=T${row}/(1-U${row})/(1-SUM(H${row}:J${row}))`,
					result: 0,
				},
				"currency",
			);
			this.col = 1;
			row++;
		});

		this.write_breakdown_totals(this.sheet, row, "loose_materials");

		const range_start = 2;
		const range_end = row - 1;
		this.sheet.eachRow({ includeEmpty: true }, (r, rowNumber) => {
			if (rowNumber >= range_start && rowNumber <= range_end) {
				r.eachCell({ includeEmpty: true }, (cell) => {
					cell.alignment = {
						horizontal: "center",
						vertical: "middle",
					};
				});
			}
		});
	}
	private getPercent(value: number, percent: number): number {
		return (value * percent) / 100;
	}
	private writePipingBreakdown(): void {
		if (!this.pipingData) {
			return;
		}

		this.sheet = this.workbook.addWorksheet("Piping Breakdown");

		// Cabeçalho de breakdown
		this.writeBreakdownHeader(this.sheet, this.pipingHeader);

		let row = 2;
		this.col = 1;

		this.pipingData.forEach((item, index) => {
			// Cálculos de margem e impostos

			const raw_cost = item.basePrice;
			const pis_confins = (item.taxes?.["pis/cofins"] ?? 0) / 100; // Convertendo para decimal
			const icms = (item.taxes?.icms ?? 0) / 100; // Convertendo para decimal
			const ipi = (item.taxes?.ipi ?? 0) / 100; // Convertendo para decimal
			const taxes_sum = pis_confins + icms + ipi;
			const total_sell =
				raw_cost / (1 - this.margin / 100) / (1 - taxes_sum);

			// Referências de colunas
			const total_sell_excel = `${this.findColumnLetterByValue(this.sheet, "Total Sell", 1)}${row}`;
			const pis_confis_excel = `${this.findColumnLetterByValue(this.sheet, "PIS/COFINS", 1)}${row}`;
			const icms_excel = `${this.findColumnLetterByValue(this.sheet, "ICMS", 1)}${row}`;
			const ipi_excel = `${this.findColumnLetterByValue(this.sheet, "IPI", 1)}${row}`;
			const taxes_sum_excel = `SUM(${pis_confis_excel}:${ipi_excel})`;
			const margin_excel = `${this.findColumnLetterByValue(this.sheet, "Margin", 1)}${row}`;
			const raw_cost_excel = `${this.findColumnLetterByValue(this.sheet, "Raw Cost", 1)}${row}`;

			// Nome do spool para cada item
			const spool_name = `SPOOL ${index + 1}`;

			// Definir valores nas células
			this.setPipingValue(row, this.sheet, item["spec"], "string");
			this.setPipingValue(row, this.sheet, item["diameter"], "string");
			this.setPipingValue(row, this.sheet, spool_name, "string");
			this.setPipingValue(row, this.sheet, item["diameter"]);
			this.setPipingValue(
				row,
				this.sheet,
				item.breakdown?.TYPE,
				"string",
			);
			this.setPipingValue(row, this.sheet, 1);
			this.setPipingValue(row, this.sheet, item.ncm, "percentage");

			// Impostos
			this.setPipingValue(
				row,
				this.sheet,
				(item.taxes?.["pis/cofins"] ?? 0) / 100,
				"percentage",
			);
			this.setPipingValue(
				row,
				this.sheet,
				(item.taxes?.icms ?? 0) / 100,
				"percentage",
			);
			this.setPipingValue(
				row,
				this.sheet,
				(item.taxes?.ipi ?? 0) / 100,
				"percentage",
			);

			// ensure breakdown
			const breakdown = item.breakdown;
			if (breakdown) {
				this.setPipingValue(
					row,
					this.sheet,
					this.getPercent(item.basePrice, breakdown["LABOUR"] ?? 0),

					// `=${raw_cost}*${this.get_cost_porcent(item["breakdown"]["LABOUR"], raw_cost)}`,
					"currency",
				);

				this.setPipingValue(
					row,
					this.sheet,
					this.getPercent(item.basePrice, breakdown["MATERIALS"]),
					"currency",
				);
				this.setPipingValue(
					row,
					this.sheet,
					this.getPercent(item.basePrice, breakdown["CONSUMBALES"]),
					"currency",
				);
				this.setPipingValue(
					row,
					this.sheet,
					this.getPercent(item.basePrice, breakdown["ROAD FREIGHT"]),
					"currency",
				);
				this.setPipingValue(
					row,
					this.sheet,
					this.getPercent(item.basePrice, breakdown["INDIRECT COST"]),
					"currency",
				);
				this.setPipingValue(
					row,
					this.sheet,
					this.getPercent(
						item.basePrice,
						breakdown["FOOD ALLOWANCES"],
					),
					"currency",
				);
				this.setPipingValue(
					row,
					this.sheet,
					this.getPercent(
						item.basePrice,
						breakdown["OTHER DIRECT COST"],
					),
					"currency",
				);
				this.setPipingValue(
					row,
					this.sheet,
					this.getPercent(
						item.basePrice,
						breakdown["EXTERNAL PLANT HIRE"],
					),
					"currency",
				);
				this.setPipingValue(
					row,
					this.sheet,
					this.getPercent(
						item.basePrice,
						breakdown["INSPEC TESTING TREAT"],
					),
					"currency",
				);
			}

			// Cálculo do raw cost
			this.setPipingValue(
				row,
				this.sheet,
				{ formula: `SUM(K${row}:S${row})`, result: 0 },
				"currency",
			);
			this.setPipingValue(
				row,
				this.sheet,
				this.margin / 100,
				"percentage",
			);
			this.setPipingValue(
				row,
				this.sheet,
				{
					formula: `=T${row}/(1-U${row})/(1-SUM(H${row}:J${row}))`,
					result: 0,
				},
				"currency",
			);
			this.setPipingValue(row, this.sheet, "N/A");

			row++;
			this.col = 1;
		});

		// Totalizadores
		this.write_breakdown_totals(this.sheet, row, "piping");

		// Estilização do range
		const range_start = 2;
		const range_end = row - 1;
		this.sheet.eachRow({ includeEmpty: true }, (r, rowNumber) => {
			if (rowNumber >= range_start && rowNumber <= range_end) {
				r.eachCell({ includeEmpty: true }, (cell) => {
					cell.alignment = {
						horizontal: "center",
						vertical: "middle",
					};
				});
			}
		});
		// removendo a borda de celulas vazias desnecessarias
		const border_style: Partial<ExcelJS.Borders> = {
			top: { style: "thin", color: { argb: "FFFFFFFF" } },
			left: { style: "thin", color: { argb: "FFFFFFFF" } },
			bottom: { style: "thin", color: { argb: "FFFFFFFF" } },
			right: { style: "thin", color: { argb: "FFFFFFFF" } },
		};
	}
	private writeServiceBreakdown(): void {
		if (!this.serviceData) return;
		this.sheet = this.workbook.addWorksheet("Service Breakdown");
		let row = 2;
		this.col = 1;

		// Cabeçalho de breakdown
		/**
 * [
		"Area",
		"Quantity",
		"Description",
		"Days",
		"Service Type",
		"PIS/COFINS",
		"ISS",
		"Unit Daily Rate",
		"Margin",
		"Total Sell",
		"Comments",
	]
 */
		this.writeBreakdownHeader(this.sheet, this.serviceHeader);
		this.serviceData.forEach((item, index) => {
			// Cálculos de margem e impostos

			this.setPipingValue(row, this.sheet, "N/A");
			this.setPipingValue(row, this.sheet, item["quantity"], "numeric");
			this.setPipingValue(row, this.sheet, item.description, "string");
			this.setPipingValue(row, this.sheet, item.days, "numeric");
			// impostos
			this.setPipingValue(
				row,
				this.sheet,
				item.serviceType.toUpperCase(),
				"text",
			);
			this.setPipingValue(row, this.sheet, 9.25 / 100, "percentage");
			this.setPipingValue(row, this.sheet, 3.75 / 100, "percentage");
			this.setPipingValue(
				row,
				this.sheet,
				item.unitDailyPrice,
				"currency",
			);
			// Cálculo do raw cost

			this.setPipingValue(
				row,
				this.sheet,
				this.margin / 100,
				"percentage",
			);
			this.setPipingValue(row, this.sheet, item.salesPrice, "currency");
			this.setPipingValue(row, this.sheet, "N/A", "currency");

			row++;
			this.col = 1;
		});

		// Totalizadores
		this.write_breakdown_totals(this.sheet, row, "service");

		// Estilização do range
		const range_start = 2;
		const range_end = row - 1;
		this.sheet.eachRow({ includeEmpty: true }, (r, rowNumber) => {
			if (rowNumber >= range_start && rowNumber <= range_end) {
				r.eachCell({ includeEmpty: true }, (cell) => {
					cell.alignment = {
						horizontal: "center",
						vertical: "middle",
					};
				});
			}
		});
	}
	private writeManualBreakdown(): void {
		if (!this.serviceData) return;
		this.sheet = this.workbook.addWorksheet("Manual Breakdown");
		let row = 2;
		this.col = 1;
		// Cabeçalho de breakdown
		this.writeBreakdownHeader(this.sheet, this.manualHeader);
		this.manualData.forEach((item, index) => {
			// Cálculos de margem e impostos
			const raw_cost = item.basePrice;
			const pis_confins = (item.taxes?.["pis/cofins"] ?? 0) / 100; // Convertendo para decimal
			const icms = (item.taxes?.icms ?? 0) / 100; // Convertendo para decimal
			const ipi = (item.taxes?.ipi ?? 0) / 100; // Convertendo para decimal
			const taxes_sum = pis_confins + icms + ipi;
			const total_sell =
				raw_cost / (1 - this.margin / 100) / (1 - taxes_sum);

			// Referências de colunas
			const total_sell_excel = `${this.findColumnLetterByValue(this.sheet, "Total Sell", 1)}${row}`;
			const pis_confis_excel = `${this.findColumnLetterByValue(this.sheet, "PIS/COFINS", 1)}${row}`;
			const icms_excel = `${this.findColumnLetterByValue(this.sheet, "ICMS", 1)}${row}`;
			const ipi_excel = `${this.findColumnLetterByValue(this.sheet, "IPI", 1)}${row}`;
			const taxes_sum_excel = `SUM(${pis_confis_excel}:${ipi_excel})`;
			const margin_excel = `${this.findColumnLetterByValue(this.sheet, "Margin", 1)}${row}`;
			const raw_cost_excel = `${this.findColumnLetterByValue(this.sheet, "Raw Cost", 1)}${row}`;

			// Nome do spool para cada item
			const manual_name = `manual ${index + 1}`;
			const weight = `${item["weight"]} kg`;

			this.setPipingValue(row, this.sheet, "N/A", "string");
			this.setPipingValue(
				row,
				this.sheet,
				item.partDescription,
				"string",
			);
			this.setPipingValue(row, this.sheet, manual_name, "string");
			this.setPipingValue(row, this.sheet, weight, "string");
			this.setPipingValue(
				row,
				this.sheet,
				item.breakdown?.TYPE,
				"string",
			);
			this.setPipingValue(
				row,
				this.sheet,
				Number(item.quantity),
				"string",
			);
			this.setPipingValue(row, this.sheet, item.ncm, "percentage");

			// impostos

			this.setPipingValue(
				row,
				this.sheet,
				(item.taxes?.["pis/cofins"] ?? 0) / 100,
				"percentage",
			);
			this.setPipingValue(
				row,
				this.sheet,
				(item.taxes?.["icms"] ?? 0) / 100,
				"percentage",
			);
			this.setPipingValue(
				row,
				this.sheet,
				(item.taxes?.["ipi"] ?? 0) / 100,
				"percentage",
			);

			// Cálculos de margem e impostos

			this.setPipingValue(
				row,
				this.sheet,
				item.breakdown?.LABOUR,

				// `=${raw_cost}*${this.get_cost_porcent(item["breakdown"]["LABOUR"], raw_cost)}`,
				"currency",
			);

			this.setPipingValue(row, this.sheet, item.breakdown?.MATERIALS);
			this.setPipingValue(
				row,
				this.sheet,
				item.breakdown?.["CONSUMBALES"],
				"currency",
			);
			this.setPipingValue(
				row,
				this.sheet,
				item.breakdown?.["ROAD FREIGHT"],
				"currency",
			);
			this.setPipingValue(
				row,
				this.sheet,
				item.breakdown?.["INDIRECT COST"],
				"currency",
			);
			this.setPipingValue(
				row,
				this.sheet,
				item.breakdown?.["FOOD ALLOWANCES"],
				"currency",
			);
			this.setPipingValue(
				row,
				this.sheet,
				item.breakdown?.["OTHER DIRECT COST"],
				"currency",
			);
			this.setPipingValue(
				row,
				this.sheet,
				item.breakdown?.["EXTERNAL PLANT HIRE"],
				"currency",
			);
			this.setPipingValue(
				row,
				this.sheet,
				item.breakdown?.["INSPEC TESTING TREAT"],
				"currency",
			);
			this.setPipingValue(row, this.sheet, item.basePrice, "currency");
			this.setPipingValue(
				row,
				this.sheet,
				this.margin / 100,
				"percentage",
			);
			this.setPipingValue(row, this.sheet, item.salesPrice, "currency");
			this.setPipingValue(row, this.sheet, "N/A");

			row++;
			this.col = 1;
		});
		this.write_breakdown_totals(this.sheet, row, "manual");

		// Estilização do range
		const range_start = 2;
		const range_end = row - 1;
		this.sheet.eachRow({ includeEmpty: true }, (r, rowNumber) => {
			if (rowNumber >= range_start && rowNumber <= range_end) {
				r.eachCell({ includeEmpty: true }, (cell) => {
					cell.alignment = {
						horizontal: "center",
						vertical: "middle",
					};
				});
			}
		});
	}

	private writeFinalCosting(): void {
		this.sheet = this.workbook.addWorksheet("Final Costings");
		const sheet = this.sheet;
		this.currentRow = 1;

		const final_costing_header = [
			"COMPILED BREAKDOWN",
			"Nett",
			"Margin",
			"Sell",
		];

		// Cabeçalho
		sheet.addRow(final_costing_header);
		const headerRow = sheet.getRow(this.currentRow);
		headerRow.eachCell((cell) => {
			cell.fill = {
				type: "pattern",
				pattern: "solid",
				fgColor: { argb: "D3D3D3" },
			};
			cell.border = {
				bottom: { style: "thin", color: { argb: "000000" } },
				right: { style: "thin", color: { argb: "000000" } },
			};
			cell.font = { bold: true };
		});
		headerRow.getCell(1).border = {
			...headerRow.getCell(1).border,
			left: { style: "thin", color: { argb: "000000" } },
		};

		this.currentRow++;

		const first_data_row = this.currentRow;

		const addCostingRow = (
			label: string,
			nettRef: string,
			sellRef: string,
		) => {
			const row = sheet.addRow([
				label,
				{ formula: `'${label} Breakdown'!${nettRef}` },
				this.margin / 100,
				{ formula: `'${label} Breakdown'!${sellRef}` },
			]);

			row.getCell(2).numFmt = '"R$"#,##0.00';
			row.getCell(3).numFmt = "0.00%";
			row.getCell(4).numFmt = '"R$"#,##0.00';

			row.eachCell((cell, colNumber) => {
				cell.border = {
					bottom: { style: "thin", color: { argb: "E0E0E0" } },
					right: { style: "thin", color: { argb: "E0E0E0" } },
				};
				if (colNumber === 1) {
					cell.border = {
						...cell.border,
						left: { style: "thin", color: { argb: "E0E0E0" } },
					};
				}
			});
			this.currentRow++;
		};

		// Linhas
		addCostingRow(
			"piping",
			this.finalCostRefs.piping_nett,
			this.finalCostRefs.piping_sell,
		);
		addCostingRow(
			"Loose Materials",
			this.finalCostRefs.loose_materials_nett,
			this.finalCostRefs.loose_materials_sell,
		);
		addCostingRow(
			"Manual",
			this.finalCostRefs.manual_nett,
			this.finalCostRefs.manual_sell,
		);
		addCostingRow(
			"Service",
			this.finalCostRefs.service_nett,
			this.finalCostRefs.service_sell,
		);

		// Linha de Total
		const totalRow = sheet.addRow([
			"Total:",
			{ formula: `SUM(B${first_data_row}:B${this.currentRow - 1})` },
			{
				formula: `AVERAGE(C${first_data_row}:C${this.currentRow - 1})`,
				numFmt: "0.00%",
			},
			{ formula: `SUM(D${first_data_row}:D${this.currentRow - 1})` },
		]);

		totalRow.getCell(2).numFmt = '"R$"#,##0.00';
		totalRow.getCell(4).numFmt = '"R$"#,##0.00';
		totalRow.font = { bold: true };
		totalRow.eachCell((cell, colNumber) => {
			cell.border = {
				top: { style: "thin", color: { argb: "000000" } },
				bottom: { style: "thin", color: { argb: "000000" } },
				right: { style: "thin", color: { argb: "000000" } },
			};
			if (colNumber === 1) {
				cell.border = {
					...cell.border,
					left: { style: "thin", color: { argb: "000000" } },
				};
			}
		});
		this.currentRow++;

		// Ajuste de largura
		sheet.getColumn(1).width = 25;
		sheet.getColumn(2).width = 15;
		sheet.getColumn(3).width = 10;
		sheet.getColumn(4).width = 15;
	}

	private write_breakdown_totals(
		sheet: Worksheet,
		last_row: number,
		type: string,
	): void {
		// Adiciona os rótulos
		sheet.getCell(`A${last_row + 3}`).value = "Total Base Price:";
		sheet.getCell(`A${last_row + 4}`).value = "Total Sales:";

		// Encontrar as colunas com os valores "Raw cost" e "Total Sell"
		const raw_cost_column = this.findColumnLetterByValue(
			sheet,
			"Raw Cost",
			1,
		);
		const total_sell_column = this.findColumnLetterByValue(
			sheet,
			"Total Sell",
			1,
		);

		// Adiciona as fórmulas de soma para cada coluna
		sheet.getCell(`B${last_row + 3}`).value = {
			formula: `SUM(${raw_cost_column}2:${raw_cost_column}${last_row})`,
		};
		sheet.getCell(`B${last_row + 4}`).value = {
			formula: `SUM(${total_sell_column}2:${total_sell_column}${last_row})`,
		};

		// Aplica o estilo de cabeçalho para os rótulos
		sheet.getRow(last_row + 3).getCell(1).style = this.getHeaderFormat();
		sheet.getRow(last_row + 4).getCell(1).style = this.getHeaderFormat();

		// Aplica o estilo para os valores calculados
		sheet.getRow(last_row + 3).getCell(2).style = this.getValuesFormat();
		sheet.getRow(last_row + 4).getCell(2).style = this.getValuesFormat();

		// Aplica a formatação de célula de moeda
		this.applyCellTypeFormatting(`B${last_row + 3}`, "currency");
		this.applyCellTypeFormatting(`B${last_row + 4}`, "currency");

		// Armazena as referências para os totais
		this.finalCostRefs[`${type}_nett`] = `B${last_row + 3}`;
		this.finalCostRefs[`${type}_sell`] = `B${last_row + 4}`;
	}
}
