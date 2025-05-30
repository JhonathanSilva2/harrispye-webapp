import { prismaProposals } from "@/db/proposals-client";
import { BudgetLedger } from "@/model/commecial/budget-ledger";
import fs from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function POST(request: NextRequest) {
	try {
		const json = await request.json();
		const excel = new BudgetLedger(json);
		const result = excel.generateExcel();
		return NextResponse.json(
			{ message: "sucesso ao gerar JES", outputPath: result },
			{ status: 200 },
		);
	} catch (err) {
		console.error(err);
		if (err instanceof Error) {
			return NextResponse.json({ message: err.message }, { status: 500 });
		}
	}
}

export async function GET(request: NextRequest) {
	try {
		const enquiry = (await prismaProposals.erf.findMany()).map((item) => ({
			...item,
			created_by: item.created_by || "",
			acronym_number: item.acronym_number || "",
			estimated_quote_date: item.estimated_quote_date
				? item.estimated_quote_date.toISOString()
				: "",
			expected_start_date: item.expected_start_date
				? item.expected_start_date.toISOString()
				: "",
			received_date: item.received_date
				? item.received_date.toISOString()
				: "",
			estimated_quote_value: item.estimated_quote_value ?? undefined,
		}));
		if (!enquiry || enquiry.length === 0) {
			return NextResponse.json(
				{ message: "Nenhum dado encontrado" },
				{ status: 404 },
			);
		}

		const excel = new BudgetLedger(enquiry);
		const filePath = await excel.generateExcel(); // Retorna string do caminho

		const fileBuffer = new Uint8Array(await fs.readFile(filePath));

		const fileName = path.basename(filePath);

		return new Response(fileBuffer, {
			status: 200,
			headers: {
				"Content-Type":
					"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
				"Content-Disposition": `attachment; filename="${fileName}"`,
			},
		});
	} catch (err) {
		console.error(err);
		if (err instanceof Error) {
			return NextResponse.json({ message: err.message }, { status: 500 });
		}
	}
}
