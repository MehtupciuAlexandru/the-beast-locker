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
                                price
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
        price: p.variants[0]?.price || 0,
    }));
}