import {
    EmailDetails,
    EmailSender,
    NodemailerEmailSender,
} from '@vendure/email-plugin';
import { EmailTransportOptions } from '@vendure/email-plugin/lib/src/types';

const SENDER_BUILD = 'RESEND_SENDER_20260622_2';

export class ResendEmailSender implements EmailSender {
    private readonly inner = new NodemailerEmailSender();

    init(): void {
        console.error(
            JSON.stringify({
                marker: 'RESEND_SENDER_INITIALIZED',
                senderBuild: SENDER_BUILD,
                pid: process.pid,
                service: process.env.RAILWAY_SERVICE_NAME,
                deployment: process.env.RAILWAY_DEPLOYMENT_ID,
                replica: process.env.RAILWAY_REPLICA_ID,
                commit: process.env.RAILWAY_GIT_COMMIT_SHA,
            }),
        );
    }

    async send(
        email: EmailDetails,
        options: EmailTransportOptions,
    ): Promise<void> {
        if (email.subject.includes('[SENDER-PROBE]')) {
            throw new Error(
                `SENDER_PROBE_REACHED build=${SENDER_BUILD} pid=${process.pid} transport=${options.type}`,
            );
        }

        console.error(
            JSON.stringify({
                marker: 'RESEND_SEND_ATTEMPT',
                senderBuild: SENDER_BUILD,
                pid: process.pid,
                transport: options.type,
                recipient: email.recipient,
                subject: email.subject,
            }),
        );

        await this.inner.send(email, options);

        console.error(
            JSON.stringify({
                marker: 'RESEND_SEND_COMPLETED',
                senderBuild: SENDER_BUILD,
                pid: process.pid,
                recipient: email.recipient,
            }),
        );
    }
}