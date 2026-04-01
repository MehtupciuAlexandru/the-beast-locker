"use client";

import { useEffect, useState } from "react";
import { getActiveCustomer } from "@/lib/api/auth";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/footer";
import { useRouter } from "next/navigation";
import {logout} from "@/lib/api/auth";

export default function AccountPage() {
    const router = useRouter();
    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };
    const [email, setEmail] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await getActiveCustomer();
                if (!data.activeCustomer) {
                    router.push("/login");
                    return;
                }

                setEmail(data.activeCustomer.emailAddress);
            } catch {
                router.push("/login");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [router]);

    return (
        <>
            <Navbar />

            <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
                {loading ? (
                    <p>Se încarcă...</p>
                ) : (
                    <div className="flex flex-col gap-4">
                        <h1 className="text-2xl font-semibold">
                            Contul meu
                        </h1>

                        <p className="text-gray-600">
                            Sunteți autentificat ca:
                        </p>

                        <p className="text-lg font-medium">
                            {email}
                        </p>
                    </div>

                )}

                <button
                    onClick={handleLogout}
                    className="bg-black text-white py-3 px-6 mt-6"
                >
                    Logout
                </button>
            </div>


            <Footer />
        </>
    );
}