import { Injectable, NestMiddleware } from '@nestjs/common';

type RecaptchaAction = 'login' | 'register' | 'checkout';

const protectedMutations: Record<string, RecaptchaAction> = {
    login: 'login',
    validatedRegisterCustomerAccount: 'register',
    setCustomerForOrder: 'checkout',
    setOrderShippingAddress: 'checkout',
};

const thresholds: Record<RecaptchaAction, number> = {
    login: 0.5,
    register: 0.6,
    checkout: 0.5,
};

@Injectable()
export class RecaptchaProtectionMiddleware implements NestMiddleware {
    async use(req: any, res: any, next: () => void) {
        if (req.method !== 'POST') {
            return next();
        }

        const query = req.body?.query || '';
        const variables = req.body?.variables || {};
        const recaptchaToken = variables.recaptchaToken || req.body?.extensions?.recaptchaToken;

        const matchedMutation = Object.keys(protectedMutations).find((mutation) =>
            query.includes(mutation)
        );

        if (!matchedMutation) {
            return next();
        }

        const action = protectedMutations[matchedMutation];

        if (!recaptchaToken) {
            return res.status(403).json({
                errors: [{ message: 'Missing reCAPTCHA token' }],
            });
        }

        const secret = process.env.RECAPTCHA_SECRET_KEY;

        if (!secret) {
            return res.status(500).json({
                errors: [{ message: 'Missing reCAPTCHA secret key' }],
            });
        }

        const params = new URLSearchParams();
        params.append('secret', secret);
        params.append('response', recaptchaToken);

        const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            body: params,
        });

        const data = await response.json();

        if (!data.success || data.action !== action || data.score < thresholds[action]) {
            return res.status(403).json({
                errors: [{ message: 'reCAPTCHA verification failed' }],
            });
        }

        return next();
    }
}