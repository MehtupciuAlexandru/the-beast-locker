import { EmailSender, EmailDetails } from '@vendure/email-plugin';

export class ResendEmailSender implements EmailSender {
    async send(email: EmailDetails): Promise<void> {
        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json',
                'User-Agent': 'vendure-app/1.0',
            },
            body: JSON.stringify({
                from: email.from,
                to: email.recipient,
                subject: email.subject,
                html: email.body,
            }),
        });

        if (!res.ok) {
            const err = await res.text();
            throw new Error(`Resend API error (${res.status}): ${err}`);
        }
    }
}