import { PaymentStateTransitionEvent } from '@vendure/core';
import { EmailEventListener } from '@vendure/email-plugin';
import { loadOrderEmailData } from './order-email-data';
import { Logger } from '@vendure/core';

const loggerCtx = 'OrderConfirmationHandler';

const HANDLER_BUILD = 'BEAST_ORDER_HANDLER_20260622_1';

console.error(
    JSON.stringify({
        marker: 'ORDER_HANDLER_MODULE_LOADED',
        handlerBuild: HANDLER_BUILD,
        pid: process.pid,
        deployment: process.env.RAILWAY_DEPLOYMENT_ID,
        commit: process.env.RAILWAY_GIT_COMMIT_SHA,
    }),
);

export const beastOrderConfirmationHandler =
    new EmailEventListener('order-confirmation')
        .on(PaymentStateTransitionEvent)
        .filter(event => {
            const pass =
                event.toState === 'Settled' &&
                event.payment?.method === 'stripe-card';

            console.error(
                JSON.stringify({
                    marker: 'ORDER_HANDLER_FILTER',
                    handlerBuild: HANDLER_BUILD,
                    pid: process.pid,
                    pass,
                    orderCode: event.order?.code,
                    paymentState: event.toState,
                    paymentMethod: event.payment?.method,
                }),
            );

            return pass;
        })
        .loadData(async context => {
            console.error(
                JSON.stringify({
                    marker: 'ORDER_HANDLER_LOAD_DATA',
                    handlerBuild: HANDLER_BUILD,
                    pid: process.pid,
                    orderCode: context.event.order?.code,
                }),
            );

            return loadOrderEmailData(context);
        })
        .setRecipient(event => {
            const recipient = event.data.order.customer.emailAddress;

            console.error(
                JSON.stringify({
                    marker: 'ORDER_HANDLER_RECIPIENT',
                    handlerBuild: HANDLER_BUILD,
                    pid: process.pid,
                    recipient,
                }),
            );

            return recipient;
        })
        .setFrom('{{ fromAddress }}')
        .setSubject('[SENDER-PROBE] Confirmare comandă #{{ order.code }}')
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