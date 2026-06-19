import { OrderStateTransitionEvent } from '@vendure/core';
import { EmailEventListener } from '@vendure/email-plugin';
import { loadOrderEmailData } from './order-email-data';

export const beastOrderConfirmationHandler =
    new EmailEventListener('order-confirmation')
        .on(OrderStateTransitionEvent)
        .filter(
            event =>
                event.toState === 'PaymentSettled' &&
                !!event.order.customer?.emailAddress,
        )
        .loadData(loadOrderEmailData)
        .setRecipient(
            event => event.order.customer!.emailAddress,
        )
        .setFrom('{{ fromAddress }}')
        .setSubject(
            'Confirmare comandă #{{ order.code }}',
        )
        .setTemplateVars((event: any) => ({
            order: event.data.order,
            payment: event.data.payment,
            payments: event.data.payments,
            shippingLines: event.data.shippingLines,
        }));