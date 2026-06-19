import { OrderService, OrderStateTransitionEvent } from '@vendure/core';
import {
    EmailEventListener,
    shippingLinesWithMethod,
    transformOrderLineAssetUrls,
} from '@vendure/email-plugin';

export const beastOrderConfirmationHandler =
    new EmailEventListener('order-confirmation')
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
                    'lines.featuredAsset',
                    'shippingLines',
                    'shippingLines.shippingMethod',
                ],
            );

            if (!order) {
                throw new Error(
                    `Unable to load order ${event.order.code} for confirmation`,
                );
            }

            transformOrderLineAssetUrls(
                event.ctx,
                order,
                injector,
            );

            return {
                order,
                shippingLines: shippingLinesWithMethod(order),
            };
        })
        .setRecipient(event => event.order.customer!.emailAddress)
        .setFrom('{{ fromAddress }}')
        .setSubject('Confirmare comandă #{{ order.code }}')
        .setTemplateVars((event: any) => ({
            order: event.data.order,
            shippingLines: event.data.shippingLines,
        }));