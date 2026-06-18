"use client";

import { useEffect, useMemo, useState } from "react";
import { getActiveCustomer } from "@/lib/api/auth";
import { createCustomerAddress, updateCustomerAddress } from "@/lib/api/customer";
import { getAvailableCountries } from "@/lib/api/shop";
import { adjustOrderLine, getActiveOrder, removeOrderLine } from "@/lib/api/cart";
import { createStripePaymentIntent } from "@/lib/api/stripe";
import { getRecaptchaToken } from "@/lib/recaptcha/client";
import StripePaymentForm from "@/components/checkout/StripePaymentForm";
import {
    getEligibleShippingMethods,
    setCheckoutCustomer,
    setCheckoutShippingAddress,
    setCheckoutShippingMethod,
} from "@/lib/api/checkout";

type PaymentMethod = "card" | "paypal" | "apple-pay";

type CheckoutAddress = {
    id: string;
    fullName?: string;
    company?: string;
    streetLine1?: string;
    streetLine2?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    phoneNumber?: string;
    defaultShippingAddress?: boolean;
    country?: {
        name?: string;
        code?: string;
    };
};

type ActiveOrderLine = {
    id: string;
    quantity: number;
    featuredAsset?: {
        preview: string;
    };
    productVariant: {
        id: string;
        name: string;
        priceWithTax?: number;
        featuredAsset?: {
            preview: string;
        };
        product?: {
            id?: string;
            name: string;
            slug?: string;
            featuredAsset?: {
                preview: string;
            };
        };
        options?: {
            id?: string;
            name: string;
            code?: string;
            group?: {
                id?: string;
                name: string;
                code?: string;
            };
        }[];
    };
};

type ActiveOrder = {
    id: string;
    code?: string;
    totalQuantity: number;
    subTotalWithTax: number;
    shippingWithTax?: number;
    totalWithTax: number;
    lines: ActiveOrderLine[];
};

