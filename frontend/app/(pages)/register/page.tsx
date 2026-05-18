"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { register } from "@/lib/api/auth";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/footer";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [acceptedPrivacyPolicy, setAcceptedPrivacyPolicy] = useState(false);
    const [acceptedCookies, setAcceptedCookies] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setAcceptedCookies(hasAcceptedNecessaryCookies());
    }, []);

    const hasAcceptedNecessaryCookies = () => {
        if (typeof window === "undefined") return false;

        const consent = localStorage.getItem("cookieConsent");

        if (!consent) return false;

        try {
            const parsedConsent = JSON.parse(consent);
            return parsedConsent.necessary === true;
        } catch {
            return false;
        }
    };

    const handleCookieCheckboxChange = (checked: boolean) => {
        setAcceptedCookies(checked);

        if (checked) {
            const allPreferences = {
                necessary: true,
                analytics: true,
                marketing: true,
                functional: true,
            };

            localStorage.setItem("cookieConsent", JSON.stringify(allPreferences));
        } else {
            localStorage.removeItem("cookieConsent");
        }
    };

    const handleSubmit = async () => {
        setError("");

        if (!hasAcceptedNecessaryCookies()) {
            setError("Trebuie să accepți cookie-urile necesare înainte de a crea un cont.");
            return;
        }

        if (!acceptedPrivacyPolicy) {
            setError("Trebuie să accepți politica de confidențialitate înainte de a crea un cont.");
            return;
        }

        setLoading(true);

        try {
            await register(email, password, firstName, lastName);
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />

            <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 bg-white text-black">
                {!success ? (
                    <div className="w-full max-w-md flex flex-col gap-4">
                        <h1 className="text-2xl text-center">Înregistrare</h1>

                        <p className="text-center text-gray-500 text-sm">
                            Completați datele dumneavoastră mai jos:
                        </p>

                        <input
                            type="text"
                            placeholder="Nume"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="border p-3 w-full"
                        />

                        <input
                            type="text"
                            placeholder="Prenume"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="border p-3 w-full"
                        />

                        <input
                            type="email"
                            placeholder="E-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border p-3 w-full"
                        />

                        <div className="relative w-full">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Parolă"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="border p-3 w-full pr-12"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600 cursor-pointer"
                            >
                                {showPassword ? "Ascunde" : "Arată"}
                            </button>
                        </div>

                        <label className="flex items-start gap-3 text-sm text-gray-700 leading-relaxed cursor-pointer">
                            <input
                                type="checkbox"
                                checked={acceptedCookies}
                                onChange={(e) => handleCookieCheckboxChange(e.target.checked)}
                                className="mt-1 w-4 h-4 accent-black cursor-pointer"
                            />

                            <span>
                                Accept toate cookie-urile necesare pentru funcționarea website-ului și pentru crearea contului.
                            </span>
                        </label>

                        <label className="flex items-start gap-3 text-sm text-gray-700 leading-relaxed cursor-pointer">
                            <input
                                type="checkbox"
                                checked={acceptedPrivacyPolicy}
                                onChange={(e) => setAcceptedPrivacyPolicy(e.target.checked)}
                                className="mt-1 w-4 h-4 accent-black cursor-pointer"
                            />

                            <span>
                                Sunt de acord cu{" "}
                                <Link
                                    href="/privacy-policy"
                                    className="underline text-black hover:opacity-70 cursor-pointer"
                                >
                                    Politica de confidențialitate
                                </Link>{" "}
                                și cu prelucrarea datelor necesare pentru crearea contului.
                            </span>
                        </label>

                        {error && (
                            <p className="text-red-500 text-sm text-center">
                                {error}
                            </p>
                        )}

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-black text-white py-3 mt-2 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {loading ? "Se procesează..." : "CREEAZĂ CONTUL"}
                        </button>
                    </div>
                ) : (
                    <div className="text-center flex flex-col gap-4">
                        <h2 className="text-xl font-semibold">
                            Cont creat cu succes!
                        </h2>

                        <p className="text-gray-600">
                            Verificați email-ul pentru activarea contului.
                        </p>

                        <button
                            onClick={() => router.push("/login")}
                            className="bg-black text-white py-3 px-6 mt-4 cursor-pointer"
                        >
                            Mergi la login
                        </button>
                    </div>
                )}
            </div>

            <Footer />
        </>
    );
}