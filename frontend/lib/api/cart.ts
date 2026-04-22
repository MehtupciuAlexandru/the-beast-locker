import { graphqlRequest } from "@/lib/graphql/client";

const ACTIVE_ORDER_FIELDS = `
    id
    totalWithTax
    lines {
        id
        quantity
        featuredAsset {
            preview
        }
        productVariant {
            id
            name
            priceWithTax
        }
    }
`;

export async function getActiveOrder() {
    const data = await graphqlRequest(
        `
        query GetActiveOrder {
            activeOrder {
                ${ACTIVE_ORDER_FIELDS}
            }
        }
        `,
        {},
        true
    );

    return data.activeOrder;
}

export async function addToCart(productVariantId: string, quantity: number = 1) {
    const data = await graphqlRequest(
        `
        mutation AddItemToOrder($productVariantId: ID!, $quantity: Int!) {
            addItemToOrder(productVariantId: $productVariantId, quantity: $quantity) {
                ... on Order {
                    ${ACTIVE_ORDER_FIELDS}
                }
                ... on ErrorResult {
                    errorCode
                    message
                }
            }
        }
        `,
        { productVariantId, quantity },
        true
    );

    return data.addItemToOrder;
}

export async function adjustOrderLine(orderLineId: string, quantity: number) {
    const data = await graphqlRequest(
        `
        mutation AdjustOrderLine($orderLineId: ID!, $quantity: Int!) {
            adjustOrderLine(orderLineId: $orderLineId, quantity: $quantity) {
                ... on Order {
                    ${ACTIVE_ORDER_FIELDS}
                }
                ... on ErrorResult {
                    errorCode
                    message
                }
            }
        }
        `,
        { orderLineId, quantity },
        true
    );

    return data.adjustOrderLine;
}

export async function removeOrderLine(orderLineId: string) {
    const data = await graphqlRequest(
        `
        mutation RemoveOrderLine($orderLineId: ID!) {
            removeOrderLine(orderLineId: $orderLineId) {
                ... on Order {
                    ${ACTIVE_ORDER_FIELDS}
                }
                ... on ErrorResult {
                    errorCode
                    message
                }
            }
        }
        `,
        { orderLineId },
        true
    );

    return data.removeOrderLine;
}