import {
    EmailDetails,
    EmailSender,
    NodemailerEmailSender,
} from '@vendure/email-plugin';
import { EmailTransportOptions } from '@vendure/email-plugin/lib/src/types';

const SENDER_BUILD = 'RESEND_SENDER_PROBE_20260622';

export class ResendEmailSender implements EmailSender {
    private readonly inner = new NodemailerEmailSender();

    init(): void {
        console.error(
            `[RESEND_SENDER_INIT] ${JSON.stringify({
                senderBuild: SENDER_BUILD,
                pid: process.pid,
                service: process.env.RAILWAY_SERVICE_NAME,
                deployment: process.env.RAILWAY_DEPLOYMENT_ID,
                replica: process.env.RAILWAY_REPLICA_ID,
                commit: process.env.RAILWAY_GIT_COMMIT_SHA,
                keyPresent: Boolean(process.env.RESEND_API_KEY),
            })}`,
        );
    }

    async send(
        email: EmailDetails,
        options: EmailTransportOptions,
    ): Promise<void> {
        console.error(
            `[RESEND_SENDER_REACHED] ${JSON.stringify({
                senderBuild: SENDER_BUILD,
                pid: process.pid,
                recipient: email.recipient,
                subject: email.subject,
                transport: options.type,
            })}`,
        );

        if (email.subject.includes('[SENDER-PROBE]')) {
            throw new Error(
                `SENDER_PROBE_REACHED build=${SENDER_BUILD} pid=${process.pid} transport=${options.type}`,
            );
        }

        try {
            await this.inner.send(email, options);

            console.error(
                `[RESEND_SEND_COMPLETED] ${JSON.stringify({
                    senderBuild: SENDER_BUILD,
                    pid: process.pid,
                    recipient: email.recipient,
                })}`,
            );
        } catch (error) {
            const err =
                error instanceof Error
                    ? error
                    : new Error(String(error));

            console.error(
                `[RESEND_SEND_FAILED] ${JSON.stringify({
                    senderBuild: SENDER_BUILD,
                    pid: process.pid,
                    recipient: email.recipient,
                    error: err.message,
                    stack: err.stack,
                })}`,
            );

            throw err;
        }
    }
}