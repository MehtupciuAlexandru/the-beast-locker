import { PaymentStateTransitionEvent } from '@vendure/core';
import { EmailEventListener } from '@vendure/email-plugin';
import { loadOrderEmailData } from './order-email-data';
import { Logger } from '@vendure/core';

const loggerCtx = 'OrderConfirmationHandler';

export const beastOrderConfirmationHandler =
    new EmailEventListener('order-confirmation')
        .on(PaymentStateTransitionEvent)
        .filter(event => {
            // Fire when a Stripe payment settles. Using PaymentStateTransitionEvent
            // (not OrderStateTransitionEvent) guarantees event.payment is already
            // committed to the DB, eliminating the race condition where
            // getOrderPayments() returned empty and silently dropped the email.
            const pass =
                event.toState === 'Settled' &&
                event.payment?.method === 'stripe-card';
            Logger.info(
                `[Confirmation][Filter] Pass: ${pass} | Order: ${event.order?.code} | PaymentState: ${event.toState} | Method: ${event.payment?.method}`,
                loggerCtx,
            );
            return pass;
        })
        .loadData(async (context) => {
            Logger.info(`[Confirmation][LoadData] Started | Order: ${context.event.order?.code}`, loggerCtx);
            return loadOrderEmailData(context);
        })
        .setRecipient(event => {
            const recipient = event.data.order.customer.emailAddress;
            Logger.info(`[Confirmation][Recipient] Resolved: ${recipient}`, loggerCtx);
            return recipient;
        })
        .setFrom('{{ fromAddress }}')
        .setSubject('Confirmare comandă #{{ order.code }}')
        .setTemplateVars((event: any) => {
            Logger.info(`[Confirmation][Template] Processing vars | Order: ${event.data.order.code}`, loggerCtx);
            return {
                order: event.data.order,
                payment: event.data.payment,
                payments: event.data.payments,
                shippingLines: event.data.shippingLines,
            };
        });
