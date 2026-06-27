import { PaymentStateTransitionEvent } from '@vendure/core';
import { EmailEventListener } from '@vendure/email-plugin';
import { loadOrderEmailData } from './order-email-data';

const HANDLER_BUILD = 'BEAST_ORDER_HANDLER_20260622_1';

export const beastOrderConfirmationHandler =
    new EmailEventListener('order-confirmation')
        .on(PaymentStateTransitionEvent)
        .filter(event => {
            return (
                event.toState === 'Settled' &&
                event.payment?.method === 'stripe-card'
            );
        })
        .loadData(context => loadOrderEmailData(context))
        .setRecipient(event => {
            return event.data.order.customer.emailAddress;
        })
        .setFrom('{{ fromAddress }}')
        .setSubject('Confirmare comandă #{{ order.code }}')
        .setMetadata(event => ({
            handlerBuild: HANDLER_BUILD,
            orderId: event.data.order.id,
            orderCode: event.data.order.code,
        }))
        .setTemplateVars(event => ({
            handlerBuild: HANDLER_BUILD,
            order: event.data.order,
            payment: event.data.payment,
            payments: event.data.payments,
            shippingLines: event.data.shippingLines,
        }));