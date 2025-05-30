import {
	CostingData,
	EnquiryRequestFormData,
	budget_data,
	delivery_list,
} from "@/app/api/commercial/generate-job-number/type";
import { BudgetTypes, RowData } from "@/app/i/commercial/auto-budget/types";
import { capitalizeWords } from "@/utils/capiteliza-all-words";
import { formatMoney } from "@/utils/format-currency";
import { formatDataHoje } from "@/utils/get-today";
import { moneyToWords } from "@/utils/money-to-words";
import { padZero } from "@/utils/pad-zero";
import createReport from "docx-templates";
import fs from "fs";
import path from "path";

interface BudgetItem {
	partDescription: string;
	descricaoItem: string;
	ncm: string;
	quantidade: string;
	valorUnitario: string;
	un: string;
	icms: string;
	pisCofins: string;
	ipi: string;
	valorIpiUnitario: string;
	valorUnitarioComIpi: string;
	valorUnitarioPisCofinsIcms: string;
	valorUnitarioComImpostos: string;
	deliveryTime: string;
}

type proposalType = "service" | "piping";
type service_inclusions = {
	fabrication: Array<string>;
	onshore_inclusions: Array<string>;
	general_assumptions: Array<string>;
	exclusions: Array<string>;
};

export class ProposalDocGenerator {
	// estrutura de dados
	inputJson: CostingData;
	erf: EnquiryRequestFormData;
	runningFolder: string;
	uploadFolder: string;
	stagingFolder: string;
	templatePath: string | undefined;
	proposalType: proposalType;
	service_list: {
		structure: service_inclusions;
		piping: service_inclusions;
	};

	costBreakDownPsTotals: number;

	constructor(
		inputJson: CostingData,
		runningFolder: string,
		uploadFolder: string,
		stagingFolder: string,
		proposalType: proposalType,
	) {
		this.proposalType = proposalType;
		this.inputJson = inputJson;
		this.erf = inputJson.erfData;
		this.runningFolder = runningFolder;
		this.uploadFolder = uploadFolder;
		this.stagingFolder = stagingFolder;
		this.costBreakDownPsTotals = 0;

		this.service_list = {
			structure: {
				fabrication: [
					`Avantis is going to prepare fabrication drawings for parts and submit for client’s approval.`,
					`Procurement of materials from local markets, providing a minimum of 3.1 material test certificate in accordance.`,
					`Following provided approval drawings, Fabrication to be commenced within Avantis ${this.checkData(this.erf.avantis_station)} base inside, all welding to be in accordance with Avantis approved welding procedures.`,
					`Material verification and Documentation approval (welder qualifications, approved AMSE WPS etc).`,
					`Preparation and submittal of ITPs.`,
					`Preparation and welding of new plated pieces as per welding procedures.`,
					`Detailed dimensional reporting to be carried out for all fabrication.`,
					`Conduct 100% DPI on all welds.`,
					`this.checkData(Coating system in accordance with) ${this.checkData(this.erf!.client_name)} painting specification.`,
					`Submit final quality dossier including`,
				],
				onshore_inclusions: [
					`NCM 7303.00.00, Prefabrication tax (32.50%) IPI, PIS, COFINS, ICMS.`,
					`NCM 8302.20.00, Resale  tax (29.25%) IPI, PIS, COFINS.`,
					`Detailed project schedules.`,
					`Onshore NDT + Reports: 100% DPI for pipework.`,
					`Material test certificates.`,
					`Skilled fabrication with welding in accordance weld procedures.`,
					`Tools and consumables.`,
					`Coating in accordance with latest specifications.`,
					`Detailed quality dossier.`,
				],
				general_assumptions: [
					`Databook considered approved after 14 days following submission with no response.`,
					`Proposal in accordance with Terms and Conditions from ${this.checkData(this.erf!.client_name)}.`,
				],
				exclusions: [
					`Work and materials not specified, Delays outside our control other than those stated.`,
					`ABS costs to be invoiced as a separate service under a variation order cost +15% if required.`,
					`ABS approved drawings.`,
					`Valves.`,
				],
			},
			piping: {
				fabrication: [
					`Procurement of materials from local brazilian market providing a minimum of 3.1 material test certificate in accordance to ${this.checkData(this.erf!.client_name)}`,
					`Generate new Avantis Isometrics in accordance with latest ${this.checkData(this.erf!.client_name)} procedures.`,
					`Following ${this.checkData(this.erf!.client_name)} approval of new Avantis isometrics, Fabrication of individual spools to be commenced within Avantis Macaé base inside dedicated piping workshop, all welding to be in accordance with Avantiss class approved welding procedures.`,
					`Material verification and Documentation approval (class approved WPS, welder qualifications, approved AMSE WPS etc).`,
					`Preparation and submittal of ITPs.`,
					`Preparation and welding of spool pieces as per class approved welding procedures.`,
					`ABENDI approved detailed dimensional reporting to be carried out for all spools and structural supports.`,
					`Conduct 100% DPI and 10% X-ray on all welds.`,
					`Hydro test to 1.5 x design pressure, witnessed by ABS.`,
					`Internal coating application in accordance with ${this.checkData(this.erf!.client_name)} specifications.`,
					`Preservation of each spool and packaged with wooden flange protectors and custom-built wooden pallet.`,
					`100% of spools to packaged within a custom built pallet to suit the nominal dimensions of complete batch.`,
					`Spools to be tagged and numbered in accordance with isometrics and piping list.`,
					`Spools to be strapped and secured with wooden stopers.`,
					`Only the bolts and gaskets associated to the specific PO related to the spools being delivered within the consolidated batch ➢ Batches to be distributed per PO.`,
					`PO Numbers to be explicitly stated on all items Submit final quality dossier including traceability evidence of all construction materials, hydrotesting recordings, design document data, revisions from existing system.`,
					`Dispatch of materials to ${this.checkData(this.erf!.client_name)} Rio base.`,
				],
				onshore_inclusions: [
					`Detailed method statements and project schedules`,
					`Onshore NDT + Reports: 100% DPI and 10% X-ray for pipework`,
					`Skilled fabrication with welding in accordance with class approved weld procedures`,
					`Full coat system for all prefabricated structures`,
					`Pressure testing witnessed by ABS `,
					`Fabrication process witnessed by ABS`,
					`Wooden boxes for transportation`,
					`Detailed quality dossier`,
					`ABENDI approved dimensional reports`,
					`Supply of materials with 3.1 material test certificates`,
					`Gaskets and bolts`,
				],
				general_assumptions: [
					`Databook considered approved after 14 days following submission with no response.`,
					`Proposal in accordance with Terms and Conditions from ${this.checkData(this.erf!.client_name)}.`,
				],
				exclusions: [
					`Work and materials not specified, Delays outside our control other than those stated.`,
					`ABS costs to be invoiced as a separate service under a variation order cost +15% if required.`,
					`ABS approved drawings.`,
					`Valves.`,
				],
			},
		};
	}

