import { VendurePlugin } from '@vendure/core';
import {shopApiExtensions} from "./api/shop-api-extensions";
import {BeastLockerShopResolver} from "./api/shop-api-resolver";

@VendurePlugin({
    shopApiExtensions:{
        schema: shopApiExtensions,
        resolvers: [BeastLockerShopResolver],
    }
})

export class ProductCustomizationPlugin {}
console.log('BeastLockerPlugin loaded');

