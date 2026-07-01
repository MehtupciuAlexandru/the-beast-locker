"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { getActiveCustomer } from "@/lib/api/auth";
import { createCustomerAddress, updateCustomerAddress, validateColeteAddress } from "@/lib/api/customer";
import { getAvailableCountries } from "@/lib/api/shop";
import { adjustOrderLine, getActiveOrder, removeOrderLine } from "@/lib/api/cart";
import { createStripePaymentIntent } from "@/lib/api/stripe";
import { getRecaptchaToken } from "@/lib/recaptcha/client";
import StripePaymentForm from "@/components/checkout/StripePaymentForm";
import {
    getColeteCheckoutAddressQuote,
    getColeteCheckoutShippingPoints,
    getEligibleShippingMethods,
    setColeteCheckoutSelection,
    setCheckoutCustomer,
    setCheckoutShippingAddress,
    setCheckoutShippingMethod,
} from "@/lib/api/checkout";
import { cleanGuestCheckoutDetails, cleanSavedDeliveryAddress } from "@/lib/deliveryValidation";

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

type ColeteDeliveryOption = {
    deliveryType: "address" | "locker";
    priceWithTax: number;
    priceWithoutTax?: number | null;
    courierName?: string | null;
    serviceName?: string | null;
    serviceId?: number | null;
    activationId?: string | null;
    shippingPointId?: number | null;
    shippingPointName?: string | null;
    shippingPointType?: string | null;
    shippingPointAddress?: string | null;
    shippingPointLat?: number | null;
    shippingPointLng?: number | null;
    shippingPointCounty?: string | null;
    distanceKm?: number | null;
};

