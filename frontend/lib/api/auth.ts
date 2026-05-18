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

    const result = data?.validatedRegisterCustomerAccount;

    if (!result) {
        throw new Error("No response from server");
    }

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
        query GetActiveCustomer {
            activeCustomer {
                id
                emailAddress
                firstName
                lastName
                addresses {
                    id
                    fullName
                    streetLine1
                    streetLine2
                    city
                    province
                    postalCode
                    phoneNumber
                    defaultShippingAddress
                    defaultBillingAddress
                    country {
                        code
                        name
                    }
                }
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

// FORGOR PASSWORD
export async function forgotPassword(emailAddress: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop-api`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
            query: `
                mutation RequestPasswordReset($emailAddress: String!) {
                    requestPasswordReset(emailAddress: $emailAddress) {
                        ... on Success {
                            success
                        }
                        ... on ErrorResult {
                            errorCode
                            message
                        }
                    }
                }
            `,
            variables: {
                emailAddress,
            },
        }),
    });

    const result = await response.json();

    if (result.errors?.length) {
        throw new Error(result.errors[0].message);
    }

    const data = result.data?.requestPasswordReset;

    if (!data?.success) {
        throw new Error(data?.message || "Nu am putut trimite email-ul de resetare.");
    }

    return data;
}


// CHANGE PASSWRD

export async function resetPassword(token: string, password: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop-api`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
            query: `
                mutation ResetPassword($token: String!, $password: String!) {
                    resetPassword(token: $token, password: $password) {
                        ... on CurrentUser {
                            id
                            identifier
                        }
                        ... on ErrorResult {
                            errorCode
                            message
                        }
                    }
                }
            `,
            variables: {
                token,
                password,
            },
        }),
    });

    const result = await response.json();

    if (result.errors?.length) {
        throw new Error(result.errors[0].message);
    }

    const data = result.data?.resetPassword;

    if (!data?.id) {
        throw new Error(data?.message || "Nu am putut reseta parola.");
    }

    return data;
}