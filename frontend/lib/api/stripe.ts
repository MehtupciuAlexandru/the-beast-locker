import { graphqlRequest } from "@/lib/graphql/client";

export async function createStripePaymentIntent() {
    const query = `
        mutation CreateStripePaymentIntent {
            createStripePaymentIntent
        }
    `;

    const data = await graphqlRequest(query, {}, true);

    return data.createStripePaymentIntent as string;
}