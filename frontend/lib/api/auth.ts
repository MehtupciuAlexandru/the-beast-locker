import { graphqlRequest } from "../graphql/client";

// REGISTER
export async function register(
    email: string,
    password: string,
    firstName: string,
    lastName: string
) {
    const query = `
        mutation Register($input: RegisterCustomerInput!) {
            validatedRegisterCustomerAccount(input: $input) {
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

    const variables = {
        input: {
            emailAddress: email,
            password,
            firstName,
            lastName,
        },
    };

    const data = await graphqlRequest(query, variables);

    const result = data.registerCustomerAccount;

    if (result.__typename !== "Success") {
        throw new Error(result.message || "Înregistrare eșuată");
    }

    return result;
}

// LOGIN
export async function login(email: string, password: string) {
    const query = `
        mutation Login($email: String!, $password: String!) {
            login(username: $email, password: $password) {
                __typename
                ... on CurrentUser {
                    id
                    identifier
                }
                ... on ErrorResult {
                    message
                }
            }
        }
    `;

    const data = await graphqlRequest(query, { email, password }, true);

    const result = data.login;

    if (result.__typename !== "CurrentUser") {
        throw new Error(result.message || "Autentificare eșuată");
    }

    return result;
}

// LOGOUT
export async function logout() {
    const query = `
        mutation {
            logout {
                success
            }
        }
    `;

    return graphqlRequest(query, {}, true);
}

// ACTIVE CUSTOMER
export async function getActiveCustomer() {
    const query = `
        query {
            activeCustomer {
                id
                emailAddress
            }
        }
    `;

    return graphqlRequest(query, {}, true);
}

// VERIFY EMAIL
export async function verifyCustomerAccount(token: string) {
    const query = `
        mutation VerifyCustomer($token: String!) {
            verifyCustomerAccount(token: $token) {
                ... on CurrentUser {
                    id
                }
                ... on ErrorResult {
                    message
                }
            }
        }
    `;

    return graphqlRequest(query, { token }, true);
}