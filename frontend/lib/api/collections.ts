const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type StoreCollection = {
    id: string;
    name: string;
    slug: string;
};

export async function getCollections(): Promise<StoreCollection[]> {
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
                    collections {
                        items {
                            id
                            name
                            slug
                        }
                    }
                }
            `,
        }),
        cache: "no-store",
    });

    const json = await res.json();

    if (json.errors) {
        throw new Error(json.errors[0].message);
    }

    return json.data.collections.items;
}