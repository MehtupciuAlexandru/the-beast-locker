"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyCustomerAccount } from "@/lib/api/auth";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/footer";
export const dynamic = "force-dynamic";

export default function VerifyPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const token = searchParams.get("token");

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [error, setError] = useState("");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setError("Token invalid sau lipsă");
            return;
        }

        const verify = async () => {
            try {
                await verifyCustomerAccount(token);
                setStatus("success");
            } catch (err: any) {
                setError(err.message || "Eroare la verificare");
                setStatus("error");
            }
        };

        verify();
    }, [token]);

    return (
        <>
            <Navbar />

            <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center bg-white text-black">
                {status === "loading" && (
                    <p>Se verifică contul...</p>
                )}

                {status === "success" && (
                    <div className="flex flex-col gap-4">
                        <h2 className="text-xl font-semibold">
                            Cont verificat cu succes!
                        </h2>
                        <p className="text-gray-600">
                            Acum vă puteți autentifica.
                        </p>

                        <button
                            onClick={() => router.push("/login")}
                            className="bg-black text-white py-3 px-6 mt-4 hover:opacity-75 hover:text-white"
                        >
                            Mergi la login
                        </button>
                    </div>
                )}

                {status === "error" && (
                    <div className="flex flex-col gap-4">
                        <h2 className="text-xl font-semibold text-red-500">
                            Verificare eșuată
                        </h2>
                        <p className="text-gray-600">{error}</p>

                        <button
                            onClick={() => router.push("/register")}
                            className="bg-black text-white py-3 px-6 mt-4"
                        >
                            Înapoi la înregistrare
                        </button>
                    </div>
                )}
            </div>

            <Footer />
        </>
    );
}