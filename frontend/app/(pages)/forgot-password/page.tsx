"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/footer";
import { forgotPassword } from "@/lib/api/auth";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const isValidEmail = (value: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    };

    const handleSubmit = async () => {
        setError("");

        const trimmedEmail = email.trim();

        if (!trimmedEmail) {
            setError("Introduceți adresa de email.");
            return;
        }

        if (!isValidEmail(trimmedEmail)) {
            setError("Introduceți o adresă de email validă.");
            return;
        }

        setLoading(true);

        try {
            await forgotPassword(trimmedEmail);
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || "A apărut o eroare. Încearcă din nou.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />

            <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 bg-white text-[#1c1c1e] font-Inter18Semibold">
                {!success ? (
                    <div className="w-full max-w-md flex flex-col gap-4">
                        <h1 className="text-2xl text-center">
                            Ai uitat parola?
                        </h1>

                        <p className="text-center text-gray-500 text-sm">
                            Introdu adresa de email asociată contului tău și îți vom trimite un link pentru resetarea parolei.
                        </p>

                        <input
                            type="email"
                            placeholder="E-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border p-3 w-full"
                        />

                        {error && (
                            <p className="text-red-500 text-sm text-center">
                                {error}
                            </p>
                        )}

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-[#1c1c1e] font-Inter18Semibold text-white py-3 mt-2 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {loading ? "Se procesează..." : "TRIMITE LINK DE RESETARE"}
                        </button>

                        <p className="text-center text-sm text-gray-600 mt-4">
                            Ți-ai amintit parola?{" "}
                            <Link
                                href="/login"
                                className="underline text-black hover:opacity-70 cursor-pointer"
                            >
                                Înapoi la autentificare
                            </Link>
                        </p>
                    </div>
                ) : (
                    <div className="text-center flex flex-col gap-4 max-w-md">
                        <h2 className="text-xl font-Inter18Semibold">
                            Verifică email-ul
                        </h2>

                        <p className="text-gray-600 font-Inter18Semibold">
                            Dacă există un cont asociat cu această adresă, vei primi un link pentru resetarea parolei.
                        </p>

                        <Link
                            href="/login"
                            className="bg-[#1c1c1e] text-white py-3 px-6 mt-4 cursor-pointer font-Inter18Semibold"
                        >
                            Înapoi la login
                        </Link>
                    </div>
                )}
            </div>

            <Footer />
        </>
    );
}