export default function Checkout() {
    const [loading, setLoading] = useState(true);
    const [orderLoading, setOrderLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const paymentSectionRef = useRef<HTMLDivElement | null>(null);

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
    const [addressModalError, setAddressModalError] = useState<string | null>(null);

    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [isPreparingPayment, setIsPreparingPayment] = useState(false);

    const [shippingMethods, setShippingMethods] = useState<any[]>([]);
    const [selectedShippingMethodId, setSelectedShippingMethodId] = useState<string | null>(null);
    const [shippingMethodsLoaded, setShippingMethodsLoaded] = useState(false);
    const [coleteOptions, setColeteOptions] = useState<ColeteDeliveryOption[]>([]);
    const [selectedColeteOptionKey, setSelectedColeteOptionKey] = useState<string | null>(null);
    const [focusedColeteOptionKey, setFocusedColeteOptionKey] = useState<string | null>(null);
    const [coleteOptionsLoading, setColeteOptionsLoading] = useState(false);
    const [coleteAddressQuoteError, setColeteAddressQuoteError] = useState<string | null>(null);
    const [checkoutDetailsSaved, setCheckoutDetailsSaved] = useState(false);

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
        setAddressModalError(null);
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

    const selectedShippingMethod = useMemo(() => {
        return shippingMethods.find((method: any) => method.id === selectedShippingMethodId) || null;
    }, [shippingMethods, selectedShippingMethodId]);

    const coleteOptionKey = (option: ColeteDeliveryOption) => {
        return option.deliveryType === "locker"
            ? `locker-${option.shippingPointId}-${option.activationId}`
            : `address-${option.serviceId}-${option.activationId || "best"}`;
    };

    const selectedColeteOption = useMemo(() => {
        return coleteOptions.find((option) => coleteOptionKey(option) === selectedColeteOptionKey) || null;
    }, [coleteOptions, selectedColeteOptionKey]);

    const addressDeliveryOption = useMemo(() => {
        return coleteOptions.find((option) => option.deliveryType === "address") || null;
    }, [coleteOptions]);

    const lockerDeliveryOptions = useMemo(() => {
        return coleteOptions.filter(
            (option) =>
                option.deliveryType === "locker" &&
                typeof option.shippingPointLat === "number" &&
                typeof option.shippingPointLng === "number"
        );
    }, [coleteOptions]);

    const focusedColeteOption = useMemo(() => {
        return coleteOptions.find((option) => coleteOptionKey(option) === focusedColeteOptionKey) || null;
    }, [coleteOptions, focusedColeteOptionKey]);

    const shippingValue =
        selectedColeteOption?.priceWithTax != null
            ? Math.round(selectedColeteOption.priceWithTax * 100)
            :
        selectedShippingMethod?.priceWithTax ||
        (order?.shippingWithTax && order.shippingWithTax > 0 ? order.shippingWithTax : 0);

    const formatPrice = (value?: number) => {
        if (value === undefined || value === null) return "0,00 lei";

        return `${(value / 100).toFixed(2).replace(".", ",")} lei`;
    };

    const resetCheckoutCalculation = () => {
        setClientSecret(null);
        setColeteOptions([]);
        setSelectedColeteOptionKey(null);
        setFocusedColeteOptionKey(null);
        setColeteAddressQuoteError(null);
        setCheckoutDetailsSaved(false);
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
        setAddressModalError(null);

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
            resetCheckoutCalculation();
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
            resetCheckoutCalculation();
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
            resetCheckoutCalculation();

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
        return cleanSavedDeliveryAddress(newAddress).error || "";
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
            setAddressModalError(validationError);
            return;
        }

        try {
            setAddressModalError(null);
            const normalizedAddress = cleanSavedDeliveryAddress(newAddress);
            if (normalizedAddress.error || !normalizedAddress.address) {
                throw new Error(normalizedAddress.error || "Adresa este invalida.");
            }

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

            if (newAddress.company.trim()) {
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

            resetAddressForm();
            await fetchUser();
            resetCheckoutCalculation();
        } catch (err: any) {
            setAddressModalError(err.message || "Eroare la salvarea adresei");
        }
    };

    const validateGuestForm = () => {
        return cleanGuestCheckoutDetails(guestForm).error || "";
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

        const cleaned = cleanSavedDeliveryAddress(input);
        if (cleaned.error || !cleaned.address) {
            throw new Error(cleaned.error || "Adresa selectata este invalida.");
        }

        await validateColeteAddress(cleaned.address);

        return setCheckoutShippingAddress(cleaned.address, recaptchaToken);
    };

    const setGuestOrderDetails = async () => {
        const validationError = validateGuestForm();

        if (validationError) {
            throw new Error(validationError);
        }

        const cleanedGuest = cleanGuestCheckoutDetails(guestForm);
        if (cleanedGuest.error || !cleanedGuest.customer || !cleanedGuest.address) {
            throw new Error(cleanedGuest.error || "Datele de livrare sunt invalide.");
        }

        const customerRecaptchaToken = await getRecaptchaToken("checkout");

        await setCheckoutCustomer(
            {
                firstName: cleanedGuest.customer.firstName,
                lastName: cleanedGuest.customer.lastName,
                emailAddress: cleanedGuest.customer.emailAddress,
                phoneNumber: cleanedGuest.customer.phoneNumber || undefined,
            },
            customerRecaptchaToken
        );

        const addressRecaptchaToken = await getRecaptchaToken("checkout");

        return setCheckoutShippingAddress(
            cleanedGuest.address,
            addressRecaptchaToken
        );
    };

    const ensureCheckoutDetailsOnOrder = async () => {
        if (checkoutDetailsSaved) {
            return order;
        }

        const updatedOrder = isAuthenticated
            ? await setLoggedInOrderAddress(await getRecaptchaToken("checkout"))
            : await setGuestOrderDetails();

        setOrder(updatedOrder);
        setCheckoutDetailsSaved(true);
        return updatedOrder;
    };

    const loadColeteDeliveryOptions = async () => {
        try {
            setMessage(null);
            setMessageType(null);
            setColeteAddressQuoteError(null);
            setColeteOptionsLoading(true);

            await ensureCheckoutDetailsOnOrder();

            const [addressResult, pointsResult] = await Promise.allSettled([
                getColeteCheckoutAddressQuote(),
                getColeteCheckoutShippingPoints(),
            ]);

            const options: ColeteDeliveryOption[] = [];

            if (addressResult.status === "fulfilled" && addressResult.value) {
                options.push(addressResult.value);
            } else if (addressResult.status === "rejected") {
                setColeteAddressQuoteError(addressResult.reason?.message || "Colete nu a returnat un pret pentru livrarea la adresa.");
            }

            if (pointsResult.status === "fulfilled") {
                options.push(...pointsResult.value);
            }

            if (!options.length) {
                const error =
                    addressResult.status === "rejected"
                        ? addressResult.reason?.message
                        : "Nu am primit optiuni de livrare de la Colete Online.";
                throw new Error(error || "Nu am primit optiuni de livrare de la Colete Online.");
            }

            setColeteOptions(options);

            const preferredOption = options.find((option) => option.deliveryType === "locker") || options[0];
            setFocusedColeteOptionKey(preferredOption ? coleteOptionKey(preferredOption) : null);
            setSelectedColeteOptionKey(null);
            setClientSecret(null);
        } catch (err: any) {
            setMessage(err.message || "Nu am putut calcula livrarea prin Colete Online.");
            setMessageType("error");
        } finally {
            setColeteOptionsLoading(false);
        }
    };

    // const setFirstAvailableShippingMethod = async () => {
    //     const methods = await getEligibleShippingMethods();
    //
    //     if (!methods.length) {
    //         throw new Error("Nu există metode de livrare disponibile pentru această comandă.");
    //     }
    //
    //     const standardMethod =
    //         methods.find((method: any) => method.code === "standard-shipping") ||
    //         methods[0];
    //
    //     return setCheckoutShippingMethod(standardMethod.id);
    // };

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

            if (!selectedColeteOption) {
                setMessage("Alege o metodă de livrare.");
                setMessageType("error");
                return;
            }

            await ensureCheckoutDetailsOnOrder();

            const { distanceKm, ...coleteSelectionInput } = selectedColeteOption;
            await setColeteCheckoutSelection({
                ...coleteSelectionInput,
                shippingPointDistanceKm: distanceKm ?? null,
            });

            const methods = await getEligibleShippingMethods();

            if (!methods.length) {
                throw new Error("Nu există metode de livrare disponibile pentru această comandă.");
            }

            setShippingMethods(methods);
            setShippingMethodsLoaded(true);

            const methodStillAvailable =
                selectedShippingMethodId &&
                methods.some((method: any) => method.id === selectedShippingMethodId);

            const shippingMethodId = methodStillAvailable
                ? selectedShippingMethodId
                : (
                    methods.find((method: any) => method.code === "colete-online") ||
                    methods.find((method: any) => method.code === "standard-shipping") ||
                    methods[0]
                ).id;

            setSelectedShippingMethodId(shippingMethodId);

            const orderWithShipping = await setCheckoutShippingMethod(shippingMethodId);

            setOrder(orderWithShipping);

            const secret = await createStripePaymentIntent();

            setClientSecret(secret);
            setMessage("Completează plata cu cardul.");
            setMessageType("success");

            setTimeout(() => {
                paymentSectionRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }, 100);
        } catch (err: any) {
            const errorMessage = err.message || "A apărut o eroare.";

            if (errorMessage.toLowerCase().includes("email address is not available")) {
                setMessage("Acest email este deja asociat unui cont. Autentifică-te pentru a continua sau folosește alt email.");
            } else {
                setMessage(errorMessage);
            }

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

    const totalValue = productTotal + shippingValue;



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
                                                    onClick={() => {
                                                        setSelectedAddressId(address.id);
                                                        resetCheckoutCalculation();
                                                    }}
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
                                onResetPayment={resetCheckoutCalculation}
                            />
                        )}

                        <div className="bg-white border border-[#d8d8d8] px-4 md:px-6 py-5">
                            <div className="flex items-center justify-between gap-4 mb-5">
                                <h2 className="text-[12px] font-Inter18Semibold uppercase">
                                    Metode de livrare
                                </h2>

                                <button
                                    type="button"
                                    onClick={loadColeteDeliveryOptions}
                                    disabled={coleteOptionsLoading || !!clientSecret}
                                    className="h-[34px] px-4 border border-[#1c1c1e] text-[10px] uppercase tracking-wide text-[#1c1c1e] hover:bg-[#1c1c1e] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                >
                                    {coleteOptionsLoading ? "Se calculează..." : "Calculează livrarea"}
                                </button>
                            </div>

                            {coleteOptions.length > 0 ? (
                                <div className="flex flex-col gap-4">
                                    {addressDeliveryOption ? (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedColeteOptionKey(coleteOptionKey(addressDeliveryOption));
                                                setFocusedColeteOptionKey(null);
                                                setClientSecret(null);
                                            }}
                                            className={`w-full border p-4 text-left cursor-pointer transition-colors ${
                                                selectedColeteOptionKey === coleteOptionKey(addressDeliveryOption)
                                                    ? "border-[#1c1c1e]"
                                                    : "border-[#d8d8d8] hover:border-neutral-500"
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <p className="text-[12px] font-Inter18Semibold text-[#1c1c1e]">
                                                        Livrare la adresă
                                                    </p>
                                                    <p className="mt-1 text-[10px] text-neutral-500">
                                                        {[addressDeliveryOption.courierName, addressDeliveryOption.serviceName].filter(Boolean).join(" - ")}
                                                    </p>
                                                </div>
                                                <span className="text-[12px] font-Inter18Semibold text-[#1c1c1e]">
                                                    {formatPrice(Math.round(addressDeliveryOption.priceWithTax * 100))}
                                                </span>
                                            </div>
                                        </button>
                                    ) : coleteAddressQuoteError ? (
                                        <div className="w-full border border-red-200 bg-red-50 p-4 text-left">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <p className="text-[12px] font-Inter18Semibold text-[#1c1c1e]">
                                                        Livrare la adresă
                                                    </p>
                                                    <p className="mt-1 text-[10px] text-red-700 leading-relaxed">
                                                        Momentan nu am putut calcula pretul pentru livrarea la adresă: {coleteAddressQuoteError}
                                                    </p>
                                                </div>
                                                <span className="text-[10px] uppercase tracking-wide text-red-700">
                                                    Indisponibil
                                                </span>
                                            </div>
                                        </div>
                                    ) : null}

                                    {lockerDeliveryOptions.length > 0 ? (
                                        <LockerMapPicker
                                            lockers={lockerDeliveryOptions}
                                            selectedKey={selectedColeteOptionKey}
                                            focusedKey={focusedColeteOptionKey}
                                            focusedOption={focusedColeteOption}
                                            getOptionKey={coleteOptionKey}
                                            formatPrice={formatPrice}
                                            onFocus={(option) => {
                                                setFocusedColeteOptionKey(coleteOptionKey(option));
                                            }}
                                            onConfirm={(option) => {
                                                setSelectedColeteOptionKey(coleteOptionKey(option));
                                                setFocusedColeteOptionKey(coleteOptionKey(option));
                                                setClientSecret(null);
                                            }}
                                        />
                                    ) : null}
                                </div>
                            ) : null}

                            {false && coleteOptions.length > 0 ? (
                                <div className="flex flex-col gap-3">
                                    {coleteOptions.map((option) => {
                                        const optionKey = coleteOptionKey(option);
                                        const isSelected = selectedColeteOptionKey === optionKey;
                                        const title =
                                            option.deliveryType === "locker"
                                                ? option.shippingPointName || "Locker"
                                                : "Livrare la adresa";
                                        const subtitle =
                                            option.deliveryType === "locker"
                                                ? option.shippingPointAddress
                                                : [option.courierName, option.serviceName].filter(Boolean).join(" - ");

                                        return (
                                            <button
                                                key={optionKey}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedColeteOptionKey(optionKey);
                                                    setClientSecret(null);
                                                }}
                                                className={`w-full border p-4 text-left cursor-pointer transition-colors ${
                                                    isSelected
                                                        ? "border-[#1c1c1e]"
                                                        : "border-[#d8d8d8] hover:border-neutral-500"
                                                }`}
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="min-w-0">
                                                        <p className="text-[12px] font-Inter18Semibold text-[#1c1c1e]">
                                                            {title}
                                                        </p>

                                                        {subtitle ? (
                                                            <p className="mt-1 text-[10px] text-neutral-500 leading-relaxed">
                                                                {subtitle}
                                                            </p>
                                                        ) : null}

                                                        <p className="mt-1 text-[10px] text-neutral-400 uppercase tracking-wide">
                                                            {option.deliveryType === "locker" ? "Ridicare din locker" : "Curier la adresa"}
                                                            {option.serviceName ? ` - ${option.serviceName}` : ""}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center gap-3 shrink-0">
                                                        <span className="text-[12px] font-Inter18Semibold text-[#1c1c1e]">
                                                            {formatPrice(Math.round(option.priceWithTax * 100))}
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

                                    {selectedColeteOption?.deliveryType === "locker" &&
                                    selectedColeteOption?.shippingPointLat &&
                                    selectedColeteOption?.shippingPointLng ? (
                                        <div className="mt-2 border border-[#d8d8d8] overflow-hidden">
                                            <iframe
                                                title="Locker map"
                                                src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                                                    (selectedColeteOption?.shippingPointLng || 0) - 0.01
                                                }%2C${(selectedColeteOption?.shippingPointLat || 0) - 0.01}%2C${
                                                    (selectedColeteOption?.shippingPointLng || 0) + 0.01
                                                }%2C${(selectedColeteOption?.shippingPointLat || 0) + 0.01}&layer=mapnik&marker=${
                                                    selectedColeteOption?.shippingPointLat || 0
                                                }%2C${selectedColeteOption?.shippingPointLng || 0}`}
                                                className="w-full h-[260px] border-0"
                                                loading="lazy"
                                            />
                                        </div>
                                    ) : null}
                                </div>
                            ) : coleteOptions.length === 0 ? (
                                <p className="text-[11px] text-neutral-500 leading-relaxed">
                                    Completeaza adresa si calculează livrarea pentru a vedea pretul Colete Online si lockerele apropiate.
                                </p>
                            ) : null}
                        </div>

                        {false && shippingMethodsLoaded && shippingMethods.length > 0 && (
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
                            <div
                                ref={paymentSectionRef}
                                className="bg-white border border-[#d8d8d8] px-4 md:px-6 py-5"
                            >
                                <h2 className="text-[12px] font-Inter18Semibold uppercase mb-5">
                                    Plata cu cardul
                                </h2>

                                <StripePaymentForm clientSecret={clientSecret} />
                            </div>
                        )}

                        <div className="bg-white border border-[#d8d8d8] px-4 py-5 lg:hidden">
                            <PriceSummary
                                productTotal={formatPrice(productTotal)}
                                shipping={formatPrice(shippingValue)}
                                vat={formatPrice(vatValue)}
                                total={formatPrice(totalValue)}
                                onPay={handlePayNow}
                                isPreparingPayment={isPreparingPayment}
                                disabled={!selectedColeteOption || !!clientSecret}
                            />
                        </div>
                    </div>

                    <div className="hidden lg:block bg-white border border-[#d8d8d8] p-6 sticky top-6">
                        <PriceSummary
                            productTotal={formatPrice(productTotal)}
                            shipping={formatPrice(shippingValue)}
                            vat={formatPrice(vatValue)}
                            total={formatPrice(totalValue)}
                            onPay={handlePayNow}
                            isPreparingPayment={isPreparingPayment}
                            disabled={!selectedColeteOption || !!clientSecret}
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
                        onClick={resetAddressForm}
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

                        {addressModalError && (
                            <div className="mb-5 border border-red-200 bg-red-50 px-4 py-3 text-xs leading-relaxed text-red-700">
                                {addressModalError}
                            </div>
                        )}

                        <div className="space-y-4 font-Inter">
                            <AddressInput label="Nume complet *" value={newAddress.fullName} onChange={(value) => setNewAddress({ ...newAddress, fullName: value })} placeholder="ex: Popescu Andrei" />
                            <AddressInput label="Companie (opțional)" value={newAddress.company} onChange={(value) => setNewAddress({ ...newAddress, company: value })} placeholder="Numele companiei" />
                            <AddressInput label="Adresă *" value={newAddress.streetLine1} onChange={(value) => setNewAddress({ ...newAddress, streetLine1: value })} placeholder="Strada, numărul, blocul, apartamentul" />
                            <AddressInput label="Adresă secundară (opțional)" value={newAddress.streetLine2} onChange={(value) => setNewAddress({ ...newAddress, streetLine2: value })} placeholder="Alte detalii despre adresă" />

                            <div className="grid grid-cols-2 gap-4">
                                <AddressInput label="Oraș *" value={newAddress.city} onChange={(value) => setNewAddress({ ...newAddress, city: value })} placeholder="Oraș" />
                                <AddressInput label="Județ / sector *" value={newAddress.province} onChange={(value) => setNewAddress({ ...newAddress, province: value })} placeholder="Județ sau sector" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <AddressInput label="Cod poștal *" value={newAddress.postalCode} onChange={(value) => setNewAddress({ ...newAddress, postalCode: value })} placeholder="Cod poștal" />
                                <AddressInput label="Telefon *" value={newAddress.phoneNumber} onChange={(value) => setNewAddress({ ...newAddress, phoneNumber: value })} placeholder="07xx xxx xxx" />
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

