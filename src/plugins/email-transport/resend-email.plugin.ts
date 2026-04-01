import { EmailSender, EmailDetails } from '@vendure/email-plugin';

export class ResendEmailSender implements EmailSender {
    async send(email: EmailDetails): Promise<void> {
        console.log(`[Email] Attempting to send to ${email.recipient}...`);

        try {
            const res = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                    'Content-Type': 'application/json',
                    'User-Agent': 'the-beast-locker/1.0', // REQUIRED by Resend
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
                console.error('[Resend Error Response]:', JSON.stringify(data));
                throw new Error(`Resend failed: ${res.status} - ${JSON.stringify(data)}`);
            }

            console.log(`[Email] Successfully sent to ${email.recipient}. ID: ${data.id}`);
        } catch (error) {
            console.error('[Email Sender Crash]:', error);
            throw error; // Re-throw so Vendure knows the job failed
        }
    }
}