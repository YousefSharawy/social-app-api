import { OAuth2Client } from 'google-auth-library';
import { AppError } from '../../pkg/error/error.js';
import { env } from '../config/env.js';
const client = new OAuth2Client();

export async function verifyGoogleToken(idToken:string) {
    try {
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: [`${env.google.webClientId}`],

        });
        return ticket.getPayload();
    }
    catch (err) {
        throw new AppError('Invalid Google Token', 403);
    }
}