	async initialize() {
		const folders = await this.prepareFolders();
		this.uploadFolder = folders.uploadFolder;
		this.stagingFolder = folders.stagingFolder;
	}

	private checkData(data: string | undefined | number | null) {
		return data ? data : "N/A";
	}

	async prepareFolders(): Promise<{
		uploadFolder: string;
		stagingFolder: string;
	}> {
		const basePublic = path.join(process.cwd(), "public");
		const uploadFolder = path.join(basePublic, "commercial_uploads");
		const stagingFolder = path.join(basePublic, "staging");
		const templatePathType =
			this.proposalType === "service"
				? "service_quotation_template.docx"
				: "ps_quotation_template.docx";
		const templatePath = path.join(
			basePublic,
			"docs_tamplates",
			templatePathType,
		);
		this.templatePath = templatePath;
		// Garante que as pastas existam
		await fs.promises.mkdir(uploadFolder, { recursive: true });
		await fs.promises.mkdir(stagingFolder, { recursive: true });

		return {
			uploadFolder,
			stagingFolder,
		};
	}

	private processBudgetData(): {
		items: BudgetItem[];
	} {
		const items: BudgetItem[] = [];

		const budgetData = this.inputJson.budgetData;

		const handleItem = (
			item: RowData<BudgetTypes>,
			index: number,
			category: BudgetTypes,
		) => {
			if (category === "service") {
				return null;
			}
			let quantity = 1;
			switch (category) {
				case "manual":
					item = item as RowData<"manual">;
					quantity = item.quantity;

					break;
				case "piping":
					quantity = 1;

					break;
				case "looseMaterial":
					item = item as RowData<"looseMaterial">;
					quantity = item.numJoints;

					break;
				default:
					return null;
			}

			const unitPrice = item.revenue; //unit price sem imposto = revenue
			const valorUnitarioComImpostos = item.salesPrice;
			const pisCofinsRate = item.taxes?.["pis/cofins"] ?? 0;
			const icmsRate = item.taxes?.icms ?? 0;
			const ipiRate = item.taxes?.ipi ?? 0;
			const un = "UN";
			// impostos percent
			const ipiPercent = ipiRate / 100;
			const pisCofinsPercent = pisCofinsRate / 100;
			const icmsPercent = icmsRate / 100;
			const taxPercent = ipiPercent + pisCofinsPercent + icmsPercent;

			const valorIpiUnitario = unitPrice * ipiPercent;
			const valorUnitarioComIpi = unitPrice + valorIpiUnitario;
			const foo = unitPrice * (pisCofinsPercent + icmsPercent);
			const valorUnitarioPisCofinsIcms = unitPrice + foo;

			const validCategory = [
				"piping",
				"looseMaterial",
				"service",
				"manual",
			];
			if (validCategory.includes(category)) {
				const item = budgetData[category][index];
				const descriptions = this.getPartDescription(
					item,
					category,
					index,
				);
				if (!descriptions) return;
				const { partDescription, descricaoItem } = descriptions;
				items.push({
					partDescription,
					descricaoItem,
					ncm: "ncm" in item ? (item.ncm ?? "-") : "-",
					quantidade: String(quantity),
					valorUnitario: formatMoney(unitPrice),
					icms: icmsRate.toFixed(2),
					pisCofins: pisCofinsRate.toFixed(2),
					un,
					ipi: ipiRate.toFixed(2),
					valorIpiUnitario: formatMoney(valorIpiUnitario),
					valorUnitarioComIpi: formatMoney(valorUnitarioComIpi),
					valorUnitarioPisCofinsIcms: formatMoney(
						valorUnitarioPisCofinsIcms,
					),
					valorUnitarioComImpostos: formatMoney(
						valorUnitarioComImpostos,
					),
					deliveryTime: "-", // Sem dados fornecidos
				});
			}
		};
		const categoryArray: Array<keyof budget_data> = [
			"piping",
			"manual",
			"looseMaterial",
			"service",
		];
		for (const category of categoryArray) {
			if (budgetData[category]) {
				const isBudgetList = Array.isArray(budgetData[category]);
				if (isBudgetList) {
					const budgetList = budgetData[category];
					budgetList.forEach((list, index: number) => {
						handleItem(list, index, category);
					});
				}
			}
		}

		return {
			items,
		};
	}

