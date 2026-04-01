import { VendurePlugin, PluginCommonModule } from '@vendure/core';
import{AuthValidationResolver} from "./api/auth-validation-resolver";

@VendurePlugin({
    imports: [PluginCommonModule],
    shopApiExtensions: {
        resolvers: [AuthValidationResolver],
    },
})
export class AuthValidationPlugin {}