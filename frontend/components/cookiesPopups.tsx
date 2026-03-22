"use client";

import { useState, useEffect } from "react";

interface CookiesPopupProps {
    devMode?: boolean; // Set to true to always show banner for testing
}

export default function CookiesPopup({ devMode = false }: CookiesPopupProps) {
    const [showBanner, setShowBanner] = useState(false);
    const [showPreferences, setShowPreferences] = useState(false);
    const [preferences, setPreferences] = useState({
        necessary: true,
        analytics: false,
        marketing: false,
        functional: false,
    });

    useEffect(() => {
        // In dev mode, always show the banner
        if (devMode) {
            setTimeout(() => setShowBanner(true), 500);
            return;
        }

        // Check if user has already accepted/rejected cookies
        const cookieConsent = localStorage.getItem("cookieConsent");
        if (!cookieConsent) {
            setTimeout(() => setShowBanner(true), 500);
        }
    }, [devMode]);

    // Add keyboard shortcut to reset cookies (Alt + R)
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.altKey && e.key === 'r') {
                localStorage.removeItem("cookieConsent");
                setShowBanner(true);
                console.log("🍪 Cookie consent reset! Banner will show again.");
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

    const handleAcceptAll = () => {
        const allPreferences = {
            necessary: true,
            analytics: true,
            marketing: true,
            functional: true,
        };
        setPreferences(allPreferences);

        if (!devMode) {
            localStorage.setItem("cookieConsent", JSON.stringify(allPreferences));
        }

        setShowBanner(false);
        setShowPreferences(false);

        console.log("✅ All cookies accepted", allPreferences);
    };

    const handleSavePreferences = () => {
        if (!devMode) {
            localStorage.setItem("cookieConsent", JSON.stringify(preferences));
        }

        setShowBanner(false);
        setShowPreferences(false);

        console.log("✅ Cookie preferences saved", preferences);
    };

    const handleRejectAll = () => {
        const minimalPreferences = {
            necessary: true,
            analytics: false,
            marketing: false,
            functional: false,
        };
        setPreferences(minimalPreferences);

        if (!devMode) {
            localStorage.setItem("cookieConsent", JSON.stringify(minimalPreferences));
        }

        setShowBanner(false);
        setShowPreferences(false);

        console.log("❌ All optional cookies rejected", minimalPreferences);
    };

    if (!showBanner) return null;

    return (
        <>
            {/* Dev Mode Indicator */}
            {devMode && (
                <div className="fixed top-4 right-4 z-[100] bg-yellow-400 text-black px-3 py-2 text-xs font-bold rounded shadow-lg">
                    🧪 DEV MODE: Cookies won't save
                </div>
            )}

            {/* Bottom Banner */}
            <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
                <div className="bg-[#2c2c2c] text-white px-6 py-4 shadow-2xl">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        {/* Text */}
                        <p className="text-[13px] leading-relaxed flex-1">
                            Acest website utilizează cookies pentru a asigura cea mai bună experiență utilizatorilor.{" "}
                            <button
                                onClick={() => setShowPreferences(true)}
                                className="underline hover:text-gray-300 transition"
                            >
                                Politica de confidențialitate
                            </button>
                        </p>

                        {/* Buttons */}
                        <div className="flex gap-3 flex-shrink-0">
                            <button
                                onClick={() => setShowPreferences(true)}
                                className="px-6 py-2.5 text-[13px] font-medium text-white border border-white hover:bg-white hover:text-black transition-all uppercase tracking-wide"
                            >
                                PREFERINȚE
                            </button>
                            <button
                                onClick={handleAcceptAll}
                                className="px-6 py-2.5 text-[13px] font-medium bg-white text-black hover:bg-gray-200 transition-all uppercase tracking-wide"
                            >
                                ACCEPT
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Preferences Modal */}
            {showPreferences && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in">
                    {/* Overlay */}
                    <div
                        className="absolute inset-0 bg-black/60"
                        onClick={() => setShowPreferences(false)}
                    />

                    {/* Modal */}
                    <div className="relative bg-white w-full max-w-md max-h-[85vh] overflow-y-auto">
                        {/* Close button */}
                        <button
                            onClick={() => setShowPreferences(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl w-8 h-8 flex items-center justify-center"
                            aria-label="Close"
                        >
                            ×
                        </button>

                        {/* Content */}
                        <div className="p-8">
                            {/* Title */}
                            <h2 className="text-xl text-black font-semibold mb-6 pr-8">
                                ALEGE CE TIPURI DE COOKIES ACCEPTI SĂ FOLOSEȘTI
                            </h2>

                            {/* Cookie Options */}
                            <div className="space-y-6">
                                {/* Necessary Cookies */}
                                <div>
                                    <label className="flex items-start gap-3 cursor-not-allowed">
                                        <input
                                            type="checkbox"
                                            checked={preferences.necessary}
                                            disabled
                                            className="mt-1 w-4 h-4 accent-black cursor-not-allowed"
                                        />
                                        <div className="flex-1">
                                            <div className="font-medium text-black text-sm mb-1">
                                                Strictly Necessary Cookies
                                            </div>
                                            <p className="text-xs text-black leading-relaxed">
                                                When you visit any website, it may store or retrieve information on your
                                                browser, mostly in the form of cookies. This information might be about you,
                                                your preferences or your device and is mostly used to make the site work as
                                                you expect it to. The information does not usually directly identify you, but
                                                it can give you a more personalized web experience. Because we respect your
                                                right to privacy, you can choose not to allow some types of cookies. However,
                                                click on the different category headings to find out more and change our
                                                default settings. However, you should know that blocking some types of cookies
                                                may impact your experience of the site and the services we are able to offer.
                                            </p>
                                        </div>
                                    </label>
                                </div>

                                {/* Analytics Cookies */}
                                <div>
                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={preferences.analytics}
                                            onChange={(e) =>
                                                setPreferences({ ...preferences, analytics: e.target.checked })
                                            }
                                            className="mt-1 w-4 h-4 accent-black cursor-pointer"
                                        />
                                        <div className="flex-1">
                                            <div className="font-medium text-black text-sm mb-1">
                                                Analytics Cookies
                                            </div>
                                            <p className="text-xs text-black leading-relaxed">
                                                When you visit any website, it may store or retrieve information on your
                                                browser, mostly in the form of cookies. This information might be about you,
                                                your preferences or your device and is mostly used to make the site work as
                                                you expect it to.
                                            </p>
                                        </div>
                                    </label>
                                </div>

                                {/* Marketing Cookies */}
                                <div>
                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={preferences.marketing}
                                            onChange={(e) =>
                                                setPreferences({ ...preferences, marketing: e.target.checked })
                                            }
                                            className="mt-1 w-4 h-4 accent-black cursor-pointer"
                                        />
                                        <div className="flex-1">
                                            <div className="font-medium text-black text-sm mb-1">
                                                Marketing Cookies
                                            </div>
                                            <p className="text-xs text-black leading-relaxed">
                                                When you visit any website, it may store or retrieve information on your
                                                browser, mostly in the form of cookies. This information might be about you,
                                                your preferences or your device and is mostly used to make the site work as
                                                you expect it to.
                                            </p>
                                        </div>
                                    </label>
                                </div>

                                {/* Functional Cookies */}
                                <div>
                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={preferences.functional}
                                            onChange={(e) =>
                                                setPreferences({ ...preferences, functional: e.target.checked })
                                            }
                                            className="mt-1 w-4 h-4 accent-black cursor-pointer"
                                        />
                                        <div className="flex-1">
                                            <div className="font-medium text-black text-sm mb-1">
                                                Functional Cookies
                                            </div>
                                            <p className="text-xs text-black leading-relaxed">
                                                When you visit any website, it may store or retrieve information on your
                                                browser, mostly in the form of cookies. This information might be about you,
                                                your preferences or your device and is mostly used to make the site work as
                                                you expect it to.
                                            </p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-8 flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={handleRejectAll}
                                    className="flex-1 px-6 py-3 text-sm font-medium bg-gray-200 text-black hover:bg-gray-300 transition-all uppercase tracking-wide"
                                >
                                    NU ACCEPT ALEGEREA
                                </button>
                                <button
                                    onClick={handleSavePreferences}
                                    className="flex-1 px-6 py-3 text-sm font-medium bg-black text-white hover:bg-gray-800 transition-all uppercase tracking-wide"
                                >
                                    ACCEPTĂ TOT
                                </button>
                            </div>

                            {/* Footer Note */}
                            <p className="mt-6 text-[11px] text-black leading-relaxed">
                                *By clicking on the above button, I give my consent on collecting my IP and email ( if
                                registered ). For more check{" "}
                                <a href="#" className="underline hover:text-black">
                                    Mai multe informații
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes slide-up {
                    from {
                        transform: translateY(100%);
                    }
                    to {
                        transform: translateY(0);
                    }
                }

                @keyframes fade-in {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                .animate-slide-up {
                    animation: slide-up 0.4s ease-out;
                }

                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }
            `}</style>
        </>
    );
}

// Export a utility function to reset cookies manually
export function resetCookieConsent() {
    localStorage.removeItem("cookieConsent");
    console.log("🍪 Cookie consent has been reset!");
}

// Export a utility to check current consent
export function getCookieConsent() {
    const consent = localStorage.getItem("cookieConsent");
    return consent ? JSON.parse(consent) : null;
}