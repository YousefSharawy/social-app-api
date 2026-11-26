import { MailjetProvider } from "../../pkg/notification/mailjet";
import  {env}  from "../config/env";

export const mailjetProvider = new MailjetProvider({
    apiKey: env.mailjet.apiKey,
    apiSecret: env.mailjet.apiSecret,
    fromEmail: env.mailjet.fromEmail,
    fromName: env.mailjet.fromName,
});