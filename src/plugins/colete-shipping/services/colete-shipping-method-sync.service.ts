import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { LanguageCode } from '@vendure/common/lib/generated-types';
import { RequestContextService, ShippingMethodService } from '@vendure/core';

const COLETE_CALCULATOR_CODE = 'colete-selected-quote-calculator';

@Injectable()
export class ColeteShippingMethodSyncService implements OnApplicationBootstrap {
    constructor(
        private shippingMethodService: ShippingMethodService,
        private requestContextService: RequestContextService,
    ) {}

    async onApplicationBootstrap() {
        if (process.env.COLETE_SYNC_SHIPPING_METHODS === 'false') {
            return;
        }

        const codes = (process.env.COLETE_SHIPPING_METHOD_CODES ?? 'standard-shipping,express-shipping')
            .split(',')
            .map(code => code.trim())
            .filter(Boolean);

        if (!codes.length) {
            return;
        }

        const ctx = await this.requestContextService.create({ apiType: 'admin' });
        const methods = await this.shippingMethodService.findAll(ctx, undefined, ['translations']);

        for (const method of methods.items.filter(item => codes.includes(item.code))) {
            if (method.calculator?.code === COLETE_CALCULATOR_CODE) {
                continue;
            }

            await this.shippingMethodService.update(ctx, {
                id: method.id,
                calculator: {
                    code: COLETE_CALCULATOR_CODE,
                    arguments: [],
                },
                translations: method.translations.length
                    ? method.translations.map(translation => ({
                          id: translation.id,
                          languageCode: translation.languageCode,
                          name: translation.name,
                          description: translation.description,
                      }))
                    : [
                          {
                              languageCode: LanguageCode.en,
                              name: method.name,
                              description: method.description,
                          },
                      ],
            });
        }
    }
}
