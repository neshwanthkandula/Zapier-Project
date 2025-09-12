// import nodemailer from "nodemailer";
import "dotenv/config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function sendEmail(to: string, body: string) {
  console.log("nodemailer send mail")
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Test Email",
    text: body
  });
}