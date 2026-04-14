"use client";

import { useEffect, useState } from "react";
import { getActiveCustomer } from "@/lib/api/auth";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/footer";
import { useRouter } from "next/navigation";
import {logout} from "@/lib/api/auth";
import {deleteCustomerAddress, setDefaultAddress, updateCustomerAddress} from "@/lib/api/customer";
import { updateCustomerDetails } from "@/lib/api/customer";
import { updatePassword } from "@/lib/api/customer";
import { createCustomerAddress } from "@/lib/api/customer";
import {getAvailableCountries} from "@/lib/api/shop";


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

    const [isEditOpen, setIsEditOpen] = useState(false);

    const [editFirstName, setEditFirstName] = useState("");
    const [editLastName, setEditLastName] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<"success" | "error" | null>(null);

    const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);

    const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

    const [deleteAddressId, setDeleteAddressId] = useState<string | null>(null);

    const [countries, setCountries] = useState<any[]>([]);

    const [newAddress, setNewAddress] = useState({
        fullName: "",
        company: "",
        streetLine1: "",
        streetLine2: "",
        city: "",
        province: "",
        postalCode: "",
        phoneNumber: "",
        countryCode: "RO",
    });

    const resetAddressForm = () => {
        setNewAddress({
            fullName: "",
            company: "",
            streetLine1: "",
            streetLine2: "",
            city: "",
            province: "",
            postalCode: "",
            phoneNumber: "",
            countryCode: "RO",
        });

        setIsAddAddressOpen(false);
    };

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

    useEffect(() => {
        if (!message) return;

        const timer = setTimeout(() => {
            setMessage(null);
            setMessageType(null);
        }, 3000);

        return () => clearTimeout(timer);
    }, [message]);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const data = await getAvailableCountries();
                setCountries(data.availableCountries || []);
            } catch (err) {
                console.error("Failed to fetch countries", err);
            }
        };

        fetchCountries();
    }, []);

    const handleAddAddress = async () => {

        if (
            !newAddress.fullName.trim() ||
            !newAddress.streetLine1.trim() ||
            !newAddress.city.trim() ||
            !newAddress.postalCode.trim() ||
            !newAddress.countryCode.trim()
        ) {
            setMessage("Completează câmpurile obligatorii");
            setMessageType("error");
            return;
        }

        try {
            const cleanedAddress: any = {
                fullName: newAddress.fullName.trim(),
                streetLine1: newAddress.streetLine1.trim(),
                city: newAddress.city.trim(),
                postalCode: newAddress.postalCode.trim(),
                countryCode: newAddress.countryCode,
            };

            if (newAddress.streetLine2.trim()) {
                cleanedAddress.streetLine2 = newAddress.streetLine2.trim();
            }

            if (newAddress.province.trim()) {
                cleanedAddress.province = newAddress.province.trim();
            }

            if (newAddress.phoneNumber.trim()) {
                cleanedAddress.phoneNumber = newAddress.phoneNumber.trim();
            }

            if (newAddress.company?.trim()) {
                cleanedAddress.company = newAddress.company.trim();
            }

            if (editingAddressId) {
                await updateCustomerAddress(editingAddressId, cleanedAddress);
            } else {
                await createCustomerAddress(cleanedAddress);
            }

            setMessage("Adresa a fost salvată");
            setMessageType("success");

            setIsAddAddressOpen(false);
            resetAddressForm();

            // reset form
            setNewAddress({
                fullName: "",
                company: "",
                streetLine1: "",
                streetLine2: "",
                city: "",
                province: "",
                postalCode: "",
                phoneNumber: "",
                countryCode: "RO",
            });

            await fetchUser();

            setIsAddAddressOpen(false);
            setEditingAddressId(null);

        } catch (err) {
            console.error(err);
            setMessage("Eroare la adăugarea adresei");
            setMessageType("error");
        }

    };

    const handleDeleteAddress = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();

        if (id === selectedAddressId) {
            setMessage("Nu puteți șterge adresa selectată");
            setMessageType("error");
            return;
        }

        setDeleteAddressId(id);
    };

    const confirmDeleteAddress = async () => {
        if (!deleteAddressId) return;

        try {
            const res = await deleteCustomerAddress(deleteAddressId);

            if (!res.deleteCustomerAddress.success) {
                setMessage("Eroare la ștergere");
                setMessageType("error");
                return;
            }

            await fetchUser();

            setMessage("Adresa a fost ștearsă");
            setMessageType("success");

            setDeleteAddressId(null);

        } catch (err) {
            console.error(err);
            setMessage("A apărut o eroare la ștergere");
            setMessageType("error");
        }
    };

    const cancelDeleteAddress = () => {
        setDeleteAddressId(null);
    };

    const handleSetDefaultAddress = async () => {
        if (!selectedAddressId) return;

        try {
            await setDefaultAddress(selectedAddressId);
            await fetchUser();
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

    function getPasswordStrength(password: string) {
        if (!password) return "none";

        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[!@#$%^&*]/.test(password);

        if (password.length < 6) return "weak";
        if (password.length >= 6 && (!hasNumber || !hasSpecial)) return "medium";
        if (password.length >= 10 && hasNumber && hasSpecial) return "strong";

        return "medium";
    }

    function isStrongPassword(password: string): boolean {
        return /^(?=.*[0-9])(?=.*[!@#$%^&*]).{10,}$/.test(password);
    }

    const handleSaveAccount = async () => {
        try {
            const input: any = {};

            if (editFirstName.trim()) {
                input.firstName = editFirstName.trim();
            }

            if (editLastName.trim()) {
                input.lastName = editLastName.trim();
            }

            if (newPassword || confirmPassword || currentPassword) {
                if (!currentPassword) {
                    setMessage("Introduceți parola curentă");
                    setMessageType("error");
                    return;
                }

                if (newPassword !== confirmPassword) {
                    setMessage("Parolele nu coincid");
                    setMessageType("error");
                    return;
                }

                if (!isStrongPassword(newPassword)) {
                    setMessage("Parola trebuie să aibă minim 10 caractere, un număr și un simbol");
                    setMessageType("error");
                    return;
                }

                const res = await updatePassword(currentPassword, newPassword);

                if (res.updateCustomerPassword.__typename !== "Success") {
                    setMessage(res.updateCustomerPassword.message || "Eroare la schimbarea parolei");
                    setMessageType("error");
                    return;
                }
            }

            if (Object.keys(input).length === 0 && !newPassword) {
                setIsEditOpen(false);
                return;
            }

            if (Object.keys(input).length > 0) {
                await updateCustomerDetails(input);
            }

            await fetchUser();

            setMessage("Datele au fost actualizate. Vă rugăm să vă autentificați din nou.");
            setMessageType("success");

            setIsEditOpen(false);

            setTimeout(async () => {
                await handleLogout();
                router.push("/login");
            }, 1500);

            // reset fields
            setEditFirstName("");
            setEditLastName("");
            setNewPassword("");
            setConfirmPassword("");

        } catch (err) {
            console.error(err);

            setMessage("A apărut o eroare. Încearcă din nou.");
            setMessageType("error");
        }
    };



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
                            className="rounded-lg bg-black text-white px-6 py-3 mt-4 w-fit  hover:bg-red-500 cursor-pointer"
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
                                            className={`border rounded-md p-5 flex flex-col justify-between cursor-pointer ${
                                                isSelected ? "border-black" : "border-gray-300"
                                            }`}
                                        >

                                            {/* TOP ROW: name + badge + radio */}
                                            <div className="flex justify-between items-start">

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
                                                </div>

                                                <input
                                                    type="radio"
                                                    checked={isSelected}
                                                    readOnly
                                                    className="mt-1 accent-black pointer-events-none"
                                                />
                                            </div>

                                            {/* address content */}
                                            <div className="mt-2 text-gray-700">
                                                <p>{addr.streetLine1}</p>

                                                {addr.streetLine2 && <p>{addr.streetLine2}</p>}

                                                <p>{addr.postalCode} {addr.city}</p>

                                                {addr.province && <p>{addr.province}</p>}

                                                <p>{addr.country?.name}</p>
                                            </div>

                                            {/* bottom row buttons */}
                                            <div className="flex justify-end items-center gap-3 mt-4">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();

                                                        setEditingAddressId(addr.id);

                                                        setNewAddress({
                                                            fullName: addr.fullName || "",
                                                            company: addr.company || "",
                                                            streetLine1: addr.streetLine1 || "",
                                                            streetLine2: addr.streetLine2 || "",
                                                            city: addr.city || "",
                                                            province: addr.province || "",
                                                            postalCode: addr.postalCode || "",
                                                            phoneNumber: addr.phoneNumber || "",
                                                            countryCode: addr.country?.code || "RO",
                                                        });

                                                        setIsAddAddressOpen(true);
                                                    }}
                                                    className="text-sm underline cursor-pointer"
                                                >
                                                    Editează
                                                </button>

                                                <button
                                                    onClick={(e) => handleDeleteAddress(e, addr.id)}
                                                    className="flex items-center justify-center hover:opacity-70 cursor-pointer"
                                                >
                                                    <img src="/svg/trash.svg" alt="Delete" className="w-12 h-12" />
                                                </button>

                                            </div>

                                        </div>
                                    );
                                })}

                            </div>
                        ) : (
                            <p className="text-gray-500">
                                Nu aveți adrese salvate
                            </p>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4 mt-6">
                            <button
                                onClick={handleSetDefaultAddress}
                                className="rounded-lg flex-1 bg-black text-white px-6 py-3 hover:opacity-60 disabled:opacity-40 cursor-pointer"
                                disabled={!selectedAddressId}
                            >
                                SETEAZĂ ADRESA SELECTATĂ CA ACTIVĂ
                            </button>

                            <button
                                onClick={() => {
                                    resetAddressForm();
                                    setIsAddAddressOpen(true);
                                }}
                                className="rounded-lg flex-1 bg-black text-white px-6 py-3 hover:opacity-60 cursor-pointer"
                            >
                                ADAUGĂ ADRESĂ
                            </button>

                        </div>


                        <div className="flex flex-col sm:flex-row gap-4 mt-6">
                            <button className="rounded-lg flex-1 bg-black text-white px-6 py-3 hover:opacity-60 cursor-pointer">
                                EDITEAZĂ ADRESA SELECTATĂ
                            </button>

                            <button
                                onClick={() => setIsEditOpen(true)}
                                className="rounded-lg flex-1 bg-black text-white px-6 py-3 hover:opacity-60 cursor-pointer"
                            >
                                EDITEAZĂ DETALIILE CONTULUI
                            </button>
                        </div>
                    </div>

                </div>
            </section>

            {isEditOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center">

                    {/* Background overlay */}
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setIsEditOpen(false)}
                    />

                    {/* Modal */}
                    <div className="relative bg-white text-black w-full max-w-md p-6 rounded-md shadow-lg">

                        <h2 className="text-xl font-semibold mb-4">
                            Editează detaliile contului
                        </h2>

                        <div className="mb-4">
                            <label className="block text-sm mb-1">Prenume</label>
                            <input
                                type="text"
                                value={editFirstName}
                                onChange={(e) => setEditFirstName(e.target.value)}
                                className="w-full border px-3 py-2"
                                placeholder={firstName || ""}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm mb-1">Nume</label>
                            <input
                                type="text"
                                value={editLastName}
                                onChange={(e) => setEditLastName(e.target.value)}
                                className="w-full border px-3 py-2"
                                placeholder={lastName || ""}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm mb-1">Parola curentă</label>

                            <div className="relative">
                                <input
                                    type={showCurrentPassword ? "text" : "password"}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full border px-3 py-2 pr-12"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
                                >
                                    {showCurrentPassword ? "Ascunde" : "Arată"}
                                </button>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm mb-1">Parolă nouă</label>

                            <div className="relative">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full border px-3 py-2 pr-12"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
                                >
                                    {showNewPassword ? "Ascunde" : "Arată"}
                                </button>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm mb-1">Confirmă parola</label>

                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full border px-3 py-2 pr-12"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
                                >
                                    {showConfirmPassword ? "Ascunde" : "Arată"}
                                </button>
                            </div>
                        </div>

                        {newPassword && (
                            <div className="mt-4 mb-4">
                                <div className="h-2 w-full bg-gray-200 rounded">
                                    <div
                                        className={`h-2 rounded ${
                                            getPasswordStrength(newPassword) === "weak"
                                                ? "bg-red-500 w-1/3"
                                                : getPasswordStrength(newPassword) === "medium"
                                                    ? "bg-yellow-500 w-2/3"
                                                    : "bg-green-500 w-full"
                                        }`}
                                    />
                                </div>

                                <p className="text-xs mt-1 text-gray-600">
                                    {getPasswordStrength(newPassword) === "weak" && "Parolă slabă"}
                                    {getPasswordStrength(newPassword) === "medium" && "Parolă medie"}
                                    {getPasswordStrength(newPassword) === "strong" && "Parolă puternică"}
                                </p>
                            </div>
                        )}

                        <div className="flex justify-between">
                            <button
                                onClick={() => setIsEditOpen(false)}
                                className="px-4 py-2 border hover:bg-black hover:text-white cursor-pointer"
                            >
                                Anulează
                            </button>

                            <button
                                onClick={handleSaveAccount}
                                className="bg-black text-white px-6 py-2 hover:opacity-60 cursor-pointer">
                                Salvează
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {message && (
                <div className="fixed top-6 right-6 z-[9999]">
                    <div
                        className={`px-4 py-3 rounded-md shadow-md text-white ${
                            messageType === "success" ? "bg-green-600" : "bg-red-600"
                        }`}
                    >
                        {message}
                    </div>
                </div>
            )}

            {isAddAddressOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center">

                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setIsAddAddressOpen(false)}
                    />

                    <div className="relative bg-white text-black w-full max-w-md p-6 rounded-md">

                        <h2 className="text-xl font-semibold mb-4">
                            Adaugă adresă nouă
                        </h2>

                        <input
                            placeholder="Nume complet"
                            value={newAddress.fullName}
                            onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                            className="w-full border px-3 py-2 mb-3"
                        />

                        <input
                            placeholder="Companie (opțional)"
                            value={newAddress.company}
                            onChange={(e) =>
                                setNewAddress({ ...newAddress, company: e.target.value })
                            }
                            className="w-full border px-3 py-2 mb-3"
                        />

                        <input
                            placeholder="Adresă"
                            value={newAddress.streetLine1}
                            onChange={(e) => setNewAddress({ ...newAddress, streetLine1: e.target.value })}
                            className="w-full border px-3 py-2 mb-3"
                        />

                        <input
                            placeholder="Adresă secundară (opțional)"
                            value={newAddress.streetLine2}
                            onChange={(e) => setNewAddress({ ...newAddress, streetLine2: e.target.value })}
                            className="w-full border px-3 py-2 mb-3"
                        />

                        <input
                            placeholder="Oraș"
                            value={newAddress.city}
                            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                            className="w-full border px-3 py-2 mb-3"
                        />

                        <input
                            placeholder="Județ (opțional)"
                            value={newAddress.province}
                            onChange={(e) => setNewAddress({ ...newAddress, province: e.target.value })}
                            className="w-full border px-3 py-2 mb-3"
                        />

                        <input
                            placeholder="Cod poștal"
                            value={newAddress.postalCode}
                            onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                            className="w-full border px-3 py-2 mb-3"
                        />

                        <input
                            placeholder="Telefon (opțional)"
                            value={newAddress.phoneNumber}
                            onChange={(e) => setNewAddress({ ...newAddress, phoneNumber: e.target.value })}
                            className="w-full border px-3 py-2 mb-4"
                        />

                        <select
                            value={newAddress.countryCode}
                            onChange={(e) =>
                                setNewAddress({ ...newAddress, countryCode: e.target.value })
                            }
                            className="w-full border px-3 py-2 mb-3"
                        >
                            <option value="">Selectează țara *</option>

                            {countries.map((country) => (
                                <option key={country.id} value={country.code}>
                                    {country.name}
                                </option>
                            ))}
                        </select>

                        <div className="flex justify-between">
                            <button
                                onClick={() => {
                                    setIsAddAddressOpen(false);
                                    resetAddressForm();
                                }}
                                className="px-4 py-2 border cursor-pointer hover:bg-black hover:text-white"
                            >
                                Anulează
                            </button>

                            <button
                                onClick={handleAddAddress}
                                className="bg-black text-white px-6 py-2 hover:opacity-60 cursor-pointer"
                            >
                                Salvează
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {deleteAddressId && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center">

                    {/* overlay */}
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={cancelDeleteAddress}
                    />

                    {/* modal */}
                    <div className="relative bg-white text-black w-full max-w-sm p-6 rounded-md">

                        <h2 className="text-lg font-semibold mb-3">
                            Șterge adresa
                        </h2>

                        <p className="text-sm text-gray-600 mb-6">
                            Sigur doriți să ștergeți această adresă?
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={cancelDeleteAddress}
                                className="px-4 py-2 border cursor-pointer hover:bg-black hover:text-white"
                            >
                                Anulează
                            </button>

                            <button
                                onClick={confirmDeleteAddress}
                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 cursor-pointer"
                            >
                                Șterge
                            </button>
                        </div>

                    </div>
                </div>
            )}

            <Footer />
        </>
    );
}