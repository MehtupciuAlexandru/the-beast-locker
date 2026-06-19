import { Logger } from '@vendure/core';
import { EmailSender, EmailDetails } from '@vendure/email-plugin';

const loggerCtx = 'ResendEmailSender';

export class ResendEmailSender implements EmailSender {
    async send(email: EmailDetails): Promise<void> {
        Logger.info(
            JSON.stringify({
                pid: process.pid,
                recipient: email.recipient,
                subject: email.subject,
            }),
            loggerCtx,
        );

        try {
            const res = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
                    'Content-Type': 'application/json',
                    'User-Agent': 'the-beast-locker/1.0',
                },
                body: JSON.stringify({
                    from: email.from,
                    to: email.recipient,
                    subject: email.subject,
                    html: email.body,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                Logger.error(JSON.stringify(data), loggerCtx);
                throw new Error(`Resend failed: ${res.status} - ${JSON.stringify(data)}`);
            }

            Logger.info(
                JSON.stringify({
                    pid: process.pid,
                    recipient: email.recipient,
                    subject: email.subject,
                    resendId: data.id,
                }),
                loggerCtx,
            );
        } catch (error) {
            Logger.error(
                error instanceof Error ? error.stack || error.message : String(error),
                loggerCtx,
            );
            throw error;
        }
    }
}