	private getInformationList(InformationList: Array<string>) {
		let targetInformationList;
		if (InformationList) {
			targetInformationList = `
			<body>
				<meta charset="UTF-8">
				<ol style="font-family:Calibri;font-size:11.5pt;">
					${InformationList.map((item) => `<li>${item}</li>`).join("")}
				</ol>
			</body>
			`;
		} else {
			targetInformationList = `
			<body>
				<meta charset="UTF-8">
				<ol style="font-family:Calibri;font-size:11.5pt;">
					<li>N/A</li>
				</ol>
			</body>
		`;
		}
		return targetInformationList;
	}

	private getLabourList() {
		if (!this.inputJson.budgetData.service) return null;
		const labour_list = this.inputJson.budgetData.service
			.filter((item) => item.serviceType === "labour")
			.map((item) => item.description);
		const htmlLabourList = this.getInformationList(labour_list);
		return htmlLabourList;
	}

	private getCostBreakDownPSTable(items: BudgetItem[], totalSales: number) {
		const htmlCostBreakDownTable = `
			<meta charset="UTF-8">
			<table border="1" cellspacing="0" cellpadding="4" style="width: 100%; font-size: 5pt; font-family: Calibri, sans-serif; border-collapse: collapse;">
				<tr style="background-color: gray; font-weight: bold; text-align: center;text-color:white;">
					<th>PART DESC.</th>
					<th>ITEM DESC.</th>
					<th>NCM/SERVICE CODE-ISS</th>
					<th>UNIT</th>
					<th>QTY</th>
					<th>UNIT PRICE (EXCL. TAX)</th>
					<th>ICMS (%)</th>
					<th>PIS/COFINS (%)</th>
					<th>IPI (%)</th>
					<th>UNIT IPI VALUE</th>
					<th>UNIT PRICE WITH IPI</th>
					<th>UNIT PRICE (PIS/COFINS/ICMS)</th>
					<th>UNIT PRICE WITH ALL TAXES (INCLUDING IPI)</th>
					<th>DELIVERY TIME</th>
				</tr>
				${items
					.map(
						(row) =>
							`
				<tr style="font-size: 5pt; text-align: center;">
					<td>${row.partDescription}</td>
					<td>${row.descricaoItem}</td>
					<td>${row.ncm}</td>
					<td>${row.un}</td>
					<td>${row.quantidade}</td>
					<td>${row.valorUnitario}</td>
					<td>${row.icms}</td>
					<td>${row.pisCofins}</td>
					<td>${row.ipi}</td>
					<td>${row.valorIpiUnitario}</td>
					<td>${row.valorUnitarioComIpi}</td>
					<td>${row.valorUnitarioPisCofinsIcms}</td>
					<td>${row.valorUnitarioComImpostos}</td>
					<td>${row.deliveryTime}</td>
				</tr>
				`,
					)
					.join("")}
				<tr style="font-weight: bold; text-align: right;">
					<td colspan="12">TOTAL:</td>
					<td colspan="2" style="text-align: center">
						${formatMoney(totalSales)}
					</td>
				</tr>
			</table>
		  `;
		return htmlCostBreakDownTable;
	}

