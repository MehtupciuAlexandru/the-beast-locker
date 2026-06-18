import { OrderService, OrderStateTransitionEvent } from '@vendure/core';
import {
    EmailEventListener,
    shippingLinesWithMethod,
    transformOrderLineAssetUrls,
} from '@vendure/email-plugin';

export const paymentReceiptHandler = new EmailEventListener('payment-receipt')
    .on(OrderStateTransitionEvent)
    .filter(event => event.toState === 'PaymentSettled' && !!event.order.customer)
    .loadData(async ({ event, injector }) => {
        const orderService = injector.get(OrderService);
        const payments = await orderService.getOrderPayments(event.ctx, event.order.id);
        transformOrderLineAssetUrls(event.ctx, event.order, injector);

        return {
            payments,
            payment:
                payments.find(payment => payment.method === 'stripe-card') ||
                payments[0],
            shippingLines: shippingLinesWithMethod(event.order),
        };
    })
    .setRecipient(event => event.order.customer!.emailAddress)
    .setFrom('{{ fromAddress }}')
    .setSubject('Chitanță plată pentru comanda #{{ order.code }}')
    .setTemplateVars((event: any) => ({
        order: event.order,
        payment: event.data.payment,
        payments: event.data.payments,
        shippingLines: event.data.shippingLines,
    }));