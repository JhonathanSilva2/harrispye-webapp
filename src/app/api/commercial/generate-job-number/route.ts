import { CommercialCompiledDAta } from "@/app/i/commercial/auto-budget/types";
import { prismaProposals } from "@/db/proposals-client";
import { JesDocGenerator } from "@/model/commecial/jes-excel-generator";
import { ProposalDocGenerator } from "@/model/commecial/proposal-doc-generator";
import assert from "assert";
import JSZip from "jszip";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import options from "../../auth/[...nextauth]/options";
import { toErfCreateInput } from "./convertErf";
import { CostingData } from "./type";

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(options);
		if (!session) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 },
			);
		}
		const body: CommercialCompiledDAta = await request.json();
		const { erfData, deliveryDates, budgetData } = body;
		if (!erfData || !deliveryDates || !budgetData) {
			return NextResponse.json(
				{ error: "Invalid data structure" },
				{ status: 400 },
			);
		}
		const transformedErf = {
			...toErfCreateInput(erfData),
		};

		const erf = await prismaProposals.erf.create({
			data: {
				...transformedErf,
				created_by: session.user.display_name,
				estimated_quote_value: budgetData.totals.totalSales,
			},
		});

		const job = await prismaProposals.job.create({
			data: {
				erf_id: erf.id,
				budget: JSON.stringify(body.budgetData, null, 4),
				delivery: JSON.stringify(body.deliveryDates, null, 4),
				status: "proposal generated",
			},
		});

		const acronym = process.env.COMPANY_ACRONYM || "JOB";

		const jobNumber = `${acronym}-${String(job.id).padStart(4, "0")}`;
		const jobUpdated = await prismaProposals.job.update({
			where: { id: job.id },
			data: { job_no: jobNumber },
		});

		if (!jobUpdated) {
			throw new Error("Failed to update job number");
		}

		const response = new FormData();
		response.append("job_no", jobNumber);

		const docsPayload = {
			...body,
			erfData: {
				...erfData,
				acronym_number: jobNumber,
			},
		} as unknown as CostingData;

		const runningFolder = process.cwd() + "/app/api/generate-proposal";
		const uploadFolder = path.join(process.cwd(), "public", "uploads");
		const stagingFolder = path.join(process.cwd(), "public", "staging");
		const files: {
			[key: string]: Buffer<ArrayBufferLike>;
		} = {};
		if (docsPayload.budgetData["service"].length > 0) {
			const serviceProposalDoc = new ProposalDocGenerator(
				docsPayload,
				runningFolder,
				uploadFolder,
				stagingFolder,
				"service",
			);
			await serviceProposalDoc.initialize(); // prepara as pastas
			const serviceProposal = await serviceProposalDoc.generateDoc();
			files[`${jobNumber} - SERVICE PROPOSAL.docx`] = serviceProposal;
		}
		const pipingProposalDoc = new ProposalDocGenerator(
			docsPayload,
			runningFolder,
			uploadFolder,
			stagingFolder,
			"piping",
		);
		await pipingProposalDoc.initialize(); // prepara as pastas

		const pipingProposal = await pipingProposalDoc.generateDoc();
		files[`${jobNumber} - PIPING PROPOSAL.docx`] = pipingProposal;

		const excel = new JesDocGenerator(docsPayload);
		const jes = await excel.generate();
		if (!jes) {
			throw new Error("Failed to generate JES file");
		}
		files[`${jobNumber} - JES.xlsx`] = jes;

		const zip = new JSZip();

		for (const [filename, blob] of Object.entries(files)) {
			zip.file(filename, blob);
		}
		const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
		return new NextResponse(new Uint8Array(zipBuffer), {
			headers: {
				"Content-Type": "application/zip",
				"Content-Disposition": `attachment; filename="${jobNumber}_docs.zip"`,
			},
		});
	} catch (error) {
		assert(error instanceof Error);
		console.error("Error in POST request:", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
