import { LanguageCode, ShippingCalculator } from '@vendure/core';

export const coleteSelectedQuoteCalculator = new ShippingCalculator({
    code: 'colete-selected-quote-calculator',
    description: [
        {
            languageCode: LanguageCode.en,
            value: 'Uses the Colete Online checkout quote stored on the active order',
        },
    ],
    args: {},
    calculate: (_ctx, order) => {
        const customFields = order.customFields as {
            coleteCheckoutPriceWithTax?: number | null;
            coleteCheckoutCourierName?: string | null;
            coleteCheckoutServiceName?: string | null;
            coleteDeliveryType?: string | null;
            coleteShippingPointName?: string | null;
        };

        const price = Number(customFields.coleteCheckoutPriceWithTax);
        if (!Number.isFinite(price) || price < 0) {
            return;
        }

        return {
            price,
            priceIncludesTax: true,
            taxRate: 21,
            metadata: {
                coleteDeliveryType: customFields.coleteDeliveryType,
                coleteCourierName: customFields.coleteCheckoutCourierName,
                coleteServiceName: customFields.coleteCheckoutServiceName,
                coleteShippingPointName: customFields.coleteShippingPointName,
            },
        };
    },
});
