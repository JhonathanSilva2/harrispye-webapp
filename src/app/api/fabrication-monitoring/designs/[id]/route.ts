import options from "@/app/api/auth/[...nextauth]/options";
import { prismaBase } from "@/db/base-client";
import AuthClient from "@/infra/auth-client";
import { serverEnv } from "@/lib/constants/config";
import assert from "assert";
import { readFileSync } from "fs";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        if (!id) {
            return NextResponse.json(
                { error: "Design ID must be provided" },
                { status: 400 },
            );
        }
        if (Number.isNaN(parseInt(id))) {
            return NextResponse.json(
                { error: "Invalid Design ID" },
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

        const fetchFile = await fetch(
            `${serverEnv.NEXT_PUBLIC_URL}/api/storage/fabrication-monitoring/drawings/${design.filename}`,
        );

        if (!fetchFile.ok) {
            return NextResponse.json(
                { error: "File not found" },
                { status: 404 },
            );
        }

        const file = await fetchFile.arrayBuffer();

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
        const session = await getServerSession(options);
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }
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

        const deleteDrawing = await prismaBase.$transaction(async (tx) => {
            const deleteRelations = await tx.fabrication_monitoring.updateMany({
                where: {
                    fabrication_monitoring_design_id: parsedId,
                },
                data: {
                    fabrication_monitoring_design_id: undefined,
                    updated_by: session.user.hp_registration,
                },
            });

            const deletedDesign =
                await tx.fabrication_monitoring_designs.delete({
                    where: {
                        id: parsedId,
                    },
                });

            const deleteFileStorageResponse = await AuthClient(
                `${serverEnv.NEXT_PUBLIC_URL}/api/storage/fabrication-monitoring/drawings/${design.filename}`,
                {
                    method: "DELETE",
                },
            );

            if (!deleteFileStorageResponse.ok) {
                throw new Error(
                    deleteFileStorageResponse.message ||
                        "Failed to delete file from storage",
                );
            }
        });

        return NextResponse.json({ message: "Design deleted" });
    } catch (err) {
        assert(err instanceof Error);
        console.error("Error deleting design:", err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
