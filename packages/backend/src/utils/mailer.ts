import nodemailer from "nodemailer";
import { config } from "../config";

export const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: Number(config.smtp.port),
  auth: {
    user: config.smtp.user,
    pass: config.smtp.password,
  },
});

export async function sendMail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  return transporter.sendMail({
    from: config.smtp.user,
    to,
    subject,
    html,
  });
}
