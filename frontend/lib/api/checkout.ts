import { graphqlRequest } from "@/lib/graphql/client";

const CHECKOUT_ORDER_FIELDS = `
    id
    code
    totalQuantity
    subTotalWithTax
    shippingWithTax
    totalWithTax
    lines {
        id
        quantity
        linePriceWithTax
        featuredAsset {
            preview
        }
        productVariant {
            id
            name
            priceWithTax
            featuredAsset {
                preview
            }
            product {
                id
                name
                slug
                featuredAsset {
                    preview
                }
            }
            options {
                id
                name
                code
                group {
                    id
                    name
                    code
                }
            }
        }
    }
`;

export async function setCheckoutCustomer(
    input: {
        firstName: string;
        lastName: string;
        emailAddress: string;
        phoneNumber?: string;
    },
    recaptchaToken?: string
) {
    const data = await graphqlRequest(
        `
        mutation SetCustomerForOrder($input: CreateCustomerInput!) {
            setCustomerForOrder(input: $input) {
                ... on Order {
                    ${CHECKOUT_ORDER_FIELDS}
                }
                ... on ErrorResult {
                    errorCode
                    message
                }
            }
        }
        `,
        { input, recaptchaToken },
        true
    );

    const result = data.setCustomerForOrder;

    if (result?.message) {
        throw new Error(result.message);
    }

    return result;
}

export async function setCheckoutShippingAddress(input: any, recaptchaToken?: string) {
    const data = await graphqlRequest(
        `
        mutation SetOrderShippingAddress($input: CreateAddressInput!) {
            setOrderShippingAddress(input: $input) {
                ... on Order {
                    ${CHECKOUT_ORDER_FIELDS}
                }
                ... on ErrorResult {
                    errorCode
                    message
                }
            }
        }
        `,
        { input, recaptchaToken },
        true
    );

    const result = data.setOrderShippingAddress;

    if (result?.message) {
        throw new Error(result.message);
    }

    return result;
}


export async function getEligibleShippingMethods() {
    const data = await graphqlRequest(
        `
        query EligibleShippingMethods {
            eligibleShippingMethods {
                id
                code
                name
                priceWithTax
            }
        }
        `,
        {},
        true
    );

    return data.eligibleShippingMethods || [];
}

export async function setCheckoutShippingMethod(shippingMethodId: string) {
    const data = await graphqlRequest(
        `
        mutation SetOrderShippingMethod($shippingMethodId: [ID!]!) {
            setOrderShippingMethod(shippingMethodId: $shippingMethodId) {
                ... on Order {
                    ${CHECKOUT_ORDER_FIELDS}
                }
                ... on ErrorResult {
                    errorCode
                    message
                }
            }
        }
        `,
        {
            shippingMethodId: [shippingMethodId],
        },
        true
    );

    const result = data.setOrderShippingMethod;

    if (result?.message) {
        throw new Error(result.message);
    }

    return result;
}

export async function getColeteCheckoutAddressQuote() {
    const data = await graphqlRequest(
        `
        query ColeteCheckoutAddressQuote {
            coleteCheckoutAddressQuote {
                deliveryType
                priceWithTax
                priceWithoutTax
                courierName
                serviceName
                serviceId
                activationId
            }
        }
        `,
        {},
        true
    );

    return data.coleteCheckoutAddressQuote;
}

export async function getColeteCheckoutShippingPoints() {
    const data = await graphqlRequest(
        `
        query ColeteCheckoutShippingPoints {
            coleteCheckoutShippingPoints {
                deliveryType
                priceWithTax
                priceWithoutTax
                courierName
                serviceName
                serviceId
                activationId
                shippingPointId
                shippingPointName
                shippingPointType
                shippingPointAddress
                shippingPointLat
                shippingPointLng
                shippingPointCounty
                distanceKm
            }
        }
        `,
        {},
        true
    );

    return data.coleteCheckoutShippingPoints || [];
}

export async function setColeteCheckoutSelection(input: any) {
    const data = await graphqlRequest(
        `
        mutation SetColeteCheckoutSelection($input: ColeteCheckoutSelectionInput!) {
            setColeteCheckoutSelection(input: $input) {
                ${CHECKOUT_ORDER_FIELDS}
            }
        }
        `,
        { input },
        true
    );

    return data.setColeteCheckoutSelection;
}

