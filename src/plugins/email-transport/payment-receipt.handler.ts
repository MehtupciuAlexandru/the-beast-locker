import {
    EntityHydrator,
    Logger,
    OrderService,
    PaymentStateTransitionEvent,
} from '@vendure/core';

import {
    EmailEventListener,
    shippingLinesWithMethod,
} from '@vendure/email-plugin';

const loggerCtx = 'PaymentReceiptHandler';

export const paymentReceiptHandler =
    new EmailEventListener('payment-receipt')
        .on(PaymentStateTransitionEvent)
        .filter(event => {
            const pass = event.toState === 'Settled' && event.payment?.method === 'stripe-card';
            Logger.info(`[Receipt][Filter] Pass: ${pass} | Order: ${event.order?.code} | State: ${event.toState} | Method: ${event.payment?.method}`, loggerCtx);
            return pass;
        })
        .loadData(async ({ event, injector }) => {

            await new Promise(resolve => setTimeout(resolve, 2000));

            Logger.info(`[Receipt][LoadData] Started | Order: ${event.order?.code}`, loggerCtx);
            const orderService = injector.get(OrderService);
            const entityHydrator = injector.get(EntityHydrator);

            const order = await orderService.findOne(
                event.ctx,
                event.order.id,
            );

            if (!order) {
                Logger.error(`[Receipt][LoadData] Failed to find order | ID: ${event.order?.id}`, loggerCtx);
                throw new Error(
                    `Unable to load order ${event.order.code} for payment receipt email`,
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
                    'surcharges',
                ],
            });

            if (!order.customer?.emailAddress) {
                Logger.error(`[Receipt][LoadData] Missing email | Order: ${order.code} | CustomerID: ${(order as any).customerId ?? 'none'} | UserExists: ${!!order.customer?.user}`, loggerCtx);
                throw new Error(
                    `Order ${order.code} does not have a customer email address`,
                );
            }

            Logger.info(`[Receipt][LoadData] Success | Email: ${order.customer.emailAddress} | UserExists: ${!!order.customer.user}`, loggerCtx);

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
                id: event.payment.id,
                method: event.payment.method,
                state: event.payment.state,
                amount: event.payment.amount,
                transactionId:
                    event.payment.transactionId || null,
                errorMessage:
                    event.payment.errorMessage || null,
                metadata:
                    event.payment.metadata || {},
            };

            return {
                order: orderData,
                payment: paymentData,
                payments: [paymentData],
                shippingLines,
            };
        })
        .setRecipient(event => {
            const recipient = event.data.order.customer.emailAddress;
            Logger.info(`[Receipt][Recipient] Resolved: ${recipient}`, loggerCtx);
            return recipient;
        })
        .setFrom('{{ fromAddress }}')
        .setSubject('Chitanță plată pentru comanda #{{ order.code }}')
        .setTemplateVars((event: any) => {
            Logger.info(`[Receipt][Template] Processing vars | Order: ${event.data.order.code}`, loggerCtx);
            return {
                order: event.data.order,
                payment: event.data.payment,
                payments: event.data.payments,
                shippingLines: event.data.shippingLines,
            };
        });