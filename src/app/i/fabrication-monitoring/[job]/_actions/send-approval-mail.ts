import { clientEnv } from "@/lib/constants/config";

export type ApprovalMailBody = {
    drawing_ref: string;
    status: "APPROVED" | "DECLINED";
    hp: string;
    client: string | null;
    spool_name: string;
    status_changed_by: number | null;
};

export const sendApprovalMail = async (data: ApprovalMailBody) => {
    try {
        await fetch(
            `${clientEnv.NEXT_PUBLIC_URL}/api/fabrication-monitoring/mail/client-approval`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            },
        );
        
    } catch (err) {
        console.error("Falha ao enviar email:", err);
    }
};
