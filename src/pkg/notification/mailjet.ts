import Mailjet from "node-mailjet";
import { INotificationProvider } from "./notification.interface";
interface IMailJetConfig {
    apiKey:string,
    apiSecret:string,
    fromName:string,
    fromEmail:string,
}
export class MailjetProvider implements INotificationProvider {
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

    async send(to:string, title:string , body:string){
         await this.client.post('send', { version: 'v3.1' }).request({
            Messages: [
                {
                    From: {
                        Email: this.fromEmail,
                        Name: this.fromName,
                    },
                    To: [
                        {
                            Email: to,
                        },
                    ],
                    Subject: title,
                    HTMLPart: body,
                },
            ],
        });
    }


}
