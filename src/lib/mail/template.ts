export type TableCell = {
    value: string;
    style?: string;
};

export type TableContent = {
    lateralHeader?: boolean;
    headers: (string | TableCell)[];
    rows: (string | TableCell)[][];
};

export type MainContent = {
    type: string;
    value?: string;
    link?: string;
    table?: TableContent;
}[];

export class MailTemplate {
    private static renderTable(table: TableContent) {
        const { headers, rows, lateralHeader } = table;

        if (lateralHeader) {
            return `
                <table style="width:100%; border-collapse: collapse; margin-top: 20px;">
                   ${rows
                       .map((row) => {
                           const [headerCell, valueCell] = row;

                           const header =
                               typeof headerCell === "string"
                                   ? headerCell
                                   : headerCell.value;

                           const value =
                               typeof valueCell === "string"
                                   ? valueCell
                                   : (valueCell.value ?? "");

                           const valueStyle =
                               typeof valueCell === "string"
                                   ? ""
                                   : valueCell.style || "";

                           return `
                            <tr>
                                <td style="background-color:#f0f0f0; font-weight:bold; width:40%; padding:8px 12px; border:1px solid #dddddd; vertical-align:top;">
                                    ${header}
                                </td>
                                <td style="padding:8px 12px; border:1px solid #dddddd; vertical-align:top; ${valueStyle}">
                                    ${value}
                                </td>
                            </tr>
                        `;
                       })
                       .join("")}
            </table>
        `;
        } else {
            return `
            <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width:100%; margin-top:20px;">
                <thead>
                    <tr>
                     ${headers
                         .map((h) => {
                             const hValue = typeof h === "string" ? h : h.value;
                             const hStyle =
                                 typeof h === "string" ? "" : h.style || "";
                             return `<th style="background-color:#0078d4;color:#fff; padding:8px; ${hStyle}">${hValue}</th>`;
                         })
                         .join("")}
                    </tr>
                </thead>
                <tbody>
                    ${rows
                        .map(
                            (row) =>
                                `<tr>${row
                                    .map((cell) => {
                                        const cellValue =
                                            typeof cell === "string"
                                                ? cell
                                                : cell.value;
                                        const cellStyle =
                                            typeof cell === "string"
                                                ? ""
                                                : cell.style || "";
                                        return `<td style="padding:8px; border:1px solid #dddddd; ${cellStyle}">${cellValue}</td>`;
                                    })
                                    .join("")}</tr>`,
                        )
                        .join("")}
                </tbody>
            </table>
        `;
        }
    }

    public static getHtmlTemplate = (content: string) => {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    padding: 20px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                    background-color:#6f7273;
                    color: #ffffff;
                    padding: 10px 0;
                    text-align: center;
                }
                .content {
                    margin: 20px 0;
                }
                .button {
                    display: inline-block;
                    padding: 10px 20px;
                    font-size: 16px;
                    color: #ffffff;
                    background-color: #0078d4;
                    text-decoration: none;
                    border-radius: 5px;
                }
                .footer {
                    margin-top: 20px;
                    text-align: center;
                    color: #888888;
                    font-size: 12px;
                }
            </style>
        </head>
        <body>
            ${content}
        </body>
        </html>
        `;
    };

    public static getContent = (title: string, mailContent: MainContent) => {
        const htmlTemplate = `
			<div class="container">
				<div class="header">
					<h1>${title}</h1>
				</div>
				<div class="content">
                    ${mailContent
                        .map((item) => {
                            switch (item.type) {
                                case "text":
                                    return `<p>${item.value}</p>`;
                                case "button":
                                    return `<p><a href="${item.link || "#"}" class="button">${item.value}</a></p>`;
                                case "table":
                                    return item.table
                                        ? this.renderTable(item.table)
                                        : "";
                                default:
                                    return "";
                            }
                        })
                        .join("")}
				</div>
				<div class="footer">
                    <p>
						Best Regards
					</p>
					<p>
					    Your Harris Pye Development Team.
					</p>
				</div>
			</div>
        `;

        return MailTemplate.getHtmlTemplate(htmlTemplate);
    };
}
