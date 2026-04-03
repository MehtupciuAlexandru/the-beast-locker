"use client";

import { useEffect, useState } from "react";
import { getActiveCustomer } from "@/lib/api/auth";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/footer";
import { useRouter } from "next/navigation";
import {logout} from "@/lib/api/auth";
import {setDefaultAddress} from "@/lib/api/customer";

export default function AccountPage() {
    const router = useRouter();
    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };
    const [email, setEmail] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [lastName, setLastName] = useState<string | null>(null);
    const [firstName, setFirstName] = useState<string | null>(null);
    const [addresses, setAddresses] = useState<any[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    const fetchUser = async () => {
        try {
            const data = await getActiveCustomer();

            if (!data?.activeCustomer) {
                setIsAuthenticated(false);
                router.replace("/login");
                return;
            }

            const customer = data.activeCustomer;

            const sortedAddresses = [...(customer.addresses || [])].sort((a, b) => {
                if (a.defaultShippingAddress) return -1;
                if (b.defaultShippingAddress) return 1;
                return 0;
            });

            setAddresses(sortedAddresses);

            const defaultAddr =
                customer.addresses?.find((addr: any) => addr.defaultShippingAddress) ||
                customer.addresses?.[0] ||
                null;

            setSelectedAddressId(defaultAddr?.id || null);

            setIsAuthenticated(true);
            setLastName(data.activeCustomer.lastName);
            setFirstName(data.activeCustomer.firstName);
            setEmail(data.activeCustomer.emailAddress);


        } catch {
            router.push("/login");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [router]);

    const handleSetDefaultAddress = async () => {
        if (!selectedAddressId) return;

        try {
            await setDefaultAddress(selectedAddressId);
            await fetchUser(); // 🔥 works now
        } catch (err) {
            console.error(err);
        }
    };
    if (loading || isAuthenticated === null) {
        return (
            <section className="min-h-[80vh] flex items-center justify-center bg-white text-black">
            </section>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <>
            <Navbar />

            <section className="min-h-[80vh] px-4 py-10 bg-white text-black">
                <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">

                    <div className="flex-1">

                        <h1 className="text-3xl font-semibold mb-2">
                            Contul meu
                        </h1>

                        {loading ? (
                            <p>Se încarcă...</p>
                        ) : (
                            <p className="text-gray-600 mb-8">
                                Bine te-am regăsit, {firstName}!
                            </p>
                        )}

                        <div className="mb-8">
                            <p className="text-sm text-gray-500 mb-2">
                                Comenzile mele
                            </p>
                            <div className="border-b mb-2"></div>
                            <p className="text-gray-500">
                                Încă nu aveți nicio comandă
                            </p>
                        </div>

                        <div className="mb-8">
                            <p className="text-sm text-gray-500 mb-2">
                                Retururile mele
                            </p>
                            <div className="border-b mb-2"></div>
                            <p className="text-gray-500">
                                Încă nu aveți niciun retur
                            </p>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="bg-black text-white px-6 py-3 mt-4 w-fit  hover:bg-red-500"
                        >
                            Logout
                        </button>
                    </div>

                    <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-4">
                            Adresele mele
                        </p>

                        {addresses.length > 0 ? (
                            <div className="flex flex-col gap-4">
                                {addresses.map((addr) => {
                                    const isSelected = selectedAddressId === addr.id;
                                    const isDefault = addr.defaultShippingAddress;

                                    return (
                                        <div
                                            key={addr.id}
                                            onClick={() => setSelectedAddressId(addr.id)}
                                            className={`border rounded-md p-5 flex items-start justify-between cursor-pointer ${
                                                isSelected ? "border-black" : "border-gray-300"
                                            }`}
                                        >
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="font-semibold">
                                                        {addr.fullName || `${firstName ?? ""} ${lastName ?? ""}`.trim()}
                                                    </p>

                                                    {isDefault && (
                                                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                                        Adresă principală activă
                                    </span>
                                                    )}
                                                </div>

                                                <p className="text-gray-700">
                                                    {addr.streetLine1}
                                                </p>

                                                {addr.streetLine2 && (
                                                    <p className="text-gray-700">
                                                        {addr.streetLine2}
                                                    </p>
                                                )}

                                                <p className="text-gray-700">
                                                    {addr.postalCode} {addr.city}
                                                </p>

                                                {addr.province && (
                                                    <p className="text-gray-700">
                                                        {addr.province}
                                                    </p>
                                                )}

                                                <p className="text-gray-700">
                                                    {addr.country?.name}
                                                </p>
                                            </div>

                                            <input
                                                type="radio"
                                                checked={isSelected}
                                                readOnly
                                                className="mt-1 accent-black pointer-events-none"
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-gray-500">
                                Nu aveți adrese salvate
                            </p>
                        )}

                        <div className="mt-6">
                            <button
                                onClick={handleSetDefaultAddress}
                                className="bg-black text-white px-6 py-3 hover:opacity-60 disabled:opacity-40"
                                disabled={!selectedAddressId}
                            >
                                SETEAZĂ ADRESA SELECTATĂ CA ACTIVĂ
                            </button>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 mt-6">
                            <button className="bg-black text-white px-6 py-3 w-fit hover:opacity-60">
                                EDITEAZĂ ADRESA SELECTATĂ
                            </button>

                            <button className="bg-black text-white px-6 py-3 w-fit hover:opacity-60">
                                EDITEAZĂ DETALIILE CONTULUI
                            </button>
                        </div>
                    </div>

                </div>
            </section>


            <Footer />
        </>
    );
}