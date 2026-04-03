import { graphqlRequest } from "../graphql/client";

export async function setDefaultAddress(addressId: string) {
    const mutation = `
        mutation SetDefaultAddress($input: UpdateAddressInput!) {
            updateCustomerAddress(input: $input) {
                id
                defaultShippingAddress
                defaultBillingAddress
            }
        }
    `;

    return graphqlRequest(
        mutation,
        {
            input: {
                id: addressId,
                defaultShippingAddress: true,
                defaultBillingAddress: true,
            },
        },
        true
    );
}