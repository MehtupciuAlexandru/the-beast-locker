import {
    EmailDetails,
    EmailSender,
    NodemailerEmailSender,
} from '@vendure/email-plugin';
import { EmailTransportOptions } from '@vendure/email-plugin/lib/src/types';

const SENDER_BUILD = 'RESEND_SENDER_DIAGNOSTICS_20260622';

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
        const sendId = crypto.randomUUID();
        const startedAt = Date.now();

        console.error(
            `[RESEND_SEND_ATTEMPT] ${JSON.stringify({
                sendId,
                senderBuild: SENDER_BUILD,
                pid: process.pid,
                recipient: email.recipient,
                subject: email.subject,
                transport: options.type,
                smtpHost:
                    options.type === 'smtp'
                        ? options.host
                        : undefined,
                smtpPort:
                    options.type === 'smtp'
                        ? options.port
                        : undefined,
                secure:
                    options.type === 'smtp'
                        ? options.secure
                        : undefined,
                timestamp: new Date().toISOString(),
            })}`,
        );

        if (options.type !== 'smtp') {
            throw new Error(
                `Unexpected email transport: ${options.type}`,
            );
        }

        try {
            await this.inner.send(email, options);

            console.error(
                `[RESEND_SEND_SUCCESS] ${JSON.stringify({
                    sendId,
                    senderBuild: SENDER_BUILD,
                    pid: process.pid,
                    recipient: email.recipient,
                    durationMs: Date.now() - startedAt,
                    timestamp: new Date().toISOString(),
                })}`,
            );
        } catch (error) {
            const err =
                error instanceof Error
                    ? error
                    : new Error(String(error));

            const smtpError = error as {
                code?: string;
                command?: string;
                response?: string;
                responseCode?: number;
                errno?: string | number;
                syscall?: string;
                address?: string;
                port?: number;
            };

            console.error(
                `[RESEND_SEND_FAILED] ${JSON.stringify({
                    sendId,
                    senderBuild: SENDER_BUILD,
                    pid: process.pid,
                    recipient: email.recipient,
                    durationMs: Date.now() - startedAt,
                    errorName: err.name,
                    errorMessage: err.message,
                    code: smtpError.code,
                    command: smtpError.command,
                    response: smtpError.response,
                    responseCode: smtpError.responseCode,
                    errno: smtpError.errno,
                    syscall: smtpError.syscall,
                    address: smtpError.address,
                    port: smtpError.port,
                    stack: err.stack,
                    timestamp: new Date().toISOString(),
                })}`,
            );

            throw err;
        }
    }
}