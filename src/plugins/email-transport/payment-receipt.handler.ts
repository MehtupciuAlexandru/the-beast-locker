import { OrderService, OrderStateTransitionEvent } from '@vendure/core';
import {
    EmailEventListener,
    shippingLinesWithMethod,
} from '@vendure/email-plugin';

export const paymentReceiptHandler = new EmailEventListener('payment-receipt')
    .on(OrderStateTransitionEvent)
    .filter(
        event =>
            event.toState === 'PaymentSettled' &&
            !!event.order.customer?.emailAddress,
    )
    .loadData(async ({ event, injector }) => {
        const orderService = injector.get(OrderService);

        const order = await orderService.findOne(
            event.ctx,
            event.order.id,
            [
                'customer',
                'lines',
                'lines.productVariant',
                'shippingLines',
                'shippingLines.shippingMethod',
            ],
        );

        if (!order) {
            throw new Error(
                `Unable to load order ${event.order.code} for payment receipt`,
            );
        }

        const payments = await orderService.getOrderPayments(
            event.ctx,
            order.id,
        );

        const payment =
            payments.find(item => item.method === 'stripe-card') ||
            payments[0];

        if (!payment) {
            throw new Error(
                `Unable to load payment for order ${order.code}`,
            );
        }

        return {
            order,
            payment,
            payments,
            shippingLines: shippingLinesWithMethod(order),
        };
    })
    .setRecipient(event => event.order.customer!.emailAddress)
    .setFrom('{{ fromAddress }}')
    .setSubject('Chitanță plată pentru comanda #{{ order.code }}')
    .setTemplateVars((event: any) => ({
        order: event.data.order,
        payment: event.data.payment,
        payments: event.data.payments,
        shippingLines: event.data.shippingLines,
    }));