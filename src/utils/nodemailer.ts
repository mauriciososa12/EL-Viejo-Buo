import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { User } from "../interface/interfaces";
dotenv.config();

class MailManager {
  private transport;

  constructor() {
    this.transport = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      auth: {
        user: process.env.NODE_APP_EMAIL,
        pass: process.env.NODE_APP_PASSWORD,
      },
    });
  }

  send = async (user: User["email"], subject: string, text: string) => {
    const result = await this.transport.sendMail({
      from: process.env.NODE_APP_EMAIL,
      to: user,
      subject,
      text,
    });

    return result;
  };
}

const sendMail = new MailManager();

export default sendMail;
