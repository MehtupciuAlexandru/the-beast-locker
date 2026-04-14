import { graphqlRequest } from "../graphql/client";

export async function getAvailableCountries() {
    const query = `
        query {
            availableCountries {
                id
                code
                name
            }
        }
    `;

    return graphqlRequest(query, {}, true);
}