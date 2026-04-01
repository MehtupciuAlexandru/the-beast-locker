"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyCustomerAccount } from "@/lib/api/auth";

export default function VerifyContent() {
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

    if (status === "loading") {
        return <p className="text-center mt-20">Se verifică contul...</p>;
    }

    if (status === "success") {
        return (
            <div className="text-center mt-20">
                <h2 className="text-xl font-semibold">Cont verificat cu succes!</h2>
                <button
                    onClick={() => router.push("/login")}
                    className="bg-black text-white py-3 px-6 mt-4"
                >
                    Mergi la login
                </button>
            </div>
        );
    }

    return (
        <div className="text-center mt-20">
            <h2 className="text-xl text-red-500">Verificare eșuată</h2>
            <p>{error}</p>
        </div>
    );
}