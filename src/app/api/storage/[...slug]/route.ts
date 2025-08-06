import { getContentType } from "@/lib/file-type/getContentType";
import { BlobServiceClient } from "@azure/storage-blob";
import assert from "assert";
import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import options from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";

/**
 *
 * Filename defaults:
 * horizontal-logo-wt-sub.svg
 * horizontal-logo.svg
 * icon-logo.svg
 * vertical-logo-wt-sub.svg
 * vertical-logo.svg
 *
 * favicon: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons#generate-icons-using-code-js-ts-tsx
 * @returns
 */

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string[] }> },
) {
    try {
        const [container, ...pathToFile] = (await params).slug;
        const filename = pathToFile.join("/");
        if (!filename) {
            return NextResponse.json(
                { error: "Filename is required" },
                { status: 400 },
            );
        }
        if (!container) {
            return NextResponse.json(
                { error: "Container is required" },
                { status: 400 },
            );
        }

        const localPath = path.join(
            process.cwd(),
            "public",
            container,
            filename,
        );
        if (container === "images") {
            try {
                const fileBuffer = readFileSync(localPath);
                let contentType = await getContentType(fileBuffer);
                if (filename.endsWith(".svg")) {
                    contentType = "image/svg+xml";
                }
                console.log("Served Locally");
                return new NextResponse(fileBuffer, {
                    headers: {
                        "Content-Type": contentType
                            ? contentType
                            : "application/octet-stream",
                        "Content-Disposition": `inline; filename="${filename}"`,
                        "Content-Length": fileBuffer.length.toString(),
                    },
                });
            } catch (error) {
                assert(error instanceof Error);
                console.log("Local image not found locally");
            }
        }

        const blobServiceClient = BlobServiceClient.fromConnectionString(
            process.env.AZURE_STORAGE_CONNECTION_STRING!,
        );
        const containerClient = blobServiceClient.getContainerClient(container);
        const blobClient = containerClient.getBlobClient(filename);

        const downloadResponse = await blobClient.downloadToBuffer();

        let contentType = await getContentType(downloadResponse);
        if (filename.endsWith(".svg")) {
            contentType = "image/svg+xml";
        }

        // if (downloadResponse.length > 0) {
        //     try {
        //         mkdirSync(path.dirname(localPath), { recursive: true });
        //         writeFileSync(localPath, downloadResponse); // downloadResponse: Buffer
        //     } catch (error) {
        //         assert(error instanceof Error);
        //         console.error("Error writing file locally:", error);
        //     }
        // }

        console.log("Image Served from Azure Storage");
        return new NextResponse(downloadResponse as BodyInit, {
            headers: {
                "Content-Type": contentType || "application/octet-stream",
                "Content-Disposition": `attachment; filename="${filename}"`,
                "Content-Length": downloadResponse.length.toString(),
            },
        });
    } catch (error) {
        assert(error instanceof Error);
        console.error("Fetch error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string[] }> },
) {
    try {
        // const session = await getServerSession(options);
        // if (!session) {
        //     return NextResponse.json(
        //         { error: "Unauthorized" },
        //         { status: 401 },
        //     );
        // }

        const [container, ...pathToFile] = (await params).slug;
        const blobServiceClient = BlobServiceClient.fromConnectionString(
            process.env.AZURE_STORAGE_CONNECTION_STRING!,
        );
        const containerClient = blobServiceClient.getContainerClient(container);
        const formData = await request.formData();
        const file = formData.get("file");
        if (!file) {
            throw new Error("No file provided");
        }
        if (!(file instanceof Blob)) {
            throw new Error("Invalid file type");
        }
        const uploadedFilename = (file as File).name || "upload";
        const filename =
            pathToFile.length > 0
                ? `${pathToFile.join("/")}/${uploadedFilename}`
                : uploadedFilename;

        // Create a BlockBlobClient for the new file
        const blockBlobClient = containerClient.getBlockBlobClient(filename);

        // Convert file to a Buffer and upload
        const buffer = Buffer.from(await file.arrayBuffer());
        await blockBlobClient.upload(buffer, buffer.length);

        const url = blockBlobClient.url;

        return NextResponse.json({ url });
    } catch (error) {
        assert(error instanceof Error);
        console.error("Upload failed:", error);
        return NextResponse.json(
            { message: "Upload failed", error: error.message },
            {
                status: 500,
            },
        );
    }
}
