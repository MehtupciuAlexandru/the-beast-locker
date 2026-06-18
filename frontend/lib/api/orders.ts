import { graphqlRequest } from "@/lib/graphql/client";

export type CustomerOrder = {
    id: string;
    code: string;
    state: string;
    active: boolean;
    orderPlacedAt: string | null;
    totalWithTax: number;
    totalQuantity: number;
    shippingWithTax: number;
    payments?: {
        id: string;
        method: string;
        state: string;
        amount: number;
        transactionId?: string | null;
    }[];
    shippingLines?: {
        priceWithTax: number;
        shippingMethod: {
            id: string;
            code: string;
            name: string;
        };
    }[];
    fulfillments?: {
        id: string;
        state: string;
        method: string;
        trackingCode?: string | null;
    }[];
    lines: {
        id: string;
        quantity: number;
        linePriceWithTax: number;
        productVariant: {
            id: string;
            name: string;
            product?: {
                id: string;
                name: string;
                slug: string;
                featuredAsset?: {
                    preview: string;
                } | null;
            } | null;
        };
    }[];
};

export async function getCustomerOrders() {
    const data = await graphqlRequest(
        `
        query GetCustomerOrders {
            activeCustomer {
                orders(options: {
                    take: 50
                    filter: {
                        active: {
                            eq: false
                        }
                    }
                    sort: {
                        orderPlacedAt: DESC
                    }
                }) {
                    totalItems
                    items {
                        id
                        code
                        state
                        active
                        orderPlacedAt
                        totalWithTax
                        totalQuantity
                        shippingWithTax
                        payments {
                            id
                            method
                            state
                            amount
                            transactionId
                        }
                        shippingLines {
                            priceWithTax
                            shippingMethod {
                                id
                                code
                                name
                            }
                        }
                        fulfillments {
                            id
                            state
                            method
                            trackingCode
                        }
                        lines {
                            id
                            quantity
                            linePriceWithTax
                            productVariant {
                                id
                                name
                                product {
                                    id
                                    name
                                    slug
                                    featuredAsset {
                                        preview
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        `,
        {},
        true
    );

    const orders = data.activeCustomer?.orders || {
        totalItems: 0,
        items: [],
    };

    const placedOrders = (orders.items || []).filter(
        (order: CustomerOrder) => order.active === false && order.state !== "AddingItems"
    );

    return {
        totalItems: placedOrders.length,
        items: placedOrders,
    };
}