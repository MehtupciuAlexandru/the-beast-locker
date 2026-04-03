const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function graphqlRequest(
    query: string,
    variables: Record<string, any> = {},
    withAuth: boolean = false
) {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
            query,
            variables,
        }),
    });

    const json = await res.json();

    if (json.errors) {
        throw new Error(json.errors[0].message);
    }

    return json.data;
}