type RecaptchaAction = "login" | "register" | "checkout";

const thresholds: Record<RecaptchaAction, number> = {
    login: 0.5,
    register: 0.6,
    checkout: 0.5,
};

export async function verifyRecaptcha(token: string, action: RecaptchaAction) {
    const secret = process.env.RECAPTCHA_SECRET_KEY;

    if (!secret) {
        throw new Error("Missing reCAPTCHA secret key");
    }

    if (!token) {
        return {
            success: false,
            message: "Missing reCAPTCHA token",
        };
    }

    const params = new URLSearchParams();
    params.append("secret", secret);
    params.append("response", token);

    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        body: params,
        cache: "no-store",
    });

    const data = await response.json();

    if (!data.success) {
        return {
            success: false,
            message: "reCAPTCHA verification failed",
        };
    }

    if (data.action !== action) {
        return {
            success: false,
            message: "Invalid reCAPTCHA action",
        };
    }

    if (typeof data.score !== "number" || data.score < thresholds[action]) {
        return {
            success: false,
            message: "Suspicious request detected",
        };
    }

    return {
        success: true,
        score: data.score,
    };
}