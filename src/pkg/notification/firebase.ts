import admin, { App, cert } from "firebase-admin";
import { getMessaging , Message } from "firebase-admin/messaging";
import { INotificationProvider } from "./notification.interface";

export class FirebasseProvider implements INotificationProvider {
    private readonly client : App;
    constructor(config:any) {
        this.client = admin.initializeApp({
        credential:cert(config)
        });
    }

    async send(to: string, title: string, body: string): Promise<void> {
        const message : Message = {
            token:to, 
            notification:{
                title,
                body
            },
        };
        getMessaging(this.client).send(message);

    }

}