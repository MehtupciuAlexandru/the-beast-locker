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

let recaptchaScriptPromise: Promise<void> | null = null;

export async function getRecaptchaToken(action: RecaptchaAction) {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    if (!siteKey) {
        throw new Error("Missing reCAPTCHA site key");
    }

    if (typeof window === "undefined") {
        throw new Error("reCAPTCHA can only be loaded in the browser");
    }

    await loadRecaptcha(siteKey);

    await new Promise<void>((resolve) => {
        window.grecaptcha!.ready(resolve);
    });

    if (!window.grecaptcha) {
        throw new Error("reCAPTCHA failed to initialize");
    }

    return window.grecaptcha.execute(siteKey, { action });
}

function loadRecaptcha(siteKey: string) {
    if (window.grecaptcha) {
        return Promise.resolve();
    }

    if (recaptchaScriptPromise) {
        return recaptchaScriptPromise;
    }

    recaptchaScriptPromise = new Promise<void>((resolve, reject) => {
        const existingScript = document.getElementById("google-recaptcha-v3");

        if (existingScript) {
            existingScript.addEventListener("load", () => resolve(), { once: true });
            existingScript.addEventListener("error", () => reject(new Error("reCAPTCHA failed to load")), { once: true });
            return;
        }

        const script = document.createElement("script");
        script.id = "google-recaptcha-v3";
        script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("reCAPTCHA failed to load"));
        document.head.appendChild(script);
    });

    return recaptchaScriptPromise;
}
