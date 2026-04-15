"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api/auth";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/footer";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setError("");
        setLoading(true);

        try {
            await login(email, password);
            router.push("/home");
        } catch (err: any) {
            const message = err.message || "";

            if (message.toLowerCase().includes("verify")) {
                setError("Trebuie să verificați email-ul înainte de autentificare.");
            } else {
                setError("Email sau parolă incorecte.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />

            <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 bg-white text-black">
                <div className="w-full max-w-md flex flex-col gap-4">
                    <h1 className="text-2xl text-center">Autentificare</h1>

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
                        {loading ? "Se procesează..." : "AUTENTIFICARE"}
                    </button>

                    <p className="text-center text-sm text-gray-600 mt-4">
                        Nu ai cont?{" "}
                        <Link
                            href="/register"
                            className="underline hover:text-black"
                        >
                            Înregistrează-te acum
                        </Link>
                    </p>
                </div>
            </div>

            <Footer />
        </>
    );
}