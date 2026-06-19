import { EmailDetails, EmailSender, NodemailerEmailSender } from '@vendure/email-plugin';
import { EmailTransportOptions } from '@vendure/email-plugin/lib/src/types';

function nowIso() {
    return new Date().toISOString();
}

/**
 * Thin wrapper that adds console-visible logs around NodemailerEmailSender so
 * Railway shows every send attempt. NodemailerEmailSender handles the actual
 * SMTP connection to Resend (smtp.resend.com:465), so we get Nodemailer's
 * battle-tested transport with our own observability layer on top.
 */
export class ResendEmailSender implements EmailSender {
    private readonly inner = new NodemailerEmailSender();

    init(): void {
        const key = process.env.RESEND_API_KEY;
        if (!key) {
            console.error(`[EmailSender][pid:${process.pid}] WARNING: RESEND_API_KEY is not set — SMTP auth will fail`);
        } else {
            console.log(`[EmailSender][pid:${process.pid}] init() — SMTP mode active, key present (${key.slice(0, 6)}...)`);
        }
    }

    async send(email: EmailDetails, options: EmailTransportOptions): Promise<void> {
        const id = Math.random().toString(36).slice(2, 8);
        const pid = process.pid;
        console.log(`[Email][${id}][pid:${pid}][${nowIso()}] Attempting SMTP send to ${email.recipient} | subject: ${email.subject}`);

        try {
            await this.inner.send(email, options);
            console.log(`[Email][${id}][pid:${pid}] SMTP send completed for ${email.recipient}`);
        } catch (err: any) {
            console.error(`[Email][${id}][pid:${pid}] SMTP send FAILED for ${email.recipient}: ${err?.message}`);
            throw err;
        }
    }
}
