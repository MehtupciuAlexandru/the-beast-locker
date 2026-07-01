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
import { CustomerOrder, getCustomerOrders } from "@/lib/api/orders";
import { cleanSavedDeliveryAddress } from "@/lib/deliveryValidation";
import { validateColeteAddress } from "@/lib/api/customer";

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
    const [addressModalError, setAddressModalError] = useState<string | null>(null);

    const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);

    const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

    const [deleteAddressId, setDeleteAddressId] = useState<string | null>(null);

    const [countries, setCountries] = useState<any[]>([]);

    const [orders, setOrders] = useState<CustomerOrder[]>([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);

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

        setAddressModalError(null);
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

            try {
                setOrdersLoading(true);

                const orderData = await getCustomerOrders();

                setOrders(orderData.items || []);
            } catch (err) {
                console.error("Failed to load customer orders:", err);
                setOrders([]);
            } finally {
                setOrdersLoading(false);
            }

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
        const normalizedAddress = cleanSavedDeliveryAddress(newAddress);

        if (normalizedAddress.error || !normalizedAddress.address) {
            setAddressModalError(normalizedAddress.error || "Adresa este invalida.");
            return;
        }

        if (
            !newAddress.fullName.trim() ||
            !newAddress.streetLine1.trim() ||
            !newAddress.city.trim() ||
            !newAddress.postalCode.trim() ||
            !newAddress.countryCode.trim()
        ) {
            setAddressModalError("Completează câmpurile obligatorii");
            return;
        }

        try {
            setAddressModalError(null);
            await validateColeteAddress(normalizedAddress.address);

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

            Object.assign(cleanedAddress, normalizedAddress.address);

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
            setAddressModalError(err instanceof Error ? err.message : "Eroare la salvarea adresei");
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
            <section className="min-h-[80vh] flex items-center justify-center bg-white text-neutral-800 font-Inter">
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

    const formatPrice = (value?: number) => {
        if (value === undefined || value === null) return "0,00 lei";

        return `${(value / 100).toFixed(2).replace(".", ",")} lei`;
    };

    const formatDate = (value?: string | null) => {
        if (!value) return "Dată indisponibilă";

        return new Intl.DateTimeFormat("ro-RO", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }).format(new Date(value));
    };

    const activeOrders = orders.filter(
        (order) => order.state === "PaymentSettled" && order.active === false
    );

    const historicOrders = orders.filter(
        (order) => order.state !== "PaymentSettled" && order.active === false
    );

    const getOrderStatusLabel = (state: string) => {
        switch (state) {
            case "PaymentSettled":
                return "Plată confirmată";
            case "Shipped":
                return "Expediată";
            case "Delivered":
                return "Livrată";
            case "Cancelled":
                return "Anulată";
            default:
                return state;
        }
    };

    const renderOrderCard = (order: CustomerOrder) => (
        <div
            key={order.id}
            className="border border-neutral-200 p-4"
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-[11px] font-Inter18Semibold text-neutral-800 uppercase tracking-wide">
                        Comanda #{order.code}
                    </p>

                    <p className="mt-1 text-[10px] text-neutral-400">
                        {formatDate(order.orderPlacedAt)}
                    </p>
                </div>

                <p className="text-[10px] uppercase tracking-wide text-neutral-500">
                    {getOrderStatusLabel(order.state)}
                </p>
            </div>

            <div className="mt-4 flex flex-col gap-2">
                {order.lines.map((line) => (
                    <div
                        key={line.id}
                        className="flex items-center justify-between gap-4 text-xs text-neutral-500"
                    >
                    <span>
                        {line.quantity} × {line.productVariant.product?.name || line.productVariant.name}
                    </span>

                        <span className="text-neutral-800">
                        {formatPrice(line.linePriceWithTax)}
                    </span>
                    </div>
                ))}
            </div>

            <div className="border-t border-neutral-100 mt-4 pt-3 flex items-center justify-between">
            <span className="text-[11px] text-neutral-400">
                Total
            </span>

                <span className="text-[12px] font-Inter18Semibold text-neutral-800">
                {formatPrice(order.totalWithTax)}
            </span>
            </div>

            {order.shippingLines && order.shippingLines.length > 0 && (
                <p className="mt-2 text-[10px] text-neutral-400">
                    Livrare: {order.shippingLines[0].shippingMethod.name}
                </p>
            )}

            {order.fulfillments && order.fulfillments.length > 0 && (
                <p className="mt-1 text-[10px] text-neutral-400">
                    Status livrare: {order.fulfillments[0].state}
                    {order.fulfillments[0].trackingCode
                        ? ` / Tracking: ${order.fulfillments[0].trackingCode}`
                        : ""}
                </p>
            )}
        </div>
    );

    return (
        <>
            <Navbar />

            <section className="min-h-[80vh] px-12 md:px-24 lg:px-32 py-12 bg-white text-neutral-800 font-Inter">
                <div className="w-full flex flex-col md:flex-row justify-between gap-12 md:gap-32">
                    <div className="w-full md:w-2/3 flex flex-col">
                        <button
                            onClick={handleLogout}
                            className="text-xs text-neutral-400 underline hover:text-neutral-800 mb-3 w-fit bg-transparent border-none p-0 cursor-pointer text-left normal-case tracking-normal font-normal shadow-none"
                        >
                            Logout
                        </button>

                        <h1 className="text-xl font-InterLight text-neutral-800 mb-1">
                            Contul meu
                        </h1>

                        {loading ? (
                            <p className="text-xs font-Inter text-neutral-400 mb-10">Se încarcă...</p>
                        ) : (
                            <p className="text-xs font-Inter text-neutral-400 mb-10">
                                Bine te-am regăsit, {firstName} {lastName}!
                            </p>
                        )}

                        <div className="mb-10">
                            <p className="text-xs font-Inter text-neutral-400 tracking-wide">
                                Comenzi active
                            </p>

                            <div className="border-b border-neutral-200 mt-1.5 mb-3"></div>

                            {ordersLoading ? (
                                <p className="text-xs font-Inter text-neutral-400 font-light">
                                    Se încarcă comenzile...
                                </p>
                            ) : activeOrders.length === 0 ? (
                                <p className="text-xs font-Inter text-neutral-400 font-light">
                                    Nu aveți comenzi active
                                </p>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    {activeOrders.map((order) => renderOrderCard(order))}
                                </div>
                            )}
                        </div>

                        <div className="mb-10">
                            <button
                                type="button"
                                onClick={() => setIsOrderHistoryOpen((prev) => !prev)}
                                className="w-full flex items-center justify-between text-left bg-transparent border-none p-0 cursor-pointer"
                            >
                                <p className="text-xs font-Inter text-neutral-400 tracking-wide">
                                    Istoric comenzi
                                </p>

                                <span className="text-xs text-neutral-400">
            {isOrderHistoryOpen ? "−" : "+"}
        </span>
                            </button>

                            <div className="border-b border-neutral-200 mt-1.5 mb-3"></div>

                            {isOrderHistoryOpen && (
                                <>
                                    {ordersLoading ? (
                                        <p className="text-xs font-Inter text-neutral-400 font-light">
                                            Se încarcă istoricul...
                                        </p>
                                    ) : historicOrders.length === 0 ? (
                                        <p className="text-xs font-Inter text-neutral-400 font-light">
                                            Nu există comenzi în istoric
                                        </p>
                                    ) : (
                                        <div className="flex flex-col gap-4">
                                            {historicOrders.map((order) => renderOrderCard(order))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="mb-10">
                            <p className="text-xs font-Inter text-neutral-400 tracking-wide">
                                Retururile mele
                            </p>
                            <div className="border-b border-neutral-200 mt-1.5 mb-3"></div>
                            <p className="text-xs font-Inter text-neutral-400 font-light">
                                Încă nu aveți niciun retur
                            </p>
                        </div>
                    </div>

                    <div className="w-full md:w-1/3 flex flex-col">
                        <p className="text-xs font-Inter text-neutral-400 tracking-wide">
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
                                                        <span className="text-[10px] font-Inter uppercase tracking-wider bg-neutral-100 text-neutral-600 px-2 py-0.5">
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
                                                        setAddressModalError(null);
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
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 font-Inter">
                    <div
                        className="absolute inset-0 bg-neutral-800/50 backdrop-blur-xs transition-opacity"
                        onClick={() => setIsEditOpen(false)}
                    />

                    <div className="relative bg-white text-neutral-800 w-full max-w-lg p-8 md:p-10 rounded-none shadow-2xl overflow-y-auto max-h-[90vh]">
                        <button
                            onClick={() => setIsEditOpen(false)}
                            className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-800 bg-transparent border-none p-0 cursor-pointer text-xl font-light"
                        >
                            ✕
                        </button>

                        <div className="text-center mb-8">
                            <h2 className="text-xl font-normal text-neutral-800">
                                Editează detaliile contului
                            </h2>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-5">
                            <div>
                                <label className="block text-xs text-neutral-400 mb-1">Prenume</label>
                                <input
                                    type="text"
                                    value={editFirstName}
                                    onChange={(e) => setEditFirstName(e.target.value)}
                                    className="w-full border border-neutral-300 rounded-none px-3 py-2 text-sm outline-none bg-white focus:border-neutral-800 transition-colors duration-200 placeholder:text-neutral-300"
                                    placeholder={firstName || ""}
                                />
                            </div>

                            <div>
                                <label className="block text-xs text-neutral-400 mb-1">Nume</label>
                                <input
                                    type="text"
                                    value={editLastName}
                                    onChange={(e) => setEditLastName(e.target.value)}
                                    className="w-full border border-neutral-300 rounded-none px-3 py-2 text-sm outline-none bg-white focus:border-neutral-800 transition-colors duration-200 placeholder:text-neutral-300"
                                    placeholder={lastName || ""}
                                />
                            </div>
                        </div>

                        <div className="mb-5">
                            <label className="block text-xs text-neutral-400 mb-1">Parola curentă</label>
                            <div className="relative">
                                <input
                                    type={showCurrentPassword ? "text" : "password"}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full border border-neutral-300 rounded-none px-3 py-2 text-sm pr-16 outline-none bg-white focus:border-neutral-800 transition-colors duration-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-800 font-medium bg-transparent border-none cursor-pointer"
                                >
                                    {showCurrentPassword ? "Ascunde" : "Arată"}
                                </button>
                            </div>
                        </div>

                        <div className="mb-5">
                            <label className="block text-xs text-neutral-400 mb-1">Parolă nouă</label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full border border-neutral-300 rounded-none px-3 py-2 text-sm pr-16 outline-none bg-white focus:border-neutral-800 transition-colors duration-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-800 font-medium bg-transparent border-none cursor-pointer"
                                >
                                    {showNewPassword ? "Ascunde" : "Arată"}
                                </button>
                            </div>
                        </div>

                        <div className="mb-5">
                            <label className="block text-xs text-neutral-400 mb-1">Confirmă parola</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full border border-neutral-300 rounded-none px-3 py-2 text-sm pr-16 outline-none bg-white focus:border-neutral-800 transition-colors duration-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-800 font-medium bg-transparent border-none cursor-pointer"
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

                        <div className="flex flex-col gap-3 mt-8 pt-4">
                            <button
                                onClick={handleSaveAccount}
                                className="w-full bg-[#1c1c1E] text-white text-xs font-semibold uppercase tracking-widest py-3.5 px-6 rounded-none hover:bg-black transition-all cursor-pointer border-none"
                            >
                                Salvează
                            </button>
                            <button
                                onClick={() => setIsEditOpen(false)}
                                className="w-full py-3 bg-transparent text-xs font-medium uppercase tracking-widest text-neutral-500 hover:text-neutral-800 transition-all cursor-pointer border-none"
                            >
                                Anulează
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {message && (
                <div className="fixed top-6 right-6 z-[9999] font-Inter">
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
                <div className="fixed inset-0 z-[9999] font-Inter flex items-center justify-center p-4 font-Inter">
                    <div
                        className="absolute inset-0 bg-neutral-800/50 backdrop-blur-xs transition-opacity"
                        onClick={resetAddressForm}
                    />

                    <div className="relative bg-white text-neutral-800 w-full max-w-lg p-8 md:p-10 rounded-none font-Inter shadow-2xl overflow-y-auto max-h-[90vh]">
                        <button
                            onClick={() => {
                                setIsAddAddressOpen(false);
                                resetAddressForm();
                            }}
                            className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-800 bg-transparent border-none p-0 cursor-pointer text-xl font-light"
                        >
                            ✕
                        </button>

                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-InterLight text-neutral-800">
                                Editează adresa
                            </h2>
                            <p className="text-xs text-neutral-500 mt-4 font-Inter tracking-wide">
                                Completați datele dumneavoastră mai jos:
                            </p>
                        </div>

                        {addressModalError && (
                            <div className="mb-5 border border-red-200 bg-red-50 px-4 py-3 text-xs leading-relaxed text-red-700">
                                {addressModalError}
                            </div>
                        )}

                        <div className="space-y-4 font-Inter">
                            <div>
                                <label className="block text-xs text-neutral-400 font-InterLight mb-1">Nume complet *</label>
                                <input
                                    placeholder="ex: Popescu Andrei"
                                    value={newAddress.fullName}
                                    onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                                    className="w-full border border-neutral-300 rounded-none px-3 py-2 text-sm outline-none bg-white focus:border-neutral-800 transition-colors duration-200 placeholder:text-neutral-300"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-InterLight text-neutral-400 mb-1">Companie (opțional)</label>
                                <input
                                    placeholder="Numele companiei"
                                    value={newAddress.company}
                                    onChange={(e) => setNewAddress({ ...newAddress, company: e.target.value })}
                                    className="w-full border border-neutral-300 rounded-none px-3 py-2 text-sm outline-none bg-white focus:border-neutral-800 transition-colors duration-200 placeholder:text-neutral-300"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-InterLight text-neutral-400 mb-1">Adresă *</label>
                                <input
                                    placeholder="Strada, numărul, blocul, apartamentul"
                                    value={newAddress.streetLine1}
                                    onChange={(e) => setNewAddress({ ...newAddress, streetLine1: e.target.value })}
                                    className="w-full border border-neutral-300 rounded-none px-3 py-2 text-sm outline-none bg-white focus:border-neutral-800 transition-colors duration-200 placeholder:text-neutral-300"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-InterLight text-neutral-400 mb-1">Adresă secundară (opțional)</label>
                                <input
                                    placeholder="Alte detalii despre adresă"
                                    value={newAddress.streetLine2}
                                    onChange={(e) => setNewAddress({ ...newAddress, streetLine2: e.target.value })}
                                    className="w-full border border-neutral-300 rounded-none px-3 py-2 text-sm outline-none bg-white focus:border-neutral-800 transition-colors duration-200 placeholder:text-neutral-300"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-InterLight text-neutral-400 mb-1">Oraș *</label>
                                    <input
                                        placeholder="Oraș"
                                        value={newAddress.city}
                                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                        className="w-full border border-neutral-300 rounded-none px-3 py-2 text-sm outline-none bg-white focus:border-neutral-800 transition-colors duration-200 placeholder:text-neutral-300"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-InterLight text-neutral-400 mb-1">Județ / sector *</label>
                                    <input
                                        placeholder="Județ sau sector"
                                        value={newAddress.province}
                                        onChange={(e) => setNewAddress({ ...newAddress, province: e.target.value })}
                                        className="w-full border border-neutral-300 rounded-none px-3 py-2 text-sm outline-none bg-white focus:border-neutral-800 transition-colors duration-200 placeholder:text-neutral-300"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-InterLight text-neutral-400 mb-1">Cod poștal *</label>
                                    <input
                                        placeholder="Cod poștal"
                                        value={newAddress.postalCode}
                                        onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                                        className="w-full border border-neutral-300 rounded-none px-3 py-2 text-sm outline-none bg-white focus:border-neutral-800 transition-colors duration-200 placeholder:text-neutral-300"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-InterLight text-neutral-400 mb-1">Telefon *</label>
                                    <input
                                        placeholder="Număr de telefon"
                                        value={newAddress.phoneNumber}
                                        onChange={(e) => setNewAddress({ ...newAddress, phoneNumber: e.target.value })}
                                        className="w-full border border-neutral-300 rounded-none px-3 py-2 text-sm outline-none bg-white focus:border-neutral-800 transition-colors duration-200 placeholder:text-neutral-300"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-InterLight text-neutral-400 mb-1">Țară *</label>
                                <div className="relative">
                                    <select
                                        value={newAddress.countryCode}
                                        onChange={(e) => setNewAddress({ ...newAddress, countryCode: e.target.value })}
                                        className="w-full border border-neutral-300 rounded-none px-3 py-2 text-sm outline-none bg-white focus:border-neutral-800 transition-colors duration-200 appearance-none text-neutral-800"
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

                        <div className="flex flex-col gap-3 mt-8 pt-4">
                            <button
                                onClick={handleAddAddress}
                                className="w-full bg-[#1c1c1E] text-white text-xs font-Inter18Semibold uppercase tracking-widest py-3.5 px-6 rounded-none hover:bg-black transition-all cursor-pointer border-none"
                            >
                                Salvează
                            </button>
                            <button
                                onClick={() => {
                                    setIsAddAddressOpen(false);
                                    resetAddressForm();
                                }}
                                className="w-full py-3 bg-transparent text-xs font-Inter18Semibold uppercase tracking-widest text-neutral-500 hover:text-neutral-800 transition-all cursor-pointer border-none"
                            >
                                Anulează
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {deleteAddressId && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 font-Inter">
                    <div
                        className="absolute inset-0 bg-neutral-800/50 backdrop-blur-xs transition-opacity"
                        onClick={cancelDeleteAddress}
                    />

                    <div className="relative bg-white font-Inter text-neutral-800 w-full max-w-md p-8 md:p-10 rounded-none shadow-2xl border border-neutral-100">
                        <div className="text-center mb-6">
                            <h2 className="text-xl font-normal text-neutral-800">
                                Șterge adresa
                            </h2>
                        </div>

                        <p className="text-sm text-neutral-500 text-center mb-8">
                            Sigur doriți să ștergeți această adresă? Această acțiune este ireversibilă.
                        </p>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={confirmDeleteAddress}
                                className="w-full bg-red-600 text-white text-xs font-Inter18Semibold uppercase tracking-widest px-6 py-3.5 rounded-none hover:bg-red-700 transition-all cursor-pointer border-none"
                            >
                                Șterge
                            </button>
                            <button
                                onClick={cancelDeleteAddress}
                                className="w-full py-3 bg-transparent text-xs font-Inter uppercase tracking-widest text-neutral-500 hover:text-neutral-800 transition-all cursor-pointer border-none"
                            >
                                Anulează
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
}
