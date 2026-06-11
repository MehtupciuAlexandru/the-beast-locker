import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { RecaptchaProtectionMiddleware } from './recaptcha-protection.middleware';

@VendurePlugin({
    imports: [PluginCommonModule],
})
export class RecaptchaProtectionPlugin implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(RecaptchaProtectionMiddleware)
            .forRoutes('shop-api');
    }
}