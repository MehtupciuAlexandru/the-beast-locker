declare global {
    interface Window {
        grecaptcha?: {
            ready: (callback: () => void) => void;
            execute: (
                siteKey: string,
                options: { action: string }
            ) => Promise<string>;
        };
    }
}

export type RecaptchaAction = "login" | "register" | "checkout";

export async function getRecaptchaToken(action: RecaptchaAction) {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    if (!siteKey) {
        throw new Error("Missing reCAPTCHA site key");
    }

    if (typeof window === "undefined" || !window.grecaptcha) {
        throw new Error("reCAPTCHA is not loaded");
    }

    await new Promise<void>((resolve) => {
        window.grecaptcha!.ready(resolve);
    });

    return window.grecaptcha.execute(siteKey, { action });
}