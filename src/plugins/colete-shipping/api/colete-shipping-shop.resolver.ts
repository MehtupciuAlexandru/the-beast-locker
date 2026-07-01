import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Allow, Ctx, Permission, RequestContext, Transaction } from '@vendure/core';
import { ColeteShippingService } from '../services/colete-shipping.service';

@Resolver()
export class ColeteShippingShopResolver {
    constructor(private coleteShippingService: ColeteShippingService) {}

    @Query()
    @Allow(Permission.Owner)
    async coleteCheckoutAddressQuote(@Ctx() ctx: RequestContext) {
        return this.coleteShippingService.getCheckoutAddressQuote(ctx);
    }

    @Query()
    @Allow(Permission.Owner)
    async coleteCheckoutShippingPoints(@Ctx() ctx: RequestContext) {
        return this.coleteShippingService.getCheckoutShippingPoints(ctx);
    }

    @Query()
    @Allow(Permission.Authenticated)
    async validateColeteAddress(@Args('input') input: any) {
        return this.coleteShippingService.validateAddress(input);
    }

    @Mutation()
    @Transaction()
    @Allow(Permission.Owner)
    async setColeteCheckoutSelection(
        @Ctx() ctx: RequestContext,
        @Args('input') input: any,
    ) {
        return this.coleteShippingService.setCheckoutSelection(ctx, input);
    }
}
