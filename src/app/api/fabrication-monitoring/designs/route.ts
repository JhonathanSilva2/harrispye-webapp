import { TPayload } from "@/app/types";
import { prismaBase } from "@/db/base-client";
import { serverEnv } from "@/lib/constants/config";
import { getApiPagination, ValidSort } from "@/lib/pagination";
import { toWindowsEncodedFilename } from "@/utils/win-encode-filename";
import { Prisma } from "@/../prisma/generated/client-hp-base";
import assert from "assert";
import crypto from "crypto";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { z } from "zod";

// Define schema for validation
const designSchema = z
    .object({
        jobId: z.string().min(1, "Job ID must be provided"),
        file: z.any().refine((val) => {
            return (
                val &&
                typeof val === "object" &&
                "arrayBuffer" in val &&
                "size" in val &&
                "type" in val
            );
        }, "Invalid file format"),
    })
    .strict();
interface DesignFromJob {
    id: number;
    display_name: string;
    created_at: Date;
    fabrication_monitoring_jobs_id: number;
    filename: string;
}
export async function GET(
    request: NextRequest,
): Promise<NextResponse<TPayload<DesignFromJob[]>>> {
    try {
        const urlObj = new URL(request.nextUrl);
        const jobId = urlObj.searchParams.get("jobId");
        if (!jobId)
            return new NextResponse("Job ID must be provided", { status: 400 });

        if (Number.isNaN(Number(jobId)))
            return new NextResponse("Invalid job ID", { status: 400 });

        const id = parseInt(jobId);

        const validSort: ValidSort[] = [
            { key: "id", type: "number" },
            { key: "display_name", type: "string" },
            { key: "created_at", type: "date" },
        ];

        const advancedFilterKeys: ValidSort[] = [
            { key: "id", type: "string" },
            { key: "display_name", type: "string" },
            { key: "created_at", type: "date" },
        ];

        const { page, pageSize, where, skip, take, orderBy } =
            getApiPagination<Prisma.fabrication_monitoring_designsWhereUniqueInput>(
                urlObj,
                validSort,
                advancedFilterKeys,
            );

        const designs =
            await prismaBase.fabrication_monitoring_designs.findMany({
                skip,
                take,
                where: {
                    ...where,
                    fabrication_monitoring_jobs_id: id,
                },
                orderBy,
            });

        const designsCount =
            await prismaBase.fabrication_monitoring_designs.count({
                where: {
                    ...where,
                    fabrication_monitoring_jobs_id: id,
                },
            });

        const payload: TPayload<DesignFromJob[]> = {
            data: designs,
            page,
            pageSize,
            rowCount: designsCount,
        };

        return NextResponse.json(payload);
    } catch (err) {
        assert(err instanceof Error);
        return new NextResponse(err.message, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const urlObj = new URL(request.nextUrl);
        const jobId = urlObj.searchParams.get("jobId");
        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file || typeof file !== "object" || !("arrayBuffer" in file)) {
            return NextResponse.json(
                { error: "Invalid file" },
                { status: 400 },
            );
        }

        const payload = {
            jobId,
            file,
        };

        const validation = designSchema.safeParse(payload);
        if (!validation.success)
            return NextResponse.json(validation.error.format(), {
                status: 400,
            });

        const newBody = validation.data;
        const { jobId: parsedJobId, file: parsedFile } = newBody;

        if (Number.isNaN(Number(parsedJobId)))
            return NextResponse.json(
                { error: "Invalid job ID" },
                { status: 400 },
            );

        // Validate file type
        const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];
        if (!allowedTypes.includes(parsedFile.type)) {
            return NextResponse.json(
                {
                    error: "Invalid file type. Only PNG, JPG, and PDF are allowed.",
                },
                { status: 400 },
            );
        }
        const id = parseInt(parsedJobId);

        const buffer = Buffer.from(await parsedFile.arrayBuffer());
        const ext = path.extname(parsedFile.name);
        const hash = crypto.createHash("sha256").update(buffer).digest("hex");
        const filename = toWindowsEncodedFilename(hash) + ext;

        const createdDesign = {
            fabrication_monitoring_jobs_id: id,
            filename,
            display_name: parsedFile.name,
        };

        const design = await prismaBase.fabrication_monitoring_designs.create({
            data: createdDesign,
        });

        const filePath = path.join(serverEnv.STORAGE_PATH, filename);
        const dir = path.dirname(filePath);
        if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

        writeFileSync(filePath, buffer);

        return NextResponse.json(
            {
                message: "File received successfully",
            },
            {
                status: 201,
            },
        );
    } catch (err) {
        assert(err instanceof Error);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
