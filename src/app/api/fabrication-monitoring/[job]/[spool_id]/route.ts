import { fabrication_monitoring } from "@/../prisma/generated/client-hp-base";
import options from "@/app/api/auth/[...nextauth]/options";
import { approvalMail } from "@/app/i/fabrication-monitoring/_mail/approval-mail";
import { prismaBase } from "@/db/base-client";
import { fabricationMonitoringUpdateSpoolSchema } from "@/schemas/fabrication-monitoring-spool";
import assert from "assert";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export interface FabricationMonitoringSpoolFetchReturn {
    spool: fabrication_monitoring;
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ job: string; spool_id: string }> },
) {
    const session = await getServerSession(options);
    const updated_by = session?.user.hp_registration;
    if (!updated_by) {
        return NextResponse.json(
            { message: "User not found" },
            { status: 400 },
        );
    }
    try {
        const spoolID = (await params).spool_id;
        if (!spoolID) {
            return new NextResponse("Spool_id param not found", {
                status: 404,
            });
        }

        const spool = await prismaBase.fabrication_monitoring.findUnique({
            where: { id: Number(spoolID) },
            include: {
                fabrication_monitoring_jobs: true,
            },
        });

        if (!spool) {
            return new NextResponse("Spool not found", { status: 404 });
        }

        const body = await request.json();
        if (Object.keys(body).length === 0) {
            return new NextResponse("At least one field must be provided", {
                status: 400,
            });
        }

        if (Object.keys(body).length === 1 && body.id) {
            return new NextResponse("ID cannot be updated", { status: 400 });
        }

        const validation =
            fabricationMonitoringUpdateSpoolSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { errors: validation.error.format() },
                { status: 400 },
            );
        }

        const newBody = validation.data;

        const clientApproval = newBody.client_approval;
        if (clientApproval && clientApproval !== "PENDING") {
            const bodyForValidation = {
                hp: spool.fabrication_monitoring_jobs.hp,
                client: spool.fabrication_monitoring_jobs.client,
                spool_name: spool.spool_number ?? "Not informed",
                drawing_ref: spool.drawing_ref ?? "Not informed",
                status: clientApproval,
                status_changed_by: session.user.display_name,
                status_change_date: new Date().toLocaleString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                }),
            };
            await approvalMail(bodyForValidation);
        }

        const updateSpool = await prismaBase.fabrication_monitoring.update({
            where: { id: spool.id },
            data: {
                ...newBody,
                updated_by,
            },
            select: { id: true },
        });

        return NextResponse.json(updateSpool, {
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        assert(err instanceof Error);
        return new NextResponse(err.message, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ spool_id: string }> },
) {
    try {
        const session = await getServerSession(options);
        if (!session || !session.user.hp_registration) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const resolvedParams = await params;
        const spool_id = resolvedParams.spool_id;
        if (!spool_id) {
            return new NextResponse("Spool_id not found", { status: 404 });
        }
        const spoolToDelete =
            await prismaBase!.fabrication_monitoring.findUnique({
                where: {
                    id: Number(spool_id),
                    updated_by: session.user.hp_registration,
                },
            });
        if (!spoolToDelete) {
            return new NextResponse("Spool not found", { status: 404 });
        }

        await prismaBase.fabrication_monitoring.delete({
            where: { id: spoolToDelete.id },
        });

        return new NextResponse(
            JSON.stringify({ message: "Spool deleted successfully" }),
            { status: 200 },
        );
    } catch (err) {
        assert(err instanceof Error);
        console.log(err.message);
        return new NextResponse(err.message, { status: 500 });
    }
}
