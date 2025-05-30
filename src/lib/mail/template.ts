export type MainContent = {
	type: string;
	value: string;
	link?: string;
}[];

export class MailTemplate {
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
                    background-color: #0078d4;
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
		return MailTemplate.getHtmlTemplate(`
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
									return `<p><a href="${
										item.link || "#"
									}" class="button">${item.value}</a></p>`;
							}
						})
						.join("")}
				</div>
				<div class="footer">
					<p>
						&copy; ${new Date().getFullYear()} Azuri Technologies. All
						rights reserved.
					</p>
				</div>
			</div>
		)`);
	};
}
