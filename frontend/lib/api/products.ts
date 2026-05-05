const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getProducts(collectionSlug?: string, searchTerm?: string) {
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
                query GetProducts($collectionSlug: String, $term: String) {
                    search(input: {
                        collectionSlug: $collectionSlug
                        term: $term
                        groupByProduct: true
                    }) {
                        items {
                            productId
                            productName
                            slug
                            productAsset {
                                preview
                            }
                            priceWithTax {
                                ... on SinglePrice {
                                    value
                                }
                                ... on PriceRange {
                                    min
                                }
                            }
                        }
                    }
                }
            `,
            variables: {
                collectionSlug: collectionSlug || undefined,
                term: searchTerm || undefined,
            },
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

    if (!json?.data?.search?.items) {
        throw new Error("Invalid products response");
    }

    return json.data.search.items.map((p: any) => {
        const price =
            p.priceWithTax?.value ??
            p.priceWithTax?.min ??
            0;

        return {
            id: p.productId,
            name: p.productName,
            slug: p.slug,
            image: p.productAsset?.preview || "",
            price: price / 100,
        };
    });
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
                        }
                    }
                }
            `,
            variables: { slug },
        }),
        cache: "no-store",
    });

    const json = await res.json();

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
    };
}