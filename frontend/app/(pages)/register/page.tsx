"use client";

import { useState } from "react";
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
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setError("");
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
                            placeholder="Nume Familie"
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
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600"
                            >
                                {showPassword ? "Ascunde" : "Arată"}
                            </button>
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm text-center">
                                {error}
                            </p>
                        )}

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-black text-white py-3 mt-2"
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
                            className="bg-black text-white py-3 px-6 mt-4"
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