export default function Checkout() {
    const [loading, setLoading] = useState(true);
    const [orderLoading, setOrderLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [firstName, setFirstName] = useState<string | null>(null);
    const [lastName, setLastName] = useState<string | null>(null);

    const [addresses, setAddresses] = useState<CheckoutAddress[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

    const [countries, setCountries] = useState<any[]>([]);
    const [order, setOrder] = useState<ActiveOrder | null>(null);
    const [updatingLine, setUpdatingLine] = useState<string | null>(null);

    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
    const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<"success" | "error" | null>(null);

    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [isPreparingPayment, setIsPreparingPayment] = useState(false);

    const [shippingMethods, setShippingMethods] = useState<any[]>([]);
    const [selectedShippingMethodId, setSelectedShippingMethodId] = useState<string | null>(null);
    const [shippingMethodsLoaded, setShippingMethodsLoaded] = useState(false);

    const [guestForm, setGuestForm] = useState({
        firstName: "",
        lastName: "",
        emailAddress: "",
        phoneNumber: "",
        company: "",
        streetLine1: "",
        streetLine2: "",
        city: "",
        province: "",
        postalCode: "",
        countryCode: "RO",
    });

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

        setEditingAddressId(null);
        setIsAddAddressOpen(false);
    };

    const fetchOrder = async (showLoading = true) => {
        if (showLoading) {
            setOrderLoading(true);
        }

        try {
            const activeOrder = await getActiveOrder();
            setOrder(activeOrder || null);
        } catch (err) {
            console.error(err);
            setOrder(null);
        } finally {
            if (showLoading) {
                setOrderLoading(false);
            }
        }
    };

    const fetchUser = async () => {
        try {
            const data = await getActiveCustomer();

            if (!data?.activeCustomer) {
                setIsAuthenticated(false);
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
            setFirstName(customer.firstName);
            setLastName(customer.lastName);
            setIsAuthenticated(true);
        } catch {
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
        fetchOrder();
    }, []);

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

    useEffect(() => {
        if (!message) return;

        const timer = setTimeout(() => {
            setMessage(null);
            setMessageType(null);
        }, 3000);

        return () => clearTimeout(timer);
    }, [message]);

    const selectedAddress = useMemo(() => {
        return addresses.find((address) => address.id === selectedAddressId) || null;
    }, [addresses, selectedAddressId]);

    const formatPrice = (value?: number) => {
        if (value === undefined || value === null) return "0,00 lei";

        return `${(value / 100).toFixed(2).replace(".", ",")} lei`;
    };

    const getLineTotal = (line: ActiveOrderLine) => {
        return (line.productVariant.priceWithTax || 0) * line.quantity;
    };

    const isValidEmail = (value: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
    };

    const getLineImage = (line: ActiveOrderLine) => {
        return (
            line.featuredAsset?.preview ||
            line.productVariant.featuredAsset?.preview ||
            line.productVariant.product?.featuredAsset?.preview ||
            "/placeholder.png"
        );
    };

    const getLineName = (line: ActiveOrderLine) => {
        return line.productVariant.product?.name || line.productVariant.name;
    };

    const getLineOption = (line: ActiveOrderLine, groupName: string) => {
        return line.productVariant.options?.find((option) =>
            option.group?.name?.toLowerCase().includes(groupName.toLowerCase())
        )?.name;
    };

    const getColorLabel = (line: ActiveOrderLine) => {
        return getLineOption(line, "color") || getLineOption(line, "culoare") || "GRAPHITE BLACK";
    };

    const getSizeLabel = (line: ActiveOrderLine) => {
        return (
            getLineOption(line, "size") ||
            getLineOption(line, "mărime") ||
            getLineOption(line, "marime") ||
            line.productVariant.name
        );
    };

    const getAddressTitle = (address: CheckoutAddress, index: number) => {
        if (address.defaultShippingAddress) return "Home Address";
        if (address.company) return address.company;
        if (index === 1) return "Work Address";
        return "Address";
    };

    const openEditAddress = (address: CheckoutAddress) => {
        setEditingAddressId(address.id);

        setNewAddress({
            fullName: address.fullName || "",
            company: address.company || "",
            streetLine1: address.streetLine1 || "",
            streetLine2: address.streetLine2 || "",
            city: address.city || "",
            province: address.province || "",
            postalCode: address.postalCode || "",
            phoneNumber: address.phoneNumber || "",
            countryCode: address.country?.code || "RO",
        });

        setIsAddAddressOpen(true);
    };

    const increaseLine = async (orderLineId: string, quantity: number) => {
        try {
            setUpdatingLine(orderLineId);
            await adjustOrderLine(orderLineId, quantity + 1);
            await fetchOrder(false);
        } catch (err: any) {
            setMessage(err.message || "Nu am putut actualiza cantitatea.");
            setMessageType("error");
        } finally {
            setUpdatingLine(null);
        }
    };

    const decreaseLine = async (orderLineId: string, quantity: number) => {
        if (quantity <= 1) return;

        try {
            setUpdatingLine(orderLineId);
            await adjustOrderLine(orderLineId, quantity - 1);
            await fetchOrder(false);
        } catch (err: any) {
            setMessage(err.message || "Nu am putut actualiza cantitatea.");
            setMessageType("error");
        } finally {
            setUpdatingLine(null);
        }
    };

    const handleRemoveLine = async (orderLineId: string) => {
        try {
            setUpdatingLine(orderLineId);

            const updatedOrder = await removeOrderLine(orderLineId);

            if (updatedOrder?.message) {
                throw new Error(updatedOrder.message);
            }

            await fetchOrder(false);

            setMessage("Produsul a fost eliminat din comandă.");
            setMessageType("success");
        } catch (err: any) {
            setMessage(err.message || "Nu am putut elimina produsul.");
            setMessageType("error");
        } finally {
            setUpdatingLine(null);
        }
    };

    const validateSavedAddressForm = () => {
        if (!newAddress.fullName.trim()) return "Introduceți numele complet.";
        if (!newAddress.streetLine1.trim()) return "Introduceți adresa.";
        if (!newAddress.city.trim()) return "Introduceți orașul.";
        if (!newAddress.postalCode.trim()) return "Introduceți codul poștal.";
        if (!newAddress.countryCode.trim()) return "Selectați țara.";

        return "";
    };

    const handleAddAddress = async () => {
        const validationError = validateSavedAddressForm();

        if (validationError) {
            setMessage(validationError);
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

            if (newAddress.company.trim()) {
                cleanedAddress.company = newAddress.company.trim();
            }

            if (editingAddressId) {
                await updateCustomerAddress(editingAddressId, cleanedAddress);
            } else {
                await createCustomerAddress(cleanedAddress);
            }

            setMessage("Adresa a fost salvată");
            setMessageType("success");

            resetAddressForm();
            await fetchUser();
        } catch (err: any) {
            setMessage(err.message || "Eroare la salvarea adresei");
            setMessageType("error");
        }
    };

    const validateGuestForm = () => {
        if (!guestForm.firstName.trim()) return "Introduceți prenumele.";
        if (!guestForm.lastName.trim()) return "Introduceți numele.";
        if (!guestForm.emailAddress.trim()) return "Introduceți adresa de email.";
        if (!isValidEmail(guestForm.emailAddress)) return "Introduceți o adresă de email validă.";
        if (!guestForm.phoneNumber.trim()) return "Introduceți numărul de telefon.";
        if (!guestForm.streetLine1.trim()) return "Introduceți adresa.";
        if (!guestForm.city.trim()) return "Introduceți orașul.";
        if (!guestForm.postalCode.trim()) return "Introduceți codul poștal.";
        if (!guestForm.countryCode.trim()) return "Selectați țara.";

        return "";
    };

    const setLoggedInOrderAddress = async (recaptchaToken: string) => {
        if (!selectedAddress) {
            throw new Error("Selectează o adresă de livrare.");
        }

        if (!selectedAddress.streetLine1?.trim()) {
            throw new Error("Adresa selectată nu conține strada.");
        }

        if (!selectedAddress.city?.trim()) {
            throw new Error("Adresa selectată nu conține orașul.");
        }

        if (!selectedAddress.postalCode?.trim()) {
            throw new Error("Adresa selectată nu conține codul poștal.");
        }

        const input = {
            fullName: selectedAddress.fullName || `${firstName ?? ""} ${lastName ?? ""}`.trim(),
            company: selectedAddress.company || undefined,
            streetLine1: selectedAddress.streetLine1,
            streetLine2: selectedAddress.streetLine2 || undefined,
            city: selectedAddress.city,
            province: selectedAddress.province || undefined,
            postalCode: selectedAddress.postalCode,
            phoneNumber: selectedAddress.phoneNumber || undefined,
            countryCode: selectedAddress.country?.code || "RO",
        };

        return setCheckoutShippingAddress(input, recaptchaToken);
    };

    const setGuestOrderDetails = async (recaptchaToken: string) => {
        const validationError = validateGuestForm();

        if (validationError) {
            throw new Error(validationError);
        }

        await setCheckoutCustomer(
            {
                firstName: guestForm.firstName.trim(),
                lastName: guestForm.lastName.trim(),
                emailAddress: guestForm.emailAddress.trim(),
                phoneNumber: guestForm.phoneNumber.trim(),
            },
            recaptchaToken
        );

        return setCheckoutShippingAddress(
            {
                fullName: `${guestForm.firstName.trim()} ${guestForm.lastName.trim()}`,
                company: guestForm.company.trim() || undefined,
                streetLine1: guestForm.streetLine1.trim(),
                streetLine2: guestForm.streetLine2.trim() || undefined,
                city: guestForm.city.trim(),
                province: guestForm.province.trim() || undefined,
                postalCode: guestForm.postalCode.trim(),
                phoneNumber: guestForm.phoneNumber.trim(),
                countryCode: guestForm.countryCode,
            },
            recaptchaToken
        );
    };

    const setFirstAvailableShippingMethod = async () => {
        const methods = await getEligibleShippingMethods();

        if (!methods.length) {
            throw new Error("Nu există metode de livrare disponibile pentru această comandă.");
        }

        const standardMethod =
            methods.find((method: any) => method.code === "standard-shipping") ||
            methods[0];

        return setCheckoutShippingMethod(standardMethod.id);
    };

    const loadShippingMethodsForOrder = async () => {
        const methods = await getEligibleShippingMethods();

        if (!methods.length) {
            throw new Error("Nu există metode de livrare disponibile pentru această comandă.");
        }

        setShippingMethods(methods);

        const standardMethod =
            methods.find((method: any) => method.code === "standard-shipping") ||
            methods[0];

        setSelectedShippingMethodId(standardMethod.id);
        setShippingMethodsLoaded(true);

        return methods;
    };

    const handlePayNow = async () => {
        try {
            setMessage(null);
            setMessageType(null);
            setIsPreparingPayment(true);

            if (!order || order.lines.length === 0) {
                setMessage("Coșul este gol.");
                setMessageType("error");
                return;
            }

            const recaptchaToken = await getRecaptchaToken("checkout");

            const updatedOrder = isAuthenticated
                ? await setLoggedInOrderAddress(recaptchaToken)
                : await setGuestOrderDetails(recaptchaToken);

            setOrder(updatedOrder);

            if (!shippingMethodsLoaded || !selectedShippingMethodId) {
                await loadShippingMethodsForOrder();

                setMessage("Alege metoda de livrare, apoi continuă către plată.");
                setMessageType("success");
                return;
            }

            const orderWithShipping = await setCheckoutShippingMethod(selectedShippingMethodId);

            setOrder(orderWithShipping);

            const secret = await createStripePaymentIntent();

            setClientSecret(secret);
            setMessage("Datele au fost salvate. Completează plata cu cardul.");
            setMessageType("success");
            setMessage("Datele au fost salvate. Completează plata cu cardul.");
            setMessageType("success");
        } catch (err: any) {
            setMessage(err.message || "A apărut o eroare.");
            setMessageType("error");
        } finally {
            setIsPreparingPayment(false);
        }
    };

    if (loading || orderLoading) {
        return (
            <section className="min-h-[70vh] bg-[#f5f5f5] flex items-center justify-center font-Inter text-[#1c1c1e]" />
        );
    }

    const cartProductCount =
        order?.lines?.reduce((total, line) => total + line.quantity, 0) || 0;

    const productTotal =
        order?.lines?.reduce((total, line) => total + getLineTotal(line), 0) || 0;

    const vatValue = Math.round(productTotal * 0.21);

    const totalValue = productTotal;

    return (
        <section className="w-full bg-[#f5f5f5] min-h-screen font-Inter text-[#1c1c1e]">
            <div className="w-full max-w-[1500px] mx-auto px-5 md:px-10 lg:px-12 py-6 md:py-8">
                <div className="mb-4 md:mb-5">
                    <p className="text-[10px] uppercase tracking-[0.12em] text-neutral-400">
                        Checkout
                    </p>

                    <h1 className="text-[14px] md:text-[15px] font-Inter18Semibold leading-none">
                        Finalizează comanda
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] xl:grid-cols-[1fr_245px] gap-6 lg:gap-8 items-start">
                    <div className="flex flex-col gap-5 md:gap-6">
                        <div className="bg-white border border-[#d8d8d8] px-4 md:px-6 py-4 md:py-5">
                            <p className="text-[11px] text-neutral-500 mb-4">
                                {cartProductCount} {cartProductCount === 1 ? "produs" : "produse"}
                            </p>

                            {order?.lines && order.lines.length > 0 ? (
                                <div className="divide-y divide-[#e5e5e5]">
                                    {order.lines.map((line) => (
                                        <div
                                            key={line.id}
                                            className={`flex items-start gap-4 md:gap-7 py-4 first:pt-0 last:pb-0 transition-opacity ${
    updatingLine === line.id ? "opacity-50 pointer-events-none" : "opacity-100"
}`}
                                        >
                                            <div className="w-[70px] h-[96px] md:w-[105px] md:h-[135px] shrink-0 bg-white">
                                                <img
                                                    src={getLineImage(line)}
                                                    alt={getLineName(line)}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>

                                            <div className="flex-1 min-w-0 pt-1 md:pt-3">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div>
                                                        <h2 className="text-[12px] font-Inter18Semibold uppercase tracking-[0.02em] text-[#1c1c1e] leading-tight">
                                                            {getLineName(line)}
                                                        </h2>

                                                        <p className="mt-1 text-[10px] md:text-[11px] text-neutral-500 leading-relaxed">
                                                            BeastLocker
                                                            <br />
                                                            Culoare: {getColorLabel(line)}
                                                            <br />
                                                            Mărime: {getSizeLabel(line)}
                                                        </p>

                                                        <p className="mt-2 text-[10px] text-neutral-400">
                                                            {line.quantity} × {formatPrice(line.productVariant.priceWithTax || 0)}
                                                        </p>

                                                        <div className="mt-4 flex items-center gap-4">
                                                            <div className="flex items-center border border-gray-300">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => decreaseLine(line.id, line.quantity)}
                                                                    disabled={line.quantity <= 1}
                                                                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                                                >
                                                                    <span className="text-lg leading-none -mt-0.5">–</span>
                                                                </button>

                                                                <span className="w-8 text-center text-[12px] text-[#1c1c1e] font-Inter">
                                                                    {line.quantity}
                                                                </span>

                                                                <button
                                                                    type="button"
                                                                    onClick={() => increaseLine(line.id, line.quantity)}
                                                                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 transition-colors cursor-pointer"
                                                                >
                                                                    <span className="text-lg leading-none -mt-0.5">+</span>
                                                                </button>
                                                            </div>

                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveLine(line.id)}
                                                                className="text-[10px] underline text-neutral-400 hover:text-red-600 cursor-pointer"
                                                            >
                                                                Șterge
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <p className="text-[11px] md:text-[12px] font-Inter18Semibold whitespace-nowrap text-[#1c1c1e]">
                                                        {formatPrice(getLineTotal(line))}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-neutral-500 py-8">
                                    Coșul este gol.
                                </p>
                            )}
                        </div>

{/*                        <div className="bg-white border-[#d8d8d8] px-4 md:px-6 py-5">*/}
{/*                            <h2 className="text-[12px] font-Inter18Semibold uppercase mb-5">*/}
{/*                                Payment Method*/}
{/*                            </h2>*/}

{/*                            <div className="grid grid-cols-3 gap-3 md:gap-4">*/}
{/*                                {[*/}
{/*                                    { id: "card", label: "Card" },*/}
{/*                                    { id: "paypal", label: "PayPal" },*/}
{/*                                    { id: "apple-pay", label: "Apple Pay" },*/}
{/*                                ].map((method) => (*/}
{/*                                    <button*/}
{/*                                        key={method.id}*/}
{/*                                        type="button"*/}
{/*                                        onClick={() => setPaymentMethod(method.id as PaymentMethod)}*/}
{/*                                        className={`h-[42px] border text-[11px] cursor-pointer transition-colors ${*/}
{/*    paymentMethod === method.id*/}
{/*        ? "border-[#1c1c1e] text-[#1c1c1e] font-Inter18Semibold"*/}
{/*        : "border-[#d8d8d8] text-[#1c1c1e] hover:border-neutral-500"*/}
{/*}`}*/}
{/*                                    >*/}
{/*                                        {method.label}*/}
{/*                                    </button>*/}
{/*                                ))}*/}
{/*                            </div>*/}
{/*                        </div>*/}

                        {isAuthenticated ? (
                            <div className="bg-white border border-[#d8d8d8] px-4 md:px-6 py-5">
                                <h2 className="text-[12px] font-Inter18Semibold uppercase mb-5">
                                    Delivery Address
                                </h2>

                                <div className="flex flex-col gap-4">
                                    {addresses.length > 0 ? (
                                        addresses.map((address, index) => {
                                            const isSelected = selectedAddressId === address.id;

                                            return (
                                                <div
                                                    key={address.id}
                                                    onClick={() => setSelectedAddressId(address.id)}
                                                    className={`relative border p-4 md:p-5 cursor-pointer transition-colors ${
    isSelected
        ? "border-[#1c1c1e]"
        : "border-[#d8d8d8] hover:border-neutral-500"
}`}
                                                >
                                                    <div className="absolute right-4 top-4">
                                                        <input
                                                            type="radio"
                                                            checked={isSelected}
                                                            readOnly
                                                            className="w-3.5 h-3.5 accent-blue-500 pointer-events-none"
                                                        />
                                                    </div>

                                                    <div className="pr-8">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <p className="text-[12px] font-Inter18Semibold text-[#1c1c1e]">
                                                                {getAddressTitle(address, index)}
                                                            </p>

                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    openEditAddress(address);
                                                                }}
                                                                className="text-[10px] underline text-neutral-400 hover:text-[#1c1c1e] cursor-pointer"
                                                            >
                                                                Editează
                                                            </button>
                                                        </div>

                                                        <p className="text-[11px] text-neutral-500 leading-relaxed">
                                                            {address.streetLine1}
                                                            {address.streetLine2 ? (
                                                                <>
                                                                    <br />
                                                                    {address.streetLine2}
                                                                </>
                                                            ) : null}
                                                            <br />
                                                            {address.postalCode} {address.city}
                                                            {address.province ? `, ${address.province}` : ""}
                                                            <br />
                                                            {address.country?.name || "România"}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-[11px] text-neutral-500">
                                            Nu aveți adrese salvate.
                                        </p>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => {
                                            resetAddressForm();
                                            setIsAddAddressOpen(true);
                                        }}
                                        className="h-[38px] border border-dashed border-neutral-300 text-[11px] text-neutral-500 hover:text-[#1c1c1e] hover:border-[#1c1c1e] transition-colors cursor-pointer"
                                    >
                                        + Add New Address
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <GuestCheckoutForm
                                guestForm={guestForm}
                                setGuestForm={setGuestForm}
                                countries={countries}
                            />
                        )}

                        {shippingMethodsLoaded && shippingMethods.length > 0 && (
                            <div className="bg-white border border-[#d8d8d8] px-4 md:px-6 py-5">
                                <h2 className="text-[12px] font-Inter18Semibold uppercase mb-5">
                                    Metodă de livrare
                                </h2>

                                <div className="flex flex-col gap-3">
                                    {shippingMethods.map((method: any) => {
                                        const isSelected = selectedShippingMethodId === method.id;

                                        return (
                                            <button
                                                key={method.id}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedShippingMethodId(method.id);
                                                    setClientSecret(null);
                                                }}
                                                className={`w-full border p-4 text-left cursor-pointer transition-colors ${
                                                    isSelected
                                                        ? "border-[#1c1c1e]"
                                                        : "border-[#d8d8d8] hover:border-neutral-500"
                                                }`}
                                            >
                                                <div className="flex items-center justify-between gap-4">
                                                    <div>
                                                        <p className="text-[12px] font-Inter18Semibold text-[#1c1c1e]">
                                                            {method.name}
                                                        </p>

                                                        <p className="mt-1 text-[10px] text-neutral-400 uppercase tracking-wide">
                                                            {method.code}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                <span className="text-[12px] font-Inter18Semibold text-[#1c1c1e]">
                                    {formatPrice(method.priceWithTax)}
                                </span>

                                                        <span
                                                            className={`w-3.5 h-3.5 rounded-full border ${
                                                                isSelected
                                                                    ? "border-[#1c1c1e] bg-[#1c1c1e]"
                                                                    : "border-neutral-300 bg-white"
                                                            }`}
                                                        />
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {clientSecret && (
                            <div className="bg-white border border-[#d8d8d8] px-4 md:px-6 py-5">
                                <h2 className="text-[12px] font-Inter18Semibold uppercase mb-5">
                                    Plata cu cardul
                                </h2>

                                <StripePaymentForm clientSecret={clientSecret} />
                            </div>
                        )}

                        <div className="bg-white border border-[#d8d8d8] px-4 py-5 lg:hidden">
                            <PriceSummary
                                productTotal={formatPrice(productTotal)}
                                vat={formatPrice(vatValue)}
                                total={formatPrice(totalValue)}
                                onPay={handlePayNow}
                                isPreparingPayment={isPreparingPayment}
                            />
                        </div>
                    </div>

                    <div className="hidden lg:block bg-white border border-[#d8d8d8] p-6 sticky top-6">
                        <PriceSummary
                            productTotal={formatPrice(productTotal)}
                            vat={formatPrice(vatValue)}
                            total={formatPrice(totalValue)}
                            onPay={handlePayNow}
                            isPreparingPayment={isPreparingPayment}
                        />
                    </div>
                </div>
            </div>

            {message && (
                <div className="fixed top-6 right-6 z-[9999]">
                    <div
                        className={`px-5 py-3 rounded-none shadow-xl text-xs uppercase tracking-wider text-white font-Inter18Semibold ${
    messageType === "success" ? "bg-[#1c1c1e]" : "bg-red-600"
}`}
                    >
                        {message}
                    </div>
                </div>
            )}

            {isAddAddressOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 font-Inter">
                    <div
                        className="absolute inset-0 bg-neutral-800/50 backdrop-blur-xs transition-opacity"
                        onClick={() => setIsAddAddressOpen(false)}
                    />

                    <div className="relative bg-white text-neutral-800 w-full max-w-lg p-8 md:p-10 rounded-none shadow-2xl overflow-y-auto max-h-[90vh]">
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
                                {editingAddressId ? "Editează adresa" : "Adaugă adresă"}
                            </h2>

                            <p className="text-xs text-neutral-500 mt-4 font-Inter tracking-wide">
                                Completați datele dumneavoastră mai jos:
                            </p>
                        </div>

                        <div className="space-y-4 font-Inter">
                            <AddressInput label="Nume complet *" value={newAddress.fullName} onChange={(value) => setNewAddress({ ...newAddress, fullName: value })} placeholder="ex: Popescu Andrei" />
                            <AddressInput label="Companie (opțional)" value={newAddress.company} onChange={(value) => setNewAddress({ ...newAddress, company: value })} placeholder="Numele companiei" />
                            <AddressInput label="Adresă *" value={newAddress.streetLine1} onChange={(value) => setNewAddress({ ...newAddress, streetLine1: value })} placeholder="Strada, numărul, blocul, apartamentul" />
                            <AddressInput label="Adresă secundară (opțional)" value={newAddress.streetLine2} onChange={(value) => setNewAddress({ ...newAddress, streetLine2: value })} placeholder="Alte detalii despre adresă" />

                            <div className="grid grid-cols-2 gap-4">
                                <AddressInput label="Oraș *" value={newAddress.city} onChange={(value) => setNewAddress({ ...newAddress, city: value })} placeholder="Oraș" />
                                <AddressInput label="Județ (opțional)" value={newAddress.province} onChange={(value) => setNewAddress({ ...newAddress, province: value })} placeholder="Județ" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <AddressInput label="Cod poștal *" value={newAddress.postalCode} onChange={(value) => setNewAddress({ ...newAddress, postalCode: value })} placeholder="Cod poștal" />
                                <AddressInput label="Telefon (opțional)" value={newAddress.phoneNumber} onChange={(value) => setNewAddress({ ...newAddress, phoneNumber: value })} placeholder="Număr de telefon" />
                            </div>

                            <CountrySelect
                                value={newAddress.countryCode}
                                onChange={(value) => setNewAddress({ ...newAddress, countryCode: value })}
                                countries={countries}
                            />
                        </div>

                        <div className="flex flex-col gap-3 mt-8 pt-4">
                            <button
                                onClick={handleAddAddress}
                                className="w-full bg-[#1c1c1e] text-white text-xs font-Inter18Semibold uppercase tracking-widest py-3.5 px-6 rounded-none hover:bg-black transition-all cursor-pointer border-none"
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
        </section>
    );
}

function GuestCheckoutForm({
                               guestForm,
                               setGuestForm,
                               countries,
                           }: {
    guestForm: any;
    setGuestForm: (value: any) => void;
    countries: any[];
}) {
    return (
        <div className="bg-white border border-[#d8d8d8] px-4 md:px-6 py-5">
            <h2 className="text-[12px] font-Inter18Semibold uppercase mb-5">
                Detalii livrare
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AddressInput label="Prenume *" value={guestForm.firstName} onChange={(value) => setGuestForm({ ...guestForm, firstName: value })} placeholder="Prenume" />
                <AddressInput label="Nume *" value={guestForm.lastName} onChange={(value) => setGuestForm({ ...guestForm, lastName: value })} placeholder="Nume" />
                <AddressInput label="Email *" value={guestForm.emailAddress} onChange={(value) => setGuestForm({ ...guestForm, emailAddress: value })} placeholder="Email" type="email" />
                <AddressInput label="Telefon *" value={guestForm.phoneNumber} onChange={(value) => setGuestForm({ ...guestForm, phoneNumber: value })} placeholder="Telefon" />
            </div>

            <div className="mt-4 space-y-4">
                <AddressInput label="Companie (opțional)" value={guestForm.company} onChange={(value) => setGuestForm({ ...guestForm, company: value })} placeholder="Numele companiei" />
                <AddressInput label="Adresă *" value={guestForm.streetLine1} onChange={(value) => setGuestForm({ ...guestForm, streetLine1: value })} placeholder="Strada, numărul, blocul, apartamentul" />
                <AddressInput label="Adresă secundară (opțional)" value={guestForm.streetLine2} onChange={(value) => setGuestForm({ ...guestForm, streetLine2: value })} placeholder="Alte detalii despre adresă" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AddressInput label="Oraș *" value={guestForm.city} onChange={(value) => setGuestForm({ ...guestForm, city: value })} placeholder="Oraș" />
                    <AddressInput label="Județ (opțional)" value={guestForm.province} onChange={(value) => setGuestForm({ ...guestForm, province: value })} placeholder="Județ" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AddressInput label="Cod poștal *" value={guestForm.postalCode} onChange={(value) => setGuestForm({ ...guestForm, postalCode: value })} placeholder="Cod poștal" />
                    <CountrySelect value={guestForm.countryCode} onChange={(value) => setGuestForm({ ...guestForm, countryCode: value })} countries={countries} />
                </div>
            </div>
        </div>
    );
}

function AddressInput({
                          label,
                          value,
                          onChange,
                          placeholder,
                          type = "text",
                      }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    type?: string;
}) {
    return (
        <div>
            <label className="block text-xs font-InterLight text-neutral-400 mb-1">
                {label}
            </label>

            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full border border-neutral-300 rounded-none px-3 py-2 text-sm outline-none bg-white focus:border-neutral-800 transition-colors duration-200 placeholder:text-neutral-300"
            />
        </div>
    );
}

function CountrySelect({
                           value,
                           onChange,
                           countries,
                       }: {
    value: string;
    onChange: (value: string) => void;
    countries: any[];
}) {
    return (
        <div>
            <label className="block text-xs font-InterLight text-neutral-400 mb-1">
                Țară *
            </label>

            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
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
    );
}

function PriceSummary({
                          productTotal,
                          vat,
                          total,
                          onPay,
                          isPreparingPayment,
                      }: {
    productTotal: string;
    vat: string;
    total: string;
    onPay: () => void;
    isPreparingPayment: boolean;
}) {


    return (
        <div>
            <h2 className="text-[12px] font-Inter18Semibold uppercase mb-5">
                Pret
            </h2>

            <div className="space-y-3 pb-5 border-b border-[#e5e5e5]">
                <div className="flex items-center justify-between text-[11px] text-neutral-500">
                    <span>Pret produse</span>
                    <span>{productTotal}</span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-neutral-500">
                    <span>TVA (21%)</span>
                    <span>inclus {vat}</span>
                </div>
            </div>

            <div className="flex items-center justify-between pt-5 mb-6">
                <span className="text-[13px] font-Inter18Semibold">
                    Valoare Totală
                </span>

                <span className="text-[13px] font-Inter18Semibold">
                    {total}
                </span>
            </div>

            <button
                type="button"
                onClick={onPay}
                disabled={isPreparingPayment}
                className="w-full h-[46px] bg-black text-white text-[11px] font-Inter18Semibold uppercase tracking-[0.08em] hover:bg-[#1c1c1e] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isPreparingPayment
                    ? "Se pregătește plata..."
                    : "Continuă către plată"}
            </button>
        </div>
    );
}

