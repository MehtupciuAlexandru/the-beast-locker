"use client";

import { useEffect, useState } from "react";
import { getActiveCustomer } from "@/lib/api/auth";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/footer";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/api/auth";
import { deleteCustomerAddress, setDefaultAddress, updateCustomerAddress } from "@/lib/api/customer";
import { updateCustomerDetails } from "@/lib/api/customer";
import { updatePassword } from "@/lib/api/customer";
import { createCustomerAddress } from "@/lib/api/customer";
import { getAvailableCountries } from "@/lib/api/shop";

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
            <section className="min-h-[80vh] flex items-center justify-center bg-white text-neutral-800">
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

            <section className="min-h-[80vh] px-8 md:px-16 py-12 bg-white text-neutral-800 font-sans">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12 md:gap-20">
                    <div className="w-full md:w-3/5 flex flex-col">
                        <button
                            onClick={handleLogout}
                            className="text-xs text-neutral-400 underline hover:text-neutral-800 mb-3 w-fit bg-transparent border-none p-0 cursor-pointer text-left normal-case tracking-normal font-normal shadow-none"
                        >
                            Logout
                        </button>

                        <h1 className="text-xl font-normal text-neutral-800 mb-1">
                            Contul meu
                        </h1>

                        {loading ? (
                            <p className="text-xs text-neutral-400 mb-10">Se încarcă...</p>
                        ) : (
                            <p className="text-xs text-neutral-400 mb-10">
                                Bine te-am regăsit, {firstName} {lastName}!
                            </p>
                        )}

                        <div className="mb-10">
                            <p className="text-xs text-neutral-400 tracking-wide">
                                Comenzile mele
                            </p>
                            <div className="border-b border-neutral-200 mt-1.5 mb-3"></div>
                            <p className="text-xs text-neutral-400 font-light">
                                Încă nu aveți nicio comandă
                            </p>
                        </div>

                        <div className="mb-10">
                            <p className="text-xs text-neutral-400 tracking-wide">
                                Retururile mele
                            </p>
                            <div className="border-b border-neutral-200 mt-1.5 mb-3"></div>
                            <p className="text-xs text-neutral-400 font-light">
                                Încă nu aveți niciun retur
                            </p>
                        </div>
                    </div>

                    <div className="w-full md:w-1/3 flex flex-col">
                        <p className="text-xs text-neutral-400 tracking-wide">
                            Adresa principală
                        </p>
                        <div className="border-b border-neutral-200 mt-1.5 mb-4"></div>

                        {addresses.length > 0 ? (
                            <div className="flex flex-col gap-6">
                                {addresses.map((addr) => {
                                    const isSelected = selectedAddressId === addr.id;
                                    const isDefault = addr.defaultShippingAddress;

                                    return (
                                        <div
                                            key={addr.id}
                                            onClick={() => setSelectedAddressId(addr.id)}
                                            className={`text-sm text-neutral-600 flex flex-col gap-0.5 cursor-pointer transition-opacity ${
                                                isSelected ? "opacity-100" : "opacity-60"
                                            }`}
                                        >
                                            <div className="flex justify-between items-center mb-1">
                                                <p className="font-medium text-neutral-800">
                                                    {addr.fullName || `${firstName ?? ""} ${lastName ?? ""}`.trim()}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    {isDefault && (
                                                        <span className="text-[10px] uppercase tracking-wider bg-neutral-100 text-neutral-600 px-2 py-0.5">
                                                            Principală
                                                        </span>
                                                    )}
                                                    <input
                                                        type="radio"
                                                        checked={isSelected}
                                                        readOnly
                                                        className="accent-neutral-800 pointer-events-none w-3 h-3"
                                                    />
                                                </div>
                                            </div>

                                            <p className="font-light">{addr.streetLine1}</p>
                                            {addr.streetLine2 && <p className="font-light">{addr.streetLine2}</p>}
                                            <p className="font-light">{addr.postalCode} {addr.city}</p>
                                            {addr.province && <p className="font-light">{addr.province}</p>}
                                            <p className="font-light">{addr.country?.name}</p>

                                            <div className="flex items-center gap-4 mt-2">
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
                                                    className="text-xs underline text-neutral-400 hover:text-neutral-800 cursor-pointer bg-transparent border-none p-0 normal-case tracking-normal font-normal shadow-none"
                                                >
                                                    Editează
                                                </button>

                                                <button
                                                    onClick={(e) => handleDeleteAddress(e, addr.id)}
                                                    className="text-xs underline text-neutral-400 hover:text-red-600 cursor-pointer bg-transparent border-none p-0 normal-case tracking-normal font-normal shadow-none flex items-center justify-center"
                                                >
                                                    Șterge
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-xs text-neutral-400 font-light">
                                Nu aveți adrese salvate
                            </p>
                        )}

                        <div className="flex flex-col gap-2 mt-6">
                            <button
                                onClick={handleSetDefaultAddress}
                                className="bg-[#1c1c1E] text-white text-xs uppercase tracking-widest py-3 px-6 rounded-none hover:bg-black transition-colors cursor-pointer w-full text-center font-medium shadow-none border-none outline-none block"
                                disabled={!selectedAddressId}
                            >
                                SETEAZĂ ADRESA SELECTATĂ CA ACTIVĂ
                            </button>

                            <button
                                onClick={() => {
                                    resetAddressForm();
                                    setIsAddAddressOpen(true);
                                }}
                                className="bg-[#1c1c1E] text-white text-xs uppercase tracking-widest py-3 px-6 rounded-none hover:bg-black transition-colors cursor-pointer w-full text-center font-medium shadow-none border-none outline-none block"
                            >
                                ADAUGĂ ADRESĂ
                            </button>

                            <button
                                onClick={() => setIsEditOpen(true)}
                                className="bg-[#1c1c1E] text-white text-xs uppercase tracking-widest py-3 px-6 rounded-none hover:bg-black transition-colors cursor-pointer w-full text-center font-medium shadow-none border-none outline-none block"
                            >
                                EDITEAZĂ DETALIILE CONTULUI
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {isEditOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-neutral-800/50 backdrop-blur-xs transition-opacity"
                        onClick={() => setIsEditOpen(false)}
                    />

                    <div className="relative bg-white text-neutral-800 w-full max-w-lg p-8 rounded-none border border-neutral-100 shadow-2xl overflow-y-auto max-h-[90vh]">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-800">
                                Editează detaliile contului
                            </h2>
                            <button
                                onClick={() => setIsEditOpen(false)}
                                className="text-neutral-400 hover:text-neutral-800 bg-transparent border-none p-0 cursor-pointer text-sm font-light"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-5">
                            <div>
                                <label className="block text-[10px] uppercase font-semibold tracking-wider text-neutral-500 mb-1.5">Prenume</label>
                                <input
                                    type="text"
                                    value={editFirstName}
                                    onChange={(e) => setEditFirstName(e.target.value)}
                                    className="w-full border border-neutral-200 rounded-none px-3.5 py-2.5 text-xs outline-none bg-neutral-50/50 focus:bg-white focus:border-neutral-800 transition-colors duration-200 placeholder:text-neutral-300 font-light"
                                    placeholder={firstName || ""}
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase font-semibold tracking-wider text-neutral-500 mb-1.5">Nume</label>
                                <input
                                    type="text"
                                    value={editLastName}
                                    onChange={(e) => setEditLastName(e.target.value)}
                                    className="w-full border border-neutral-200 rounded-none px-3.5 py-2.5 text-xs outline-none bg-neutral-50/50 focus:bg-white focus:border-neutral-800 transition-colors duration-200 placeholder:text-neutral-300 font-light"
                                    placeholder={lastName || ""}
                                />
                            </div>
                        </div>

                        <div className="mb-5">
                            <label className="block text-[10px] uppercase font-semibold tracking-wider text-neutral-500 mb-1.5">Parola curentă</label>
                            <div className="relative">
                                <input
                                    type={showCurrentPassword ? "text" : "password"}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full border border-neutral-200 rounded-none px-3.5 py-2.5 text-xs pr-16 outline-none bg-neutral-50/50 focus:bg-white focus:border-neutral-800 transition-colors duration-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-wider text-neutral-400 hover:text-neutral-800 font-medium bg-transparent border-none cursor-pointer"
                                >
                                    {showCurrentPassword ? "Ascunde" : "Arată"}
                                </button>
                            </div>
                        </div>

                        <div className="mb-5">
                            <label className="block text-[10px] uppercase font-semibold tracking-wider text-neutral-500 mb-1.5">Parolă nouă</label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full border border-neutral-200 rounded-none px-3.5 py-2.5 text-xs pr-16 outline-none bg-neutral-50/50 focus:bg-white focus:border-neutral-800 transition-colors duration-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-wider text-neutral-400 hover:text-neutral-800 font-medium bg-transparent border-none cursor-pointer"
                                >
                                    {showNewPassword ? "Ascunde" : "Arată"}
                                </button>
                            </div>
                        </div>

                        <div className="mb-5">
                            <label className="block text-[10px] uppercase font-semibold tracking-wider text-neutral-500 mb-1.5">Confirmă parola</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full border border-neutral-200 rounded-none px-3.5 py-2.5 text-xs pr-16 outline-none bg-neutral-50/50 focus:bg-white focus:border-neutral-800 transition-colors duration-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-wider text-neutral-400 hover:text-neutral-800 font-medium bg-transparent border-none cursor-pointer"
                                >
                                    {showConfirmPassword ? "Ascunde" : "Arată"}
                                </button>
                            </div>
                        </div>

                        {newPassword && (
                            <div className="mt-4 mb-6">
                                <div className="h-1 w-full bg-neutral-100 rounded-none">
                                    <div
                                        className={`h-1 rounded-none transition-all duration-300 ${
                                            getPasswordStrength(newPassword) === "weak"
                                                ? "bg-red-400 w-1/3"
                                                : getPasswordStrength(newPassword) === "medium"
                                                    ? "bg-yellow-400 w-2/3"
                                                    : "bg-emerald-500 w-full"
                                        }`}
                                    />
                                </div>
                                <p className="text-[10px] mt-1.5 uppercase tracking-wider text-neutral-400 font-medium">
                                    {getPasswordStrength(newPassword) === "weak" && "Parolă slabă"}
                                    {getPasswordStrength(newPassword) === "medium" && "Parolă medie"}
                                    {getPasswordStrength(newPassword) === "strong" && "Parolă puternică"}
                                </p>
                            </div>
                        )}

                        <div className="flex justify-between gap-4 mt-8 pt-4 border-t border-neutral-100">
                            <button
                                onClick={() => setIsEditOpen(false)}
                                className="flex-1 px-4 py-3 border border-neutral-200 text-[11px] font-medium uppercase tracking-widest rounded-none text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800 transition-all cursor-pointer bg-white"
                            >
                                Anulează
                            </button>

                            <button
                                onClick={handleSaveAccount}
                                className="flex-1 bg-[#1c1c1E] text-white text-[11px] font-medium uppercase tracking-widest py-3 px-6 rounded-none hover:bg-black transition-all cursor-pointer border-none"
                            >
                                Salvează
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {message && (
                <div className="fixed top-6 right-6 z-[9999]">
                    <div
                        className={`px-5 py-3 rounded-none shadow-xl text-xs uppercase tracking-wider text-white font-medium ${
                            messageType === "success" ? "bg-[#1c1c1E]" : "bg-red-600"
                        }`}
                    >
                        {message}
                    </div>
                </div>
            )}

            {isAddAddressOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-neutral-800/50 backdrop-blur-xs transition-opacity"
                        onClick={() => setIsAddAddressOpen(false)}
                    />

                    <div className="relative bg-white text-neutral-800 w-full max-w-xl p-8 rounded-none shadow-2xl overflow-y-auto max-h-[90vh]">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-800">
                                Detalii adresă
                            </h2>
                            <button
                                onClick={() => {
                                    setIsAddAddressOpen(false);
                                    resetAddressForm();
                                }}
                                className="text-neutral-400 hover:text-neutral-800 bg-transparent border-none p-0 cursor-pointer text-sm font-light"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] uppercase font-semibold tracking-wider text-neutral-500 mb-1.5">Nume complet *</label>
                                <input
                                    placeholder="ex: Popescu Andrei"
                                    value={newAddress.fullName}
                                    onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                                    className="w-full border border-neutral-200 rounded-none px-3.5 py-2.5 text-xs outline-none bg-neutral-50/50 focus:bg-white focus:border-neutral-800 transition-colors duration-200 placeholder:text-neutral-300 font-light"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase font-semibold tracking-wider text-neutral-500 mb-1.5">Companie (opțional)</label>
                                <input
                                    placeholder="Numele companiei"
                                    value={newAddress.company}
                                    onChange={(e) => setNewAddress({ ...newAddress, company: e.target.value })}
                                    className="w-full border border-neutral-200 rounded-none px-3.5 py-2.5 text-xs outline-none bg-neutral-50/50 focus:bg-white focus:border-neutral-800 transition-colors duration-200 placeholder:text-neutral-300 font-light"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase font-semibold tracking-wider text-neutral-500 mb-1.5">Adresă *</label>
                                <input
                                    placeholder="Strada, numărul, blocul, apartamentul"
                                    value={newAddress.streetLine1}
                                    onChange={(e) => setNewAddress({ ...newAddress, streetLine1: e.target.value })}
                                    className="w-full border border-neutral-200 rounded-none px-3.5 py-2.5 text-xs outline-none bg-neutral-50/50 focus:bg-white focus:border-neutral-800 transition-colors duration-200 placeholder:text-neutral-300 font-light"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase font-semibold tracking-wider text-neutral-500 mb-1.5">Adresă secundară (opțional)</label>
                                <input
                                    placeholder="Alte detalii despre adresă"
                                    value={newAddress.streetLine2}
                                    onChange={(e) => setNewAddress({ ...newAddress, streetLine2: e.target.value })}
                                    className="w-full border border-neutral-200 rounded-none px-3.5 py-2.5 text-xs outline-none bg-neutral-50/50 focus:bg-white focus:border-neutral-800 transition-colors duration-200 placeholder:text-neutral-300 font-light"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] uppercase font-semibold tracking-wider text-neutral-500 mb-1.5">Oraș *</label>
                                    <input
                                        placeholder="Oraș"
                                        value={newAddress.city}
                                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                        className="w-full border border-neutral-200 rounded-none px-3.5 py-2.5 text-xs outline-none bg-neutral-50/50 focus:bg-white focus:border-neutral-800 transition-colors duration-200 placeholder:text-neutral-300 font-light"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] uppercase font-semibold tracking-wider text-neutral-500 mb-1.5">Județ (opțional)</label>
                                    <input
                                        placeholder="Județ"
                                        value={newAddress.province}
                                        onChange={(e) => setNewAddress({ ...newAddress, province: e.target.value })}
                                        className="w-full border border-neutral-200 rounded-none px-3.5 py-2.5 text-xs outline-none bg-neutral-50/50 focus:bg-white focus:border-neutral-800 transition-colors duration-200 placeholder:text-neutral-300 font-light"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] uppercase font-semibold tracking-wider text-neutral-500 mb-1.5">Cod poștal *</label>
                                    <input
                                        placeholder="Cod poștal"
                                        value={newAddress.postalCode}
                                        onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                                        className="w-full border border-neutral-200 rounded-none px-3.5 py-2.5 text-xs outline-none bg-neutral-50/50 focus:bg-white focus:border-neutral-800 transition-colors duration-200 placeholder:text-neutral-300 font-light"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] uppercase font-semibold tracking-wider text-neutral-500 mb-1.5">Telefon (opțional)</label>
                                    <input
                                        placeholder="Număr de telefon"
                                        value={newAddress.phoneNumber}
                                        onChange={(e) => setNewAddress({ ...newAddress, phoneNumber: e.target.value })}
                                        className="w-full border border-neutral-200 rounded-none px-3.5 py-2.5 text-xs outline-none bg-neutral-50/50 focus:bg-white focus:border-neutral-800 transition-colors duration-200 placeholder:text-neutral-300 font-light"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase font-semibold tracking-wider text-neutral-500 mb-1.5">Țară *</label>
                                <div className="relative">
                                    <select
                                        value={newAddress.countryCode}
                                        onChange={(e) => setNewAddress({ ...newAddress, countryCode: e.target.value })}
                                        className="w-full border border-neutral-200 rounded-none px-3.5 py-2.5 text-xs outline-none bg-neutral-50/50 focus:bg-white focus:border-neutral-800 transition-colors duration-200 appearance-none text-neutral-800"
                                    >
                                        <option value="">Selectează țara *</option>
                                        {countries.map((country) => (
                                            <option key={country.id} value={country.code}>
                                                {country.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-neutral-400 text-xs">
                                        ▼
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between gap-4 mt-8 pt-4 border-t border-neutral-100">
                            <button
                                onClick={() => {
                                    setIsAddAddressOpen(false);
                                    resetAddressForm();
                                }}
                                className="flex-1 px-4 py-3 border border-neutral-200 text-[11px] font-medium uppercase tracking-widest rounded-none text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800 transition-all cursor-pointer bg-white"
                            >
                                Anulează
                            </button>

                            <button
                                onClick={handleAddAddress}
                                className="flex-1 bg-[#1c1c1E] text-white text-[11px] font-medium uppercase tracking-widest py-3 px-6 rounded-none hover:bg-black transition-all cursor-pointer border-none"
                            >
                                Salvează
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {deleteAddressId && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-neutral-800/50 backdrop-blur-xs transition-opacity"
                        onClick={cancelDeleteAddress}
                    />

                    <div className="relative bg-white text-neutral-800 w-full max-w-sm p-6 rounded-none shadow-2xl border border-neutral-100">
                        <h2 className="text-xs font-semibold uppercase tracking-widest mb-2 text-neutral-800">
                            Șterge adresa
                        </h2>

                        <p className="text-xs text-neutral-400 font-light mb-6 leading-relaxed">
                            Sigur doriți să ștergeți această adresă? Această acțiune este ireversibilă.
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={cancelDeleteAddress}
                                className="px-4 py-2 border border-neutral-200 text-[10px] font-medium uppercase tracking-wider rounded-none text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800 transition-all cursor-pointer bg-white"
                            >
                                Anulează
                            </button>

                            <button
                                onClick={confirmDeleteAddress}
                                className="bg-red-600 text-white text-[10px] font-medium uppercase tracking-wider px-4 py-2 rounded-none hover:bg-red-700 transition-all cursor-pointer border-none"
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