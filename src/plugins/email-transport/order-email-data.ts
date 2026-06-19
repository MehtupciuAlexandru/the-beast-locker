import {
    EntityHydrator,
    Injector,
    OrderService,
    OrderStateTransitionEvent,
} from '@vendure/core';

import {
    shippingLinesWithMethod,
    transformOrderLineAssetUrls,
} from '@vendure/email-plugin';

export async function loadOrderEmailData({
                                             event,
                                             injector,
                                         }: {
    event: OrderStateTransitionEvent;
    injector: Injector;
}) {
    const orderService = injector.get(OrderService);
    const entityHydrator = injector.get(EntityHydrator);

    const order = await orderService.findOne(
        event.ctx,
        event.order.id,
    );

    if (!order) {
        throw new Error(
            `Unable to load order ${event.order.code} for email`,
        );
    }

    await entityHydrator.hydrate(event.ctx, order, {
        relations: [
            'customer',
            'lines',
            'lines.productVariant',
            'lines.featuredAsset',
            'shippingLines',
            'shippingLines.shippingMethod',
        ],
    });

    if (!order.customer?.emailAddress) {
        throw new Error(
            `Order ${order.code} does not have a customer email address`,
        );
    }

    const payments = await orderService.getOrderPayments(
        event.ctx,
        order.id,
    );

    const selectedPayment =
        payments.find(
            payment =>
                payment.method === 'stripe-card' &&
                payment.state === 'Settled',
        ) ||
        payments.find(
            payment => payment.method === 'stripe-card',
        ) ||
        payments[0];

    if (!selectedPayment) {
        throw new Error(
            `Unable to load payment for order ${order.code}`,
        );
    }

    transformOrderLineAssetUrls(
        event.ctx,
        order,
        injector,
    );

    const shippingLines = shippingLinesWithMethod(order).map(
        shippingLine => ({
            id: shippingLine.id,
            price: shippingLine.price,
            priceWithTax: shippingLine.priceWithTax,
            discountedPrice: shippingLine.discountedPrice,
            discountedPriceWithTax:
            shippingLine.discountedPriceWithTax,
            shippingMethod: {
                id: shippingLine.shippingMethod.id,
                code: shippingLine.shippingMethod.code,
                name: shippingLine.shippingMethod.name,
            },
        }),
    );

    const orderData = {
        id: order.id,
        code: order.code,
        state: order.state,
        active: order.active,
        type: order.type,
        orderPlacedAt: order.orderPlacedAt,
        currencyCode: order.currencyCode,

        subTotal: order.subTotal,
        subTotalWithTax: order.subTotalWithTax,
        shipping: order.shipping,
        shippingWithTax: order.shippingWithTax,
        total: order.total,
        totalWithTax: order.totalWithTax,
        totalQuantity: order.totalQuantity,

        shippingAddress: order.shippingAddress
            ? { ...order.shippingAddress }
            : {},

        billingAddress: order.billingAddress
            ? { ...order.billingAddress }
            : {},

        customer: {
            id: order.customer.id,
            firstName: order.customer.firstName,
            lastName: order.customer.lastName,
            emailAddress: order.customer.emailAddress,
            phoneNumber: order.customer.phoneNumber,
        },

        lines: order.lines.map(line => ({
            id: line.id,
            quantity: line.quantity,
            linePrice: line.linePrice,
            linePriceWithTax: line.linePriceWithTax,
            discountedLinePrice: line.discountedLinePrice,
            discountedLinePriceWithTax:
            line.discountedLinePriceWithTax,

            featuredAsset: line.featuredAsset
                ? {
                    id: line.featuredAsset.id,
                    preview: line.featuredAsset.preview,
                }
                : null,

            productVariant: {
                id: line.productVariant.id,
                name: line.productVariant.name,
                quantity: line.quantity,
            },
        })),

        discounts: order.discounts.map(discount => ({
            description: discount.description,
            amount: discount.amount,
            amountWithTax: discount.amountWithTax,
            adjustmentSource: discount.adjustmentSource,
            type: discount.type,
        })),

        shippingLines,
    };

    const paymentData = {
        id: selectedPayment.id,
        method: selectedPayment.method,
        state: selectedPayment.state,
        amount: selectedPayment.amount,
        transactionId:
            selectedPayment.transactionId || null,
        errorMessage:
            selectedPayment.errorMessage || null,
        metadata:
            selectedPayment.metadata || {},
    };

    const paymentsData = payments.map(payment => ({
        id: payment.id,
        method: payment.method,
        state: payment.state,
        amount: payment.amount,
        transactionId:
            payment.transactionId || null,
        errorMessage:
            payment.errorMessage || null,
        metadata:
            payment.metadata || {},
    }));

    return {
        order: orderData,
        payment: paymentData,
        payments: paymentsData,
        shippingLines,
    };
}