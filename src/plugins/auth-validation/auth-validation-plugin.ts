import { VendurePlugin, PluginCommonModule } from '@vendure/core';
import{AuthValidationResolver} from "./api/auth-validation-resolver";
import gql from 'graphql-tag';

@VendurePlugin({
    imports: [PluginCommonModule],
    shopApiExtensions: {
        schema: gql`
            extend type Mutation {
                validatedRegisterCustomerAccount(input: RegisterCustomerInput!): RegisterCustomerAccountResult!
            }
        `,
        resolvers: [AuthValidationResolver],
    },
})
export class AuthValidationPlugin {}