import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve("config/.env") });
import nodemailer from "nodemailer";

//================================================

export const sendEmail = async (to, subject, html, attachments = []) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.userSender,
      pass: process.env.passSender,
    },
  });

  const info = await transporter.sendMail({
    from: `" abdo 👻"<${process.env.userSender}>`,
    to: to ? to : "",
    subject: subject ? subject : " hi ",
    html: html ? html : "hello ",
    attachments,
  });

  if (info.accepted.length) {
    return true;
  } else {
    return false;
  }
};
