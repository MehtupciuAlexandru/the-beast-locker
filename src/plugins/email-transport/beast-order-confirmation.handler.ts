import { OrderStateTransitionEvent } from '@vendure/core';
import {
    EmailEventListener,
    shippingLinesWithMethod,
    transformOrderLineAssetUrls,
} from '@vendure/email-plugin';

export const beastOrderConfirmationHandler = new EmailEventListener('order-confirmation')
    .on(OrderStateTransitionEvent)
    .filter(event => event.toState === 'PaymentSettled' && !!event.order.customer)
    .loadData(async ({ event, injector }) => {
        transformOrderLineAssetUrls(event.ctx, event.order, injector);

        return {
            shippingLines: shippingLinesWithMethod(event.order),
        };
    })
    .setRecipient(event => event.order.customer!.emailAddress)
    .setFrom('{{ fromAddress }}')
    .setSubject('Confirmare comandă #{{ order.code }}')
    .setTemplateVars((event: any) => ({
        order: event.order,
        shippingLines: event.data.shippingLines,
    }));