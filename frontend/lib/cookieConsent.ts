"use client";

export type CookiePreferences = {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
    functional: boolean;
};

const CONSENT_COOKIE_NAME = "beast_cookie_consent";
const CONSENT_STORAGE_KEY = "cookieConsent";
const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export function necessaryCookiePreferences(): CookiePreferences {
    return {
        necessary: true,
        analytics: false,
        marketing: false,
        functional: false,
    };
}

export function readCookieConsent(): CookiePreferences | null {
    if (typeof document === "undefined") return null;

    const cookieValue = document.cookie
        .split("; ")
        .find((entry) => entry.startsWith(`${CONSENT_COOKIE_NAME}=`))
        ?.split("=")[1];

    if (!cookieValue) return null;

    try {
        return JSON.parse(decodeURIComponent(cookieValue));
    } catch {
        return null;
    }
}

export function hasNecessaryCookieConsent(): boolean {
    return readCookieConsent()?.necessary === true;
}

export function saveCookieConsent(preferences: CookiePreferences) {
    if (typeof window === "undefined") return;

    const value = encodeURIComponent(JSON.stringify(preferences));
    const secure = window.location.protocol === "https:" ? "; Secure" : "";

    document.cookie = `${CONSENT_COOKIE_NAME}=${value}; Path=/; Max-Age=${CONSENT_MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(preferences));
}

export function clearCookieConsent() {
    if (typeof window === "undefined") return;

    document.cookie = `${CONSENT_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
}
