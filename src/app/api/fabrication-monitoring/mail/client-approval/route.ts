import options from "@/app/api/auth/[...nextauth]/options";
import { approvalMail } from "@/app/i/fabrication-monitoring/_mail/approval-mail";
import { fabApprovalMailSchema } from "@/schemas/fabrication-monitoring-approval-email";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const session = await getServerSession(options);

        const bodyForValidation = {
            ...body,

            status_changed_by: session?.user?.display_name ?? "unknown user",
            status_change_date: new Date().toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            }),
        };
        const validation = fabApprovalMailSchema.safeParse(bodyForValidation);

        if (!validation.success)
            return NextResponse.json(validation.error.format(), {
                status: 400,
            });
        const newBody = validation.data;
        try {
            await approvalMail(newBody);
            return NextResponse.json(
                { message: "Email sent successfully", body: newBody },

                { status: 200 },
            );
        } catch (error) {
            console.error("Error sending approval email:", error);
            return NextResponse.json(
                { message: "Error sending approval email", newBody },
                { status: 500 },
            );
        }
    } catch (error) {
        console.error("Error parsing request body:", error);
    }
}
