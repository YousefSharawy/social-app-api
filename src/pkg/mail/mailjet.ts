import Mailjet from "node-mailjet";
import { MailProvider } from "./mail.interface";
interface IMailJetConfig {
    apiKey:string,
    apiSecret:string,
    fromName:string,
    fromEmail:string,
}
export class MailjetProvider implements MailProvider {
    private client: Mailjet;
    private fromName :string;
    private fromEmail:string;
    constructor(config:IMailJetConfig) {
        this.client = new Mailjet({
            apiKey: config.apiKey,
            apiSecret: config.apiSecret
        });
        this.fromName = config.fromName;
        this.fromEmail = config.fromEmail;
    };

    async send(email:string, subject:string , html:string){
         await this.client.post('send', { version: 'v3.1' }).request({
            Messages: [
                {
                    From: {
                        Email: this.fromEmail,
                        Name: this.fromName,
                    },
                    To: [
                        {
                            Email: email,
                        },
                    ],
                    Subject: subject,
                    HTMLPart: html,
                },
            ],
        });
    }


}
