import { sendMail } from "@/lib/mail/send-email";
import { fabApprovalMailSchema } from "@/schemas/fabrication-monitoring-approval-email";
import { z } from "zod";

export async function approvalMail(
    data: z.infer<typeof fabApprovalMailSchema>,
) {
    const isApproved = data.status === "APPROVED";
    const statusNames = {
        statusBy: isApproved ? "Approved by:" : "Rejected by:",
        statusDate: isApproved ? "Approval Date:" : "Rejection Date:",
    };
    const mailTo = process.env.PROJECTS_BRAZIL_EMAIL as string;
    const mailContent = [
        {
            type: "text",
            value: "Hello,",
        },
        {
            type: "text",
            value: "This is a confirmation email regarding a rejected spool. Here are the details:",
        },
        {
            type: "table",
            table: {
                lateralHeader: true,
                headers: [
                    "HP:",
                    "Client:",
                    "Spool:",
                    "Isometric Drawing:",
                    "Status:",
                    "Changed By:",
                    "Change Date:",
                ],
                rows: [
                    ["HP:", data.hp],
                    ["Client:", data.client],
                    ["Spool:", data.spool_name],
                    ["Isometric Drawing:", data.drawing_ref],
                    [
                        "Status:",
                        {
                            value: data.status,
                            style: `color:${isApproved ? "#5ca55c" : "#bb3f3f"}; font-weight:bold;`,
                        },
                    ],
                    [statusNames.statusBy, data.status_changed_by],
                    [statusNames.statusDate, data.status_change_date],
                ],
            },
        },
    ];

    const mailAbout = `${data.hp} - ${data.spool_name} ${data.status} BY ${data.client} `;

    const responseMail = sendMail({
        mailAbout,
        mailContent,
        mailTo: mailTo,
    });
    return responseMail;
}
