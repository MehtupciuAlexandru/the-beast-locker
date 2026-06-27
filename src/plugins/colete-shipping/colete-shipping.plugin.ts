import { VendurePlugin } from '@vendure/core';

@VendurePlugin({
    imports: [],
    providers: [],
    dashboard: './dashboard/index.tsx',
    compatibility: '^3.5.0',
})
export class ColeteShippingPlugin {}
