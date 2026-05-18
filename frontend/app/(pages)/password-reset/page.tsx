"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/footer";
import { resetPassword } from "@/lib/api/auth";

function PasswordResetContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const token = searchParams.get("token") || "";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const isStrongPassword = (value: string) => {
        return /^(?=.*[0-9])(?=.*[!@#$%^&*]).{10,}$/.test(value);
    };

    const handleSubmit = async () => {
        setError("");

        if (!token) {
            setError("Link-ul de resetare este invalid sau lipsește token-ul.");
            return;
        }

        if (!password || !confirmPassword) {
            setError("Completează ambele câmpuri pentru parolă.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Parolele nu coincid.");
            return;
        }

        if (!isStrongPassword(password)) {
            setError("Parola trebuie să aibă minim 10 caractere, un număr și un simbol.");
            return;
        }

        setLoading(true);

        try {
            await resetPassword(token, password);
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
                            Resetează parola
                        </h1>

                        <p className="text-center text-gray-500 text-sm">
                            Introdu noua parolă pentru contul tău.
                        </p>

                        {!token && (
                            <p className="text-red-500 text-sm text-center">
                                Link-ul de resetare este invalid sau incomplet.
                            </p>
                        )}

                        <div className="relative w-full">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Parolă nouă"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="border p-3 w-full pr-20"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600 cursor-pointer"
                            >
                                {showPassword ? "Ascunde" : "Arată"}
                            </button>
                        </div>

                        <div className="relative w-full">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirmă parola"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="border p-3 w-full pr-20"
                            />

                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600 cursor-pointer"
                            >
                                {showConfirmPassword ? "Ascunde" : "Arată"}
                            </button>
                        </div>

                        <p className="text-xs text-gray-500 text-center leading-relaxed">
                            Parola trebuie să aibă minim 10 caractere, cel puțin un număr și un simbol.
                        </p>

                        {error && (
                            <p className="text-red-500 text-sm text-center">
                                {error}
                            </p>
                        )}

                        <button
                            onClick={handleSubmit}
                            disabled={loading || !token}
                            className="bg-[#1c1c1e] font-Inter18Semibold text-white py-3 mt-2 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {loading ? "Se procesează..." : "RESETEAZĂ PAROLA"}
                        </button>
                    </div>
                ) : (
                    <div className="text-center flex flex-col gap-4 max-w-md">
                        <h2 className="text-xl font-Inter18Semibold">
                            Parola a fost resetată
                        </h2>

                        <p className="text-gray-600 font-Inter18Semibold">
                            Acum te poți autentifica folosind noua parolă.
                        </p>

                        <button
                            onClick={() => router.push("/login")}
                            className="bg-[#1c1c1e] text-white py-3 px-6 mt-4 cursor-pointer font-Inter18Semibold"
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

export default function PasswordResetPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-white text-[#1c1c1e] font-Inter18Semibold">
                    Se încarcă...
                </div>
            }
        >
            <PasswordResetContent />
        </Suspense>
    );
}