import { Resend } from 'resend';

export function createResendTransport(apiKey: string | undefined) {
    if (!apiKey) {
        return {
            name: 'resend',
            version: '1.0.0',
            send: async (mail: any, callback: any) => {
                callback(new Error('Resend API key not configured'));
            }
        };
    }

    const resend = new Resend(apiKey);

    return {
        name: 'resend',
        version: '1.0.0',
        send: async (mail: any, callback: any) => {
            try {
                const result = await resend.emails.send({
                    from: mail.data.from,
                    to: mail.data.to,
                    subject: mail.data.subject,
                    html: mail.data.html,
                });

                console.log('Email sent via Resend:', result);

                if (result.error) {
                    callback(result.error);
                } else {
                    callback(null, { messageId: result.data?.id });
                }
            } catch (error) {
                console.error(' Resend email error:', error);
                callback(error);
            }
        }
    };
}