function LockerMapPicker({
                             lockers,
                             selectedKey,
                             focusedKey,
                             focusedOption,
                             getOptionKey,
                             formatPrice,
                             onFocus,
                             onConfirm,
                         }: {
    lockers: ColeteDeliveryOption[];
    selectedKey: string | null;
    focusedKey: string | null;
    focusedOption: ColeteDeliveryOption | null;
    getOptionKey: (option: ColeteDeliveryOption) => string;
    formatPrice: (value?: number) => string;
    onFocus: (option: ColeteDeliveryOption) => void;
    onConfirm: (option: ColeteDeliveryOption) => void;
}) {
    const zoom = 14;
    const tileSize = 256;
    const mapWidth = 760;
    const mapHeight = 340;
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [locationStatus, setLocationStatus] = useState<"idle" | "loading" | "allowed" | "denied">("idle");
    const [locationError, setLocationError] = useState<string | null>(null);
    const dragStartRef = useRef<{ pointerId: number; x: number; y: number; panX: number; panY: number; moved: boolean } | null>(null);
    const validLockers = lockers.filter(
        (locker) =>
            typeof locker.shippingPointLat === "number" &&
            typeof locker.shippingPointLng === "number"
    );

    const centerLat =
        validLockers.reduce((sum, locker) => sum + (locker.shippingPointLat || 0), 0) /
        Math.max(validLockers.length, 1);
    const centerLng =
        validLockers.reduce((sum, locker) => sum + (locker.shippingPointLng || 0), 0) /
        Math.max(validLockers.length, 1);
    const center = latLngToWorld(centerLat, centerLng, zoom);
    const focused =
        focusedOption?.deliveryType === "locker"
            ? focusedOption
            : validLockers[0] || null;
    const viewCenter = {
        x: center.x - pan.x,
        y: center.y - pan.y,
    };
    const tileBuffer = tileSize;
    const startTileX = Math.floor((viewCenter.x - mapWidth / 2 - tileBuffer) / tileSize);
    const endTileX = Math.floor((viewCenter.x + mapWidth / 2 + tileBuffer) / tileSize);
    const startTileY = Math.floor((viewCenter.y - mapHeight / 2 - tileBuffer) / tileSize);
    const endTileY = Math.floor((viewCenter.y + mapHeight / 2 + tileBuffer) / tileSize);
    const tiles = [];

    for (let x = startTileX; x <= endTileX; x += 1) {
        for (let y = startTileY; y <= endTileY; y += 1) {
            tiles.push({ x, y });
        }
    }

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        dragStartRef.current = {
            pointerId: event.pointerId,
            x: event.clientX,
            y: event.clientY,
            panX: pan.x,
            panY: pan.y,
            moved: false,
        };
    };

    const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        const dragStart = dragStartRef.current;
        if (!dragStart || dragStart.pointerId !== event.pointerId) return;

        const deltaX = event.clientX - dragStart.x;
        const deltaY = event.clientY - dragStart.y;

        if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
            dragStart.moved = true;
        }

        setPan({
            x: dragStart.panX + deltaX,
            y: dragStart.panY + deltaY,
        });
    };

    const handlePointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
        if (dragStartRef.current?.pointerId === event.pointerId) {
            dragStartRef.current = null;
        }
    };

    const focusLocker = (locker: ColeteDeliveryOption) => {
        onFocus(locker);
    };

    const requestUserLocation = () => {
        if (!navigator.geolocation) {
            setLocationStatus("denied");
            setLocationError("Browserul nu suporta localizarea.");
            return;
        }

        setLocationStatus("loading");
        setLocationError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const nextLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                const userPoint = latLngToWorld(nextLocation.lat, nextLocation.lng, zoom);
                const nearestLocker = validLockers
                    .map((locker) => ({
                        locker,
                        distance: distanceKmBetween(
                            nextLocation.lat,
                            nextLocation.lng,
                            locker.shippingPointLat || 0,
                            locker.shippingPointLng || 0
                        ),
                    }))
                    .sort((a, b) => a.distance - b.distance)[0]?.locker;

                setUserLocation(nextLocation);
                setPan({
                    x: center.x - userPoint.x,
                    y: center.y - userPoint.y,
                });
                setLocationStatus("allowed");

                if (nearestLocker) {
                    onFocus(nearestLocker);
                }
            },
            () => {
                setLocationStatus("denied");
                setLocationError("Nu am putut accesa locatia. Puteti alege lockerul manual.");
            },
            {
                enableHighAccuracy: false,
                timeout: 8000,
                maximumAge: 300000,
            }
        );
    };

    const userPoint = userLocation ? latLngToWorld(userLocation.lat, userLocation.lng, zoom) : null;

    return (
        <div className="border border-[#d8d8d8]">
            <div
                className="relative h-[340px] overflow-hidden bg-[#e8ecef] cursor-grab active:cursor-grabbing touch-none"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerEnd}
                onPointerCancel={handlePointerEnd}
            >
                {tiles.map((tile) => (
                    <img
                        key={`${tile.x}-${tile.y}`}
                        src={`https://tile.openstreetmap.org/${zoom}/${tile.x}/${tile.y}.png`}
                        alt=""
                        draggable={false}
                        className="absolute w-[256px] h-[256px] select-none"
                        style={{
                            left: `calc(50% + ${tile.x * tileSize - viewCenter.x}px)`,
                            top: `calc(50% + ${tile.y * tileSize - viewCenter.y}px)`,
                        }}
                    />
                ))}

                <div className="absolute inset-0 bg-white/10 pointer-events-none" />

                <div className="absolute left-3 top-3 z-20 flex flex-col items-start gap-2">
                    <button
                        type="button"
                        onPointerDown={(event) => event.stopPropagation()}
                        onClick={requestUserLocation}
                        disabled={locationStatus === "loading"}
                        className="bg-white border border-[#d8d8d8] px-3 py-2 text-[10px] uppercase tracking-wide text-[#1c1c1e] shadow-sm hover:border-[#1c1c1e] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {locationStatus === "loading" ? "Se cauta..." : "Foloseste locatia mea"}
                    </button>

                    {locationError ? (
                        <div className="max-w-[220px] bg-white/95 border border-red-200 px-3 py-2 text-[10px] leading-relaxed text-red-700 shadow-sm">
                            {locationError}
                        </div>
                    ) : null}
                </div>

                {userPoint ? (
                    <div
                        className="absolute z-10 w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#0ea5e9] shadow-md"
                        style={{
                            left: `calc(50% + ${userPoint.x - viewCenter.x}px)`,
                            top: `calc(50% + ${userPoint.y - viewCenter.y}px)`,
                        }}
                        title="Locatia ta"
                    />
                ) : null}

                {validLockers.map((locker) => {
                    const key = getOptionKey(locker);
                    const point = latLngToWorld(locker.shippingPointLat || 0, locker.shippingPointLng || 0, zoom);
                    const isSelected = selectedKey === key;
                    const isFocused = focusedKey === key;

                    return (
                        <button
                            key={key}
                            type="button"
                            onPointerDown={(event) => event.stopPropagation()}
                            onClick={() => focusLocker(locker)}
                            className={`absolute z-10 w-5 h-5 -translate-x-1/2 -translate-y-full rotate-45 border border-white shadow-md cursor-pointer ${
                                isSelected
                                    ? "bg-[#1c1c1e]"
                                    : isFocused
                                        ? "bg-[#0ea5e9]"
                                        : "bg-red-600"
                            }`}
                            style={{
                                left: `calc(50% + ${point.x - viewCenter.x}px)`,
                                top: `calc(50% + ${point.y - viewCenter.y}px)`,
                            }}
                            aria-label={locker.shippingPointName || "Locker"}
                            title={locker.shippingPointName || "Locker"}
                        >
                            <span className="absolute left-1/2 top-1/2 block w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
                        </button>
                    );
                })}

                <a
                    href="https://www.openstreetmap.org/copyright"
                    target="_blank"
                    rel="noreferrer"
                    className="absolute bottom-1 right-2 text-[9px] text-neutral-500 bg-white/80 px-1"
                >
                    OpenStreetMap
                </a>
            </div>

            {focused ? (
                <div className="p-4 border-t border-[#d8d8d8] bg-white">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="min-w-0">
                            <p className="text-[12px] font-Inter18Semibold text-[#1c1c1e]">
                                {focused.shippingPointName || "Locker"}
                            </p>
                            <p className="mt-1 text-[10px] text-neutral-500 leading-relaxed">
                                {focused.shippingPointAddress}
                            </p>
                            <p className="mt-1 text-[10px] text-neutral-400 uppercase tracking-wide">
                                {[focused.courierName, focused.serviceName].filter(Boolean).join(" - ")}
                            </p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                            <span className="text-[12px] font-Inter18Semibold text-[#1c1c1e]">
                                {formatPrice(Math.round(focused.priceWithTax * 100))}
                            </span>
                            <button
                                type="button"
                                onClick={() => onConfirm(focused)}
                                className="h-[34px] px-4 bg-[#1c1c1e] text-white text-[10px] uppercase tracking-wide hover:bg-black transition-colors cursor-pointer"
                            >
                                Confirmă
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}

function latLngToWorld(lat: number, lng: number, zoom: number) {
    const sinLat = Math.sin((lat * Math.PI) / 180);
    const scale = 256 * 2 ** zoom;

    return {
        x: ((lng + 180) / 360) * scale,
        y: (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * scale,
    };
}

function distanceKmBetween(latA: number, lngA: number, latB: number, lngB: number) {
    const earthRadiusKm = 6371;
    const toRadians = (value: number) => (value * Math.PI) / 180;
    const deltaLat = toRadians(latB - latA);
    const deltaLng = toRadians(lngB - lngA);
    const a =
        Math.sin(deltaLat / 2) ** 2 +
        Math.cos(toRadians(latA)) *
            Math.cos(toRadians(latB)) *
            Math.sin(deltaLng / 2) ** 2;

    return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function GuestCheckoutForm({
                               guestForm,
                               setGuestForm,
                               countries,
                               onResetPayment,
                           }: {
    guestForm: any;
    setGuestForm: (value: any) => void;
    countries: any[];
    onResetPayment: () => void;
}) {

    const updateGuestForm = (value: any) => {
        onResetPayment();
        setGuestForm(value);
    };

    return (
        <div className="bg-white border border-[#d8d8d8] px-4 md:px-6 py-5">
            <h2 className="text-[12px] font-Inter18Semibold uppercase mb-5">
                Detalii livrare
            </h2>

            <p className="text-[11px] text-neutral-400 mb-5">
                Ai deja cont?{" "}
                <Link
                    href="/login"
                    className="underline text-neutral-700 hover:text-black"
                >
                    Autentifică-te
                </Link>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AddressInput label="Prenume *" value={guestForm.firstName} onChange={(value) => updateGuestForm({ ...guestForm, firstName: value })} placeholder="Prenume" />
                <AddressInput label="Nume *" value={guestForm.lastName} onChange={(value) => updateGuestForm({ ...guestForm, lastName: value })} placeholder="Nume" />
                <AddressInput label="Email *" value={guestForm.emailAddress} onChange={(value) => updateGuestForm({ ...guestForm, emailAddress: value })} placeholder="Email" type="email" />
                <AddressInput label="Telefon *" value={guestForm.phoneNumber} onChange={(value) => updateGuestForm({ ...guestForm, phoneNumber: value })} placeholder="Telefon" />
            </div>

            <div className="mt-4 space-y-4">
                <AddressInput label="Companie (opțional)" value={guestForm.company} onChange={(value) => updateGuestForm({ ...guestForm, company: value })} placeholder="Numele companiei" />
                <AddressInput label="Adresă *" value={guestForm.streetLine1} onChange={(value) => updateGuestForm({ ...guestForm, streetLine1: value })} placeholder="Strada, numărul, blocul, apartamentul" />
                <AddressInput label="Adresă secundară (opțional)" value={guestForm.streetLine2} onChange={(value) => updateGuestForm({ ...guestForm, streetLine2: value })} placeholder="Alte detalii despre adresă" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AddressInput label="Oraș *" value={guestForm.city} onChange={(value) => updateGuestForm({ ...guestForm, city: value })} placeholder="Oraș" />
                    <AddressInput label="Județ / sector *" value={guestForm.province} onChange={(value) => updateGuestForm({ ...guestForm, province: value })} placeholder="Județ sau sector" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AddressInput label="Cod poștal *" value={guestForm.postalCode} onChange={(value) => updateGuestForm({ ...guestForm, postalCode: value })} placeholder="Cod poștal" />
                    <CountrySelect value={guestForm.countryCode} onChange={(value) => updateGuestForm({ ...guestForm, countryCode: value })} countries={countries} />
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
                          shipping,
                          vat,
                          total,
                          onPay,
                          isPreparingPayment,
                          disabled,
                      }: {
    productTotal: string;
    shipping: string;
    vat: string;
    total: string;
    onPay: () => void;
    isPreparingPayment: boolean;
    disabled: boolean;
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
                    <span>Livrare</span>
                    <span>{shipping}</span>
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
                disabled={isPreparingPayment || disabled}
                className="w-full h-[46px] bg-black text-white text-[11px] font-Inter18Semibold uppercase tracking-[0.08em] hover:bg-[#1c1c1e] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isPreparingPayment
                    ? "Se pregătește plata..."
                    : "Continuă către plată"}
            </button>
        </div>
    );
}

