import { EmailSender, EmailDetails } from '@vendure/email-plugin';
import { Injector } from '@vendure/core';
import { EmailTransportOptions } from '@vendure/email-plugin/lib/src/types';

function nowIso() {
    return new Date().toISOString();
}

export class ResendEmailSender implements EmailSender {
    init(_injector: Injector): void {
        if (!process.env.RESEND_API_KEY) {
            console.error(`[ResendEmailSender][pid:${process.pid}] WARNING: RESEND_API_KEY is not set — emails will fail`);
        } else {
            console.log(`[ResendEmailSender][pid:${process.pid}] init() — sender active`);
        }
    }

    async send(email: EmailDetails, _options: EmailTransportOptions): Promise<void> {
        const requestId = Math.random().toString(36).slice(2, 8);
        const pid = process.pid;
        const startedAt = Date.now();

        console.log(
            `[Email][${requestId}][pid:${pid}][${nowIso()}] Attempting to send to ${email.recipient}...`
        );

        const controller = new AbortController();
        const timeoutMs = 15_000;
        const timeout = setTimeout(() => {
            console.error(
                `[Email][${requestId}][pid:${pid}] TIMEOUT after ${timeoutMs}ms — aborting request to Resend.`
            );
            controller.abort();
        }, timeoutMs);

        try {
            const res = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                    'Content-Type': 'application/json',
                    'User-Agent': 'the-beast-locker/1.0',
                    // Force a brand-new TCP connection instead of reusing a
                    // possibly-stale keep-alive socket. Stale pooled sockets
                    // after idle periods are a common cause of silent fetch
                    // hangs/failures in Node containers.
                    'Connection': 'close',
                },
                body: JSON.stringify({
                    from: email.from,
                    to: email.recipient,
                    subject: email.subject,
                    html: email.body,
                }),
                signal: controller.signal,
            });

            const durationMs = Date.now() - startedAt;
            const data = await res.json();

            if (!res.ok) {
                console.error(
                    `[Email][${requestId}][pid:${pid}] Resend HTTP error (${res.status}) after ${durationMs}ms:`,
                    JSON.stringify(data)
                );
                throw new Error(`Resend failed: ${res.status} - ${JSON.stringify(data)}`);
            }

            console.log(
                `[Email][${requestId}][pid:${pid}] Successfully sent to ${email.recipient} in ${durationMs}ms. ID: ${data.id}`
            );
        } catch (error: any) {
            const durationMs = Date.now() - startedAt;
            const isAbort = error?.name === 'AbortError';
            const cause = error?.cause ? ` | cause: ${JSON.stringify(error.cause)}` : '';

            console.error(
                `[Email][${requestId}][pid:${pid}] FAILED after ${durationMs}ms ` +
                `(${isAbort ? 'TIMEOUT/ABORT — request never got a response' : 'NETWORK/OTHER'}): ${error?.message}${cause}`
            );

            throw error; // Re-throw so Vendure marks the job as failed.
        } finally {
            clearTimeout(timeout);
        }
    }
}