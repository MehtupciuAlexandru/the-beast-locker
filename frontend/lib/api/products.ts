import { getProductsForListing } from "@/lib/api/search";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getProducts(collectionSlug?: string, searchTerm?: string) {
    return getProductsForListing(collectionSlug, searchTerm);
}

export async function getProductBySlug(slug: string) {
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
                query GetProduct($slug: String!) {
                    products(
                        options: {
                            filter: { slug: { eq: $slug } }
                            take: 1
                        }
                    ) {
                        items {
                            id
                            name
                            slug
                            description
                            featuredAsset {
                                preview
                            }
                            assets {
                                preview
                            }
                            variants {
                                id
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
            variables: { slug },
        }),
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch product: ${res.status}`);
    }

    const json = await res.json();

    if (json.errors) {
        throw new Error(json.errors[0].message);
    }

    const p = json?.data?.products?.items?.[0];

    if (!p) return null;

    const variant = p.variants?.[0];

    return {
        id: p.id,
        variantId: variant?.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        image: p.featuredAsset?.preview || "",
        gallery: p.assets?.map((a: any) => a.preview) || [],
        price: (variant?.priceWithTax || 0) / 100,
        seoTitle: p.customFields?.seoTitle || "",
        seoDescription: p.customFields?.seoDescription || "",
        searchKeywords: p.customFields?.searchKeywords || "",
    };
}