	private getCostBreakDownServiceTable(
		items: RowData<"service">[],
		total: number,
	) {
		let index = 1;

		const rows = items.flatMap((row) => {
			return Array.from({ length: row.quantity }, () => {
				const html = `
					<tr style="font-size: 5pt; text-align: center;">
						<td>${padZero(index++)}</td>
						<td>1X ${row.description} ${row.dailySalesPrice}</td>
						<td>${capitalizeWords(row.calcType)}</td>
						<td>BRL</td>
						<td>${row.days}</td>
						<td>${row.unitDailyPrice}</td>
						<td>${row.salesPrice}</td>
					</tr>
				`;
				return html;
			});
		});

		const htmlCostBreakDownTable = `
			<meta charset="UTF-8">
			<table border="1" cellspacing="0" cellpadding="4" style="width: 100%; font-size: 5pt; font-family: Calibri, sans-serif; border-collapse: collapse;">
				<tr style="background-color: gray; font-weight: bold; text-align: center;text-color:white;">
					<th>ITEM</th>
					<th>DESCRIPTION</th>
					<th>UNIT</th>
					<th>CURR</th>
					<th>QTY</th>
					<th>UNIT PRICE</th>
					<th>TOTAL PRICE</th>
				</tr>
				${rows.join("")}
				<tr style="font-weight: bold; text-align: right;">
					<td colspan="5">TOTAL:</td>
					<td colspan="2" style="text-align: center">
						${formatMoney(total)}
					</td>
				</tr>
			</table>
		`;

		return htmlCostBreakDownTable;
	}

	private getDeliveryDatesTable(deliveryDates: delivery_list) {
		const htmlDeliveriesTable = `
			<meta charset="UTF-8">
			<table border="1" cellspacing="0" cellpadding="4" style="width: 30%; font-size: 8pt; font-family: Calibri, sans-serif; border-collapse: collapse;">
				<tr style="background-color: gray; font-weight: bold; text-align: center; color: white;">
					<th style="width: 80%;">DELIVERY STEPS</th>
					<th style="width: 20%;">DAYS</th>
				</tr>
				${Object.entries(deliveryDates)
					.map(
						([key, value]) => `
				<tr style="text-align: center;">
					<td>${capitalizeWords(key.replace(/_/g, " "))}</td>
					<td>${value}</td>
				</tr>
				`,
					)
					.join("")}
			</table>
		`;
		return { htmlDeliveriesTable };
	}

	private getSummarizeLabour(services: RowData<"service">[]): {
		supervisors: number;
		workers: number;
	} {
		let supervisors = 0;
		let workers = 0;

		services.forEach((item) => {
			if (item.serviceType === "labour") {
				if (/(manager|supervisor)/i.test(item.description)) {
					supervisors += item.quantity;
				} else {
					workers += item.quantity;
				}
			}
		});

		return { supervisors, workers };
	}

	private getSalesPriceSummary = () => {
		return {
			pipingSalesPrices: this.inputJson.budgetData.piping.reduce(
				(sum, item) => sum + item.salesPrice,
				0,
			),
			looseMaterialSalesPrices:
				this.inputJson.budgetData.looseMaterial.reduce(
					(sum, item) => sum + item.salesPrice,
					0,
				),
			manualSalesPrices: this.inputJson.budgetData.manual.reduce(
				(sum, item) => sum + item.salesPrice,
				0,
			),
			serviceSalesPrices: this.inputJson.budgetData.service.reduce(
				(sum, item) => sum + item.salesPrice,
				0,
			),
		};
	};

