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

export async function setCheckoutCustomer(input: {
    firstName: string;
    lastName: string;
    emailAddress: string;
    phoneNumber?: string;
}) {
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
        { input },
        true
    );

    const result = data.setCustomerForOrder;

    if (result?.message) {
        throw new Error(result.message);
    }

    return result;
}

export async function setCheckoutShippingAddress(input: any) {
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
        { input },
        true
    );

    const result = data.setOrderShippingAddress;

    if (result?.message) {
        throw new Error(result.message);
    }

    return result;
}