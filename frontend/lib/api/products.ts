const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function getProducts() {
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
    });

    const json = await res.json();

    return json.data.products.items.map((p: any) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        image: p.featuredAsset?.preview || "",
        price: p.variants[0]?.price || 0,
    }));
    console.log("FETCHING FROM VENDURE");
}