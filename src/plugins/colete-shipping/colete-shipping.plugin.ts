import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { coleteShippingAdminApiExtensions } from './api/colete-shipping-admin-api-extensions';
import { ColeteShippingAdminResolver } from './api/colete-shipping-admin.resolver';
import { coleteShippingShopApiExtensions } from './api/colete-shipping-shop-api-extensions';
import { ColeteShippingShopResolver } from './api/colete-shipping-shop.resolver';
import { ColeteOnlineClient } from './services/colete-online.client';
import { ColeteShippingService } from './services/colete-shipping.service';
import { ColeteShippingMethodSyncService } from './services/colete-shipping-method-sync.service';

@VendurePlugin({
    imports: [PluginCommonModule],
    providers: [ColeteOnlineClient, ColeteShippingService, ColeteShippingMethodSyncService],
    adminApiExtensions: {
        schema: coleteShippingAdminApiExtensions,
        resolvers: [ColeteShippingAdminResolver],
    },
    shopApiExtensions: {
        schema: coleteShippingShopApiExtensions,
        resolvers: [ColeteShippingShopResolver],
    },
    dashboard: './dashboard/index.tsx',
    compatibility: '^3.5.0',
})
export class ColeteShippingPlugin {}
