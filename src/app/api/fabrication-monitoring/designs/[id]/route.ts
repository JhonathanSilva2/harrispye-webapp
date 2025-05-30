import { prismaBase } from "@/db/base-client";
import { serverEnv } from "@/lib/constants/config";
import assert from "assert";
import { readFileSync } from "fs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		if (!id) {
			return NextResponse.json(
				{ error: "Job ID must be provided" },
				{ status: 400 },
			);
		}
		if (Number.isNaN(parseInt(id))) {
			return NextResponse.json(
				{ error: "Invalid job ID" },
				{ status: 400 },
			);
		}
		const parsedId = parseInt(id);

		const design =
			await prismaBase.fabrication_monitoring_designs.findUnique({
				where: {
					id: parsedId,
				},
			});

		if (!design) {
			return NextResponse.json(
				{ error: "Design not found" },
				{ status: 404 },
			);
		}

		const file = readFileSync(
			`${serverEnv.STORAGE_PATH}${design.filename}`,
		);

		const headers = new Headers();
		headers.set("Content-Type", "application/octet-stream");
		headers.set(
			"Content-Disposition",
			`attachment; filename="${design.filename}"`,
		);

		return new Response(file, {
			headers,
		});
	} catch (err) {
		assert(err instanceof Error);
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		if (!id) {
			return NextResponse.json(
				{ error: "Job ID must be provided" },
				{ status: 400 },
			);
		}
		if (Number.isNaN(parseInt(id))) {
			return NextResponse.json(
				{ error: "Invalid job ID" },
				{ status: 400 },
			);
		}
		const parsedId = parseInt(id);

		const design =
			await prismaBase.fabrication_monitoring_designs.findUnique({
				where: {
					id: parsedId,
				},
			});

		if (!design) {
			return NextResponse.json(
				{ error: "Design not found" },
				{ status: 404 },
			);
		}

		await prismaBase.fabrication_monitoring_designs.delete({
			where: {
				id: parsedId,
			},
		});

		return NextResponse.json({ message: "Design deleted" });
	} catch (err) {
		assert(err instanceof Error);
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}
