import { ProductPreview } from "@/types/product";

const RECENTLY_VIEWED_KEY = "beast-locker-recently-viewed";
const MAX_RECENTLY_VIEWED = 5;

export function getRecentlyViewedProducts(): ProductPreview[] {
    if (typeof window === "undefined") return [];

    try {
        const storedProducts = window.localStorage.getItem(RECENTLY_VIEWED_KEY);

        if (!storedProducts) return [];

        return JSON.parse(storedProducts);
    } catch {
        return [];
    }
}

export function addRecentlyViewedProduct(product: ProductPreview) {
    if (typeof window === "undefined") return;

    try {
        const existingProducts = getRecentlylyViewedProductsSafe();

        const filteredProducts = existingProducts.filter(
            (item) => item.id !== product.id
        );

        const updatedProducts = [
            product,
            ...filteredProducts,
        ].slice(0, MAX_RECENTLY_VIEWED);

        window.localStorage.setItem(
            RECENTLY_VIEWED_KEY,
            JSON.stringify(updatedProducts)
        );
    } catch {
        return;
    }
}

function getRecentlylyViewedProductsSafe(): ProductPreview[] {
    try {
        const storedProducts = window.localStorage.getItem(RECENTLY_VIEWED_KEY);

        if (!storedProducts) return [];

        return JSON.parse(storedProducts);
    } catch {
        return [];
    }
}