const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getProducts() {
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
                query {
                    products {
                        items {
                            id
                            name
                            slug
                            featuredAsset {
                                preview
                            }
                            variants {
                                priceWithTax
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

    if (!json?.data?.products?.items) {
        throw new Error("Invalid products response");
    }

    console.log("FETCHING FROM VENDURE");

    return json.data.products.items.map((p: any) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        image: p.featuredAsset?.preview || "",
        price: (p.variants[0]?.priceWithTax || 0) / 100,
    }));
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