import { serverEnv } from "@/lib/constants/config";
import { MailTemplate, MainContent } from "@/lib/mail/template";
import nodemailer from "nodemailer";

interface SendMailParams {
	mailAbout: string;
	mailContent: MainContent;
	mailTo: string;
}

export async function sendMail({
	mailAbout,
	mailContent,
	mailTo,
}: SendMailParams) {
	return new Promise((resolve, reject) => {
		const transporter = nodemailer.createTransport({
			host: serverEnv.NOREPLY_HOST,
			port: Number(serverEnv.NOREPLY_PORT), // must be converted to number because host will weirdly break otherwise
			secure: false, // true for port 465, false for other ports
			auth: {
				user: serverEnv.NOREPLY_EMAIL,
				pass: serverEnv.NOREPLY_PASSWORD,
			},
			tls: {
				ciphers: "SSLv3",
				rejectUnauthorized: false,
			},
		});

		transporter.verify(function (error) {
			if (error) {
				reject(error);
			}
		});

		const mailOptions = {
			from: serverEnv.NOREPLY_EMAIL,
			to: mailTo,
			subject: mailAbout,
			html: MailTemplate.getContent(mailAbout, mailContent),
		};

		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				reject(error);
			} else {
				resolve("Email sent: " + info.response);
			}
		});
	});
}
