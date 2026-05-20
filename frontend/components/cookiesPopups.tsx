"use client";

import { useState, useEffect } from "react";

interface CookiesPopupProps {
    devMode?: boolean;
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
        if (devMode) {
            setTimeout(() => setShowBanner(true), 500);
            return;
        }

        const cookieConsent = localStorage.getItem("cookieConsent");
        if (!cookieConsent) {
            setTimeout(() => setShowBanner(true), 500);
        }
    }, [devMode]);

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === 'r') {
                localStorage.removeItem("cookieConsent");
                setShowBanner(true);
                console.log("Cookie consent reset! Banner will show again.");
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
            {devMode && (
                <div className="fixed top-4 right-4 z-[100] bg-yellow-400 text-black px-3 py-2 text-xs font-bold rounded shadow-lg font-Inter">
                    🧪 DEV MODE: Cookies won't save
                </div>
            )}

            <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up font-Inter">
                <div className="bg-[#2c2c2c] text-white px-6 py-4 shadow-2xl">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <p className="text-[13px] leading-relaxed flex-1">
                            Acest website utilizează cookies pentru a asigura cea mai bună experiență utilizatorilor.{" "}
                            <a
                                href="/privacy-policy"
                                className="underline cursor-pointer hover:text-gray-300 transition"
                            >
                                Politica de confidențialitate
                            </a>
                        </p>

                        <div className="flex gap-3 flex-shrink-0">
                            <button
                                onClick={() => setShowPreferences(true)}
                                className="px-6 cursor-pointer py-2.5 text-[13px] font-Inter18Semibold text-white border border-white hover:bg-white hover:text-black transition-all uppercase tracking-wide"
                            >
                                PREFERINȚE
                            </button>
                            <button
                                onClick={handleAcceptAll}
                                className="px-6 cursor-pointer py-2.5 text-[13px] font-Inter18Semibold bg-white text-black hover:bg-gray-200 transition-all uppercase tracking-wide"
                            >
                                ACCEPT
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showPreferences && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in font-Inter">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowPreferences(false)}
                    />

                    <div className="relative bg-white w-full max-w-[730px] h-full max-h-[960px] sm:max-h-[90vh] flex flex-col shadow-2xl">
                        <button
                            onClick={() => setShowPreferences(false)}
                            className="absolute top-6 right-6 text-gray-400 hover:text-black text-3xl w-8 h-8 flex items-center justify-center transition-colors z-10 font-light"
                            aria-label="Close"
                        >
                            ×
                        </button>

                        <div className="flex-1 overflow-y-auto px-8 py-10 sm:px-14 sm:py-14 flex flex-col">
                            <h2 className="text-[20px] text-[#1a1a1a] font-normal tracking-wide mb-10 pr-8 uppercase">
                                ALEGE CE TIPURI DE COOKIES ACCEPȚI SĂ FOLOSEȘTI
                            </h2>

                            <div className="space-y-8 flex-1">
                                <div className="group flex flex-col">
                                    <label className="flex items-center gap-3 cursor-not-allowed w-fit mb-3">
                                        <input
                                            type="checkbox"
                                            checked={preferences.necessary}
                                            disabled
                                            className="w-4 h-4 text-[#1a1a1a] bg-white border-gray-300 rounded-sm focus:ring-[#1a1a1a] focus:ring-2 cursor-not-allowed accent-[#1a1a1a]"
                                        />
                                        <span className="text-[14px] text-[#555555]">Strictly Necessary Cookies</span>
                                    </label>
                                    <p className="text-[13px] text-[#555555] leading-[1.8]">
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

                                <div className="group flex flex-col">
                                    <label className="flex items-center gap-3 cursor-pointer w-fit mb-3">
                                        <input
                                            type="checkbox"
                                            checked={preferences.analytics}
                                            onChange={(e) =>
                                                setPreferences({ ...preferences, analytics: e.target.checked })
                                            }
                                            className="w-4 h-4 text-[#1a1a1a] bg-white border-gray-300 rounded-sm focus:ring-[#1a1a1a] focus:ring-2 cursor-pointer accent-[#1a1a1a]"
                                        />
                                        <span className="text-[14px] text-[#555555] group-hover:text-black transition-colors">Analytics Cookies</span>
                                    </label>
                                    <p className="text-[13px] text-[#555555] leading-[1.8]">
                                        When you visit any website, it may store or retrieve information on your
                                        browser, mostly in the form of cookies. This information might be about you,
                                        your preferences or your device and is mostly used to make the site work as
                                        you expect it to.
                                    </p>
                                </div>

                                <div className="group flex flex-col">
                                    <label className="flex items-center gap-3 cursor-pointer w-fit mb-3">
                                        <input
                                            type="checkbox"
                                            checked={preferences.marketing}
                                            onChange={(e) =>
                                                setPreferences({ ...preferences, marketing: e.target.checked })
                                            }
                                            className="w-4 h-4 text-[#1a1a1a] bg-white border-gray-300 rounded-sm focus:ring-[#1a1a1a] focus:ring-2 cursor-pointer accent-[#1a1a1a]"
                                        />
                                        <span className="text-[14px] text-[#555555] group-hover:text-black transition-colors">Marketing Cookies</span>
                                    </label>
                                    <p className="text-[13px] text-[#555555] leading-[1.8]">
                                        When you visit any website, it may store or retrieve information on your
                                        browser, mostly in the form of cookies. This information might be about you,
                                        your preferences or your device and is mostly used to make the site work as
                                        you expect it to.
                                    </p>
                                </div>

                                <div className="group flex flex-col">
                                    <label className="flex items-center gap-3 cursor-pointer w-fit mb-3">
                                        <input
                                            type="checkbox"
                                            checked={preferences.functional}
                                            onChange={(e) =>
                                                setPreferences({ ...preferences, functional: e.target.checked })
                                            }
                                            className="w-4 h-4 text-[#1a1a1a] bg-white border-gray-300 rounded-sm focus:ring-[#1a1a1a] focus:ring-2 cursor-pointer accent-[#1a1a1a]"
                                        />
                                        <span className="text-[14px] text-[#555555] group-hover:text-black transition-colors">Functional Cookies</span>
                                    </label>
                                    <p className="text-[13px] text-[#555555] leading-[1.8]">
                                        When you visit any website, it may store or retrieve information on your
                                        browser, mostly in the form of cookies. This information might be about you,
                                        your preferences or your device and is mostly used to make the site work as
                                        you expect it to.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-12 flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={handleSavePreferences}
                                    className="flex-1 py-4 px-6 text-[12px] sm:text-[13px] font-Inter18Semibold bg-[#1a1a1a] text-white hover:bg-black transition-all uppercase tracking-widest text-center"
                                >
                                    SALVEAZĂ ALEGERILE
                                </button>
                                <button
                                    onClick={handleAcceptAll}
                                    className="flex-1 py-4 px-6 text-[12px] sm:text-[13px] font-Inter18Semibold bg-[#1a1a1a] text-white hover:bg-black transition-all uppercase tracking-widest text-center"
                                >
                                    ACCEPTĂ TOT
                                </button>
                            </div>

                            <p className="mt-6 text-[13px] text-[#555555] leading-relaxed">
                                *By clicking on the above buttons, I give my consent on collecting my IP and email ( if
                                registered ). For more check{" "}
                                <a href="/privacy-policy" className="underline hover:text-black transition-colors">
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

export function resetCookieConsent() {
    localStorage.removeItem("cookieConsent");
    console.log("🍪 Cookie consent has been reset!");
}

export function getCookieConsent() {
    const consent = localStorage.getItem("cookieConsent");
    return consent ? JSON.parse(consent) : null;
}