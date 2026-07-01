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

export async function updateCustomerDetails(input: {
    firstName?: string;
    lastName?: string;
}) {
    const mutation = `
        mutation UpdateCustomer($input: UpdateCustomerInput!) {
            updateCustomer(input: $input) {
                id
                firstName
                lastName
            }
        }
    `;

    return graphqlRequest(mutation, { input }, true);
}

export async function updatePassword(
    currentPassword: string,
    newPassword: string
) {
    const mutation = `
        mutation UpdateCustomerPassword($currentPassword: String!, $newPassword: String!) {
            updateCustomerPassword(
                currentPassword: $currentPassword
                newPassword: $newPassword
            ) {
                __typename
                ... on Success {
                    success
                }
                ... on ErrorResult {
                    message
                }
            }
        }
    `;

    return graphqlRequest(
        mutation,
        { currentPassword, newPassword },
        true
    );
}

export async function createCustomerAddress(input: any) {
    const mutation = `
        mutation CreateAddress($input: CreateAddressInput!) {
            createCustomerAddress(input: $input) {
                id
            }
        }
    `;

    return graphqlRequest(mutation, { input }, true);
}

export async function updateCustomerAddress(id: string, input: any) {
    const mutation = `
        mutation UpdateAddress($input: UpdateAddressInput!) {
            updateCustomerAddress(input: $input) {
                id
            }
        }
    `;

    return graphqlRequest(
        mutation,
        {
            input: {
                id,
                ...input,
            },
        },
        true
    );
}

export async function deleteCustomerAddress(id: string) {
    const mutation = `
    mutation DeleteAddress($id: ID!) {
        deleteCustomerAddress(id: $id) {
            success
        }
    }
`;

    return graphqlRequest(mutation, { id }, true);
}

export async function validateColeteAddress(input: any) {
    const query = `
        query ValidateColeteAddress($input: ColeteAddressValidationInput!) {
            validateColeteAddress(input: $input) {
                valid
                message
                city
                county
                countyCode
                street
                phoneNumber
            }
        }
    `;

    const data = await graphqlRequest(query, { input }, true);
    const result = data.validateColeteAddress;

    if (!result?.valid) {
        throw new Error(result?.message || "Adresa nu poate fi validata pentru Colete Online.");
    }

    return result;
}
