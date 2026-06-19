import { OrderStateTransitionEvent } from '@vendure/core';
import { EmailEventListener } from '@vendure/email-plugin';
import { loadOrderEmailData } from './order-email-data';
import { Logger } from '@vendure/core';

const loggerCtx = 'OrderConfirmationHandler';

export const beastOrderConfirmationHandler =
    new EmailEventListener('order-confirmation')
        .on(OrderStateTransitionEvent)
        .filter(event => {
            const pass = event.toState === 'PaymentSettled';
            Logger.info(`[Confirmation][Filter] Pass: ${pass} | Order: ${event.order?.code} | State: ${event.toState}`, loggerCtx);
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