	private prepareTemplateData() {
		const {
			pipingSalesPrices,
			looseMaterialSalesPrices,
			manualSalesPrices,
			serviceSalesPrices,
		} = this.getSalesPriceSummary();
		const { totals } = this.inputJson.budgetData;
		const totalSalesPriceWithOutService =
			totals.totalSales - serviceSalesPrices;

		const totalCost =
			this.proposalType === "service"
				? serviceSalesPrices
				: totalSalesPriceWithOutService;
		const { items } = this.processBudgetData();
		const htmlFrabricationList = this.getInformationList(
			this.service_list.piping.fabrication,
		);
		const htmlInclusionsList = this.getInformationList(
			this.service_list.piping.onshore_inclusions,
		);
		const htmlexclusionList = this.getInformationList(
			this.service_list.piping.exclusions,
		);
		const htmlGeneralAssumptionsList = this.getInformationList(
			this.service_list.piping.general_assumptions,
		);
		const costBreakDown =
			this.proposalType === "service"
				? this.getCostBreakDownServiceTable(
						this.inputJson.budgetData.service,
						serviceSalesPrices,
					)
				: this.getCostBreakDownPSTable(items, totalCost);

		const { htmlDeliveriesTable } = this.getDeliveryDatesTable(
			this.inputJson.deliveryDates,
		);

		const { supervisors, workers } = this.getSummarizeLabour(
			this.inputJson.budgetData.service,
		);

		const htmlLabourList = this.getLabourList();
		const preparedData = {
			acronym_num: this.erf!.acronym_number,
			avantis_services: this.erf!.avantis_services,
			created_by: this.checkData(this.erf!["created_by"] ?? undefined),
			client_name: this.checkData(this.erf!["client_name"]),
			client_contact_name: this.checkData(
				this.erf!["client_contact_name"],
			),
			client_email: this.checkData(this.erf!.client_email),
			invoicing_address: this.checkData(this.erf!.invoicing_address),
			avantis_station: this.checkData(this.erf!.avantis_station),
			vessel_site: this.checkData(this.erf!["vessel_site"]),
			job_number: this.checkData(
				this.erf!["acronym_number"] ?? undefined,
			),
			division: this.checkData(this.erf!["division"]),
			project_type: `${capitalizeWords(String(this.checkData(this.proposalType)))} ${String(this.checkData(this.erf!.avantis_services))}`,
			cost_breakdown: costBreakDown,
			service_list: htmlFrabricationList,
			total_cost: formatMoney(totalCost),
			total_cost_worded: moneyToWords(totalCost),
			onshore_inclusions: htmlInclusionsList,
			delivery_list: htmlDeliveriesTable,
			total_time: this.checkData(
				this.inputJson.deliveryDates.extimated_date,
			),
			payment_terms: "N/A",
			ref_document: "N/A",
			exclusion: htmlexclusionList,
			general_assumptions: htmlGeneralAssumptionsList,
			today: formatDataHoje(),
			table: items,
			revnum: 0,
			total_price: totalCost,
			supervisor_qty: supervisors,
			worker_qty: workers,
			day_qty: "", //Precisa vir do autobudget
			management_list: "N/A",
			labour_list: htmlLabourList,
		};
		return preparedData;
	}

	async generateDoc() {
		if (!this.templatePath) {
			throw new Error("template path is not defined.");
		}
		const templateBuffer = await fs.promises.readFile(this.templatePath);
		const data = this.prepareTemplateData();
		const docBuffer = await createReport({
			template: templateBuffer,
			data,
			cmdDelimiter: ["{{", "}}"],
		});
		return Buffer.from(docBuffer);
	}

	private getPartDescription(
		row: RowData<BudgetTypes>,
		category: BudgetTypes,
		index: number,
	) {
		if (category === "service") {
			return null;
		}
		let partDescription = "";
		let descricaoItem = "";
		index += 1;
		switch (category) {
			case "piping":
				const rowPiping = row as RowData<"piping">;
				partDescription = rowPiping.spec;
				descricaoItem = "SPOOL " + index;
				break;
			case "looseMaterial":
				const rowLoose = row as RowData<"looseMaterial">;
				partDescription = rowLoose.spec;
				descricaoItem = "Bolts and Gaskets " + index;
				break;
			case "manual":
				const rowManual = row as RowData<"manual">;
				partDescription = rowManual.partDescription;
				if (partDescription.toUpperCase().includes("SPOOL")) {
					descricaoItem = "SPOOL " + index;
				} else {
					descricaoItem = "Structure " + index;
				}
				break;
			default:
				partDescription = "-";
				descricaoItem = "-";
		}
		return {
			partDescription,
			descricaoItem,
		};
	}
}
