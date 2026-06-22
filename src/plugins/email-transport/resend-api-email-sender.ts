import { readFile } from 'fs/promises';
import { basename } from 'path';

import { Logger } from '@vendure/core';
import {
    EmailDetails,
    EmailSender,
} from '@vendure/email-plugin';
import { EmailTransportOptions } from '@vendure/email-plugin/lib/src/types';
import { Resend } from 'resend';

const loggerCtx = 'ResendApiEmailSender';

export class ResendApiEmailSender implements EmailSender {
    private readonly resend: Resend;

    constructor() {
        const apiKey = process.env.RESEND_API_KEY;

        if (!apiKey) {
            throw new Error('RESEND_API_KEY is not configured');
        }

        this.resend = new Resend(apiKey);
    }

    async send(
        email: EmailDetails,
        _options: EmailTransportOptions,
    ): Promise<void> {
        try {
            const attachments = await this.mapAttachments(
                email.attachments,
            );

            const { data, error } = await this.resend.emails.send({
                from: email.from,
                to: this.parseAddresses(email.recipient),
                subject: email.subject,
                html: email.body,
                ...(email.cc
                    ? { cc: this.parseAddresses(email.cc) }
                    : {}),
                ...(email.bcc
                    ? { bcc: this.parseAddresses(email.bcc) }
                    : {}),
                ...(email.replyTo
                    ? { replyTo: email.replyTo }
                    : {}),
                ...(attachments.length > 0
                    ? { attachments }
                    : {}),
            });

            if (error) {
                throw new Error(
                    `Resend rejected the email: ${error.name} - ${error.message}`,
                );
            }

            if (!data?.id) {
                throw new Error(
                    'Resend returned success without an email ID',
                );
            }

            Logger.info(
                `Accepted by Resend | ID: ${data.id} | Recipient: ${email.recipient} | Subject: ${email.subject}`,
                loggerCtx,
            );
        } catch (error) {
            const err =
                error instanceof Error
                    ? error
                    : new Error(String(error));

            Logger.error(
                `Send failed | Recipient: ${email.recipient} | Subject: ${email.subject} | Error: ${err.message}`,
                loggerCtx,
                err.stack,
            );

            throw err;
        }
    }

    private parseAddresses(value: string): string[] {
        return value
            .split(',')
            .map(address => address.trim())
            .filter(Boolean);
    }

    private async mapAttachments(
        attachments: EmailDetails['attachments'],
    ) {
        return Promise.all(
            attachments.map(async attachment => {
                const path =
                    typeof attachment.path === 'string'
                        ? attachment.path
                        : undefined;

                const filename =
                    typeof attachment.filename === 'string'
                        ? attachment.filename
                        : path
                            ? basename(path)
                            : 'attachment';

                const contentId =
                    typeof attachment.cid === 'string'
                        ? attachment.cid
                        : undefined;

                if (path) {
                    if (/^https?:\/\//i.test(path)) {
                        return {
                            filename,
                            path,
                            ...(contentId
                                ? { contentId }
                                : {}),
                        };
                    }

                    const content = await readFile(path);

                    return {
                        filename,
                        content,
                        ...(contentId
                            ? { contentId }
                            : {}),
                    };
                }

                if (Buffer.isBuffer(attachment.content)) {
                    return {
                        filename,
                        content: attachment.content,
                        ...(contentId
                            ? { contentId }
                            : {}),
                    };
                }

                if (typeof attachment.content === 'string') {
                    const encoding =
                        attachment.encoding === 'base64'
                            ? 'base64'
                            : 'utf8';

                    return {
                        filename,
                        content: Buffer.from(
                            attachment.content,
                            encoding,
                        ),
                        ...(contentId
                            ? { contentId }
                            : {}),
                    };
                }

                throw new Error(
                    `Unsupported attachment format: ${filename}`,
                );
            }),
        );
    }
}