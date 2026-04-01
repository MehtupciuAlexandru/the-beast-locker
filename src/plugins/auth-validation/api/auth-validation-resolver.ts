import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Ctx, RequestContext, CustomerService } from '@vendure/core';

function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isStrongPassword(password: string): boolean {
    return /^(?=.*[0-9])(?=.*[!@#$%^&*]).{10,}$/.test(password);
}

@Resolver()
export class AuthValidationResolver {
    constructor(private customerService: CustomerService) {}

    @Mutation()
    async registerCustomerAccount(
        @Args('input') input: any,
        @Ctx() ctx: RequestContext,
    ) {
        const { emailAddress, password } = input;

        // Email validation
        if (!isValidEmail(emailAddress)) {
            throw new Error('Invalid email format');
        }

        // Password validation
        if (!isStrongPassword(password)) {
            throw new Error(
                'Password must be at least 10 characters long, contain at least one number and one special character'
            );
        }

        // Call Vendure's internal logic
        return this.customerService.registerCustomerAccount(ctx, input);
    }
}