export type DeliveryAddressForm = {
    fullName?: string;
    company?: string;
    streetLine1?: string;
    streetLine2?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    phoneNumber?: string;
    countryCode?: string;
};

export type GuestCheckoutForm = DeliveryAddressForm & {
    firstName?: string;
    lastName?: string;
    emailAddress?: string;
};

const NAME_PATTERN = /^[\p{L}\p{M} .'-]{2,80}$/u;
const LOCATION_PATTERN = /^[\p{L}\p{M} .'-]{2,80}$/u;

export function normalizeRomanianPhone(value?: string): string | null {
    const digits = (value || "").replace(/\D/g, "");

    if (digits.length === 10 && digits.startsWith("07")) {
        return digits;
    }

    if (digits.length === 11 && digits.startsWith("407")) {
        return `0${digits.slice(2)}`;
    }

    if (digits.length === 12 && digits.startsWith("00407")) {
        return `0${digits.slice(4)}`;
    }

    return null;
}

export function normalizePostalCode(value?: string): string {
    return (value || "").replace(/\D/g, "");
}

export function normalizeRomanianProvince(value?: string, city?: string): string {
    const cleaned = cleanText(value);
    const normalizedCity = normalizeAddressToken(city);
    const normalizedProvince = normalizeAddressToken(cleaned);

    if (normalizedCity === "bucuresti" || normalizedCity === "bucharest") {
        const sectorMatch = normalizedProvince.match(/^(?:s|sector|sectorul)?\s*([1-6])$/);
        if (sectorMatch) {
            return `Sectorul ${sectorMatch[1]}`;
        }

        const sectorTextMatch = normalizedProvince.match(/sector(?:ul)?\s*([1-6])/);
        if (sectorTextMatch) {
            return `Sectorul ${sectorTextMatch[1]}`;
        }

        if (["bucuresti", "municipiul bucuresti", "mun bucuresti"].includes(normalizedProvince)) {
            return "Bucuresti";
        }
    }

    return cleaned
        .replace(/\b(judetul|judet|jud\.|county|mun\.|municipiul)\b/gi, "")
        .replace(/\s+/g, " ")
        .trim();
}

export function cleanSavedDeliveryAddress(input: DeliveryAddressForm) {
    const fullName = cleanText(input.fullName);
    const phoneNumber = normalizeRomanianPhone(input.phoneNumber);
    const streetLine1 = cleanText(input.streetLine1);
    const streetLine2 = cleanText(input.streetLine2);
    const city = cleanText(input.city);
    const province = normalizeRomanianProvince(input.province, city);
    const postalCode = normalizePostalCode(input.postalCode);
    const company = cleanText(input.company);
    const countryCode = cleanText(input.countryCode || "RO").toUpperCase();

    const commonError = validateCommonAddress({
        fullName,
        phoneNumber,
        streetLine1,
        streetLine2,
        city,
        province,
        postalCode,
        countryCode,
        company,
    });

    if (commonError) {
        return { error: commonError };
    }

    return {
        address: {
            fullName,
            company: company || undefined,
            streetLine1,
            streetLine2: streetLine2 || undefined,
            city,
            province,
            postalCode,
            phoneNumber,
            countryCode,
        },
    };
}

export function cleanGuestCheckoutDetails(input: GuestCheckoutForm) {
    const firstName = cleanText(input.firstName);
    const lastName = cleanText(input.lastName);
    const emailAddress = cleanText(input.emailAddress).toLowerCase();

    if (!NAME_PATTERN.test(firstName)) {
        return { error: "Introduceti un prenume valid." };
    }

    if (!NAME_PATTERN.test(lastName)) {
        return { error: "Introduceti un nume valid." };
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailAddress)) {
        return { error: "Introduceti o adresa de email valida." };
    }

    const saved = cleanSavedDeliveryAddress({
        ...input,
        fullName: `${firstName} ${lastName}`,
    });

    if (saved.error || !saved.address) {
        return { error: saved.error || "Datele de livrare sunt invalide." };
    }

    return {
        customer: {
            firstName,
            lastName,
            emailAddress,
            phoneNumber: saved.address.phoneNumber,
        },
        address: saved.address,
    };
}

function validateCommonAddress(input: {
    fullName: string;
    streetLine1: string;
    city: string;
    province: string;
    postalCode: string;
    phoneNumber: string | null;
    countryCode: string;
    streetLine2?: string;
    company?: string;
}) {
    if (input.countryCode !== "RO") {
        return "Momentan livrarea Colete Online este disponibila doar in Romania.";
    }

    if (!NAME_PATTERN.test(input.fullName)) {
        return "Introduceti numele complet folosind cel putin doua litere.";
    }

    if (!input.phoneNumber) {
        return "Introduceti un numar de telefon romanesc valid.";
    }

    if (!/^\d{6}$/.test(input.postalCode)) {
        return "Codul postal trebuie sa contina exact 6 cifre.";
    }

    if (!LOCATION_PATTERN.test(input.city)) {
        return "Introduceti un oras valid.";
    }

    if (!input.province || input.province.length < 1 || input.province.length > 80 || hasControlChars(input.province)) {
        return "Introduceti judetul sau sectorul.";
    }

    if (input.streetLine1.length < 5 || input.streetLine1.length > 140 || hasControlChars(input.streetLine1)) {
        return "Introduceti o adresa valida.";
    }

    if (!/\p{L}/u.test(input.streetLine1) || !/\d/.test(input.streetLine1)) {
        return "Adresa trebuie sa contina strada si numarul.";
    }

    if (input.streetLine2 && (input.streetLine2.length > 140 || hasControlChars(input.streetLine2))) {
        return "Detaliile suplimentare ale adresei sunt prea lungi.";
    }

    if (input.company && (input.company.length > 100 || hasControlChars(input.company))) {
        return "Numele companiei este prea lung.";
    }

    return "";
}

function cleanText(value?: string): string {
    return (value || "").replace(/\s+/g, " ").trim();
}

function normalizeAddressToken(value?: string): string {
    return cleanText(value)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .trim();
}

function hasControlChars(value: string): boolean {
    return /[\u0000-\u001F\u007F]/.test(value);
}
