import { ProductPreview } from "@/types/product";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type SearchSuggestion = ProductPreview & {
    searchKeywords?: string;
    seoTitle?: string;
    seoDescription?: string;
    description?: string;
};

function normalizeText(value: string) {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

function matchesSearchTerm(product: SearchSuggestion, term: string) {
    const normalizedTerm = normalizeText(term.trim());

    if (!normalizedTerm) return true;

    const searchableText = normalizeText(
        [
            product.name,
            product.slug,
            product.searchKeywords,
            product.seoTitle,
            product.seoDescription,
            product.description,
        ]
            .filter(Boolean)
            .join(" ")
    );

    return normalizedTerm
        .split(/\s+/)
        .every((word) => searchableText.includes(word));
}

function uniqueProducts(products: SearchSuggestion[]) {
    const map = new Map<string, SearchSuggestion>();

    for (const product of products) {
        if (!map.has(product.id)) {
            map.set(product.id, product);
        }
    }

    return Array.from(map.values());
}

function mapProduct(product: any): SearchSuggestion {
    const variant = product.variants?.[0];

    return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description || "",
        image: product.featuredAsset?.preview || "",
        price: (variant?.priceWithTax || 0) / 100,
        searchKeywords: product.customFields?.searchKeywords || "",
        seoTitle: product.customFields?.seoTitle || "",
        seoDescription: product.customFields?.seoDescription || "",
    };
}

function mapCollectionProduct(item: any): SearchSuggestion {
    const product = item.product;

    return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description || "",
        image: product.featuredAsset?.preview || "",
        price: (item.priceWithTax || 0) / 100,
        searchKeywords: product.customFields?.searchKeywords || "",
        seoTitle: product.customFields?.seoTitle || "",
        seoDescription: product.customFields?.seoDescription || "",
    };
}

async function fetchAllProducts(): Promise<SearchSuggestion[]> {
    if (!API_URL) {
        throw new Error("NEXT_PUBLIC_API_URL is not defined");
    }

    const res = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: `
                query SearchableProducts {
                    products(options: { take: 100 }) {
                        items {
                            id
                            name
                            slug
                            description
                            featuredAsset {
                                preview
                            }
                            variants {
                                priceWithTax
                            }
                            customFields {
                                seoTitle
                                seoDescription
                                searchKeywords
                            }
                        }
                    }
                }
            `,
        }),
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch products: ${res.status}`);
    }

    const json = await res.json();

    if (json.errors) {
        throw new Error(json.errors[0].message);
    }

    return json.data.products.items.map(mapProduct);
}

async function fetchCollectionProducts(collectionSlug: string): Promise<SearchSuggestion[]> {
    if (!API_URL) {
        throw new Error("NEXT_PUBLIC_API_URL is not defined");
    }

    const res = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: `
                query SearchableCollectionProducts($slug: String!) {
                    collection(slug: $slug) {
                        productVariants(options: { take: 100 }) {
                            items {
                                id
                                priceWithTax
                                product {
                                    id
                                    name
                                    slug
                                    description
                                    featuredAsset {
                                        preview
                                    }
                                    customFields {
                                        seoTitle
                                        seoDescription
                                        searchKeywords
                                    }
                                }
                            }
                        }
                    }
                }
            `,
            variables: {
                slug: collectionSlug,
            },
        }),
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch collection products: ${res.status}`);
    }

    const json = await res.json();

    if (json.errors) {
        throw new Error(json.errors[0].message);
    }

    const items = json.data.collection?.productVariants?.items || [];

    return uniqueProducts(items.map(mapCollectionProduct));
}

export async function getProductsForListing(
    collectionSlug?: string,
    searchTerm?: string
): Promise<ProductPreview[]> {
    const products = collectionSlug
        ? await fetchCollectionProducts(collectionSlug)
        : await fetchAllProducts();

    if (!searchTerm?.trim()) {
        return products;
    }

    return products.filter((product) => matchesSearchTerm(product, searchTerm));
}

export async function getSearchSuggestions(term: string): Promise<SearchSuggestion[]> {
    if (term.trim().length < 2) return [];

    const products = await fetchAllProducts();

    return products
        .filter((product) => matchesSearchTerm(product, term))
        .slice(0, 5);
}