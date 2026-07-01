import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Allow, Ctx, ID, Permission, RequestContext } from '@vendure/core';
import { ColeteShippingService } from '../services/colete-shipping.service';

@Resolver()
export class ColeteShippingAdminResolver {
    constructor(private coleteShippingService: ColeteShippingService) {}

    @Mutation()
    @Allow(Permission.UpdateOrder)
    async generateColeteAwb(
        @Ctx() ctx: RequestContext,
        @Args('orderId') orderId: ID,
    ) {
        return this.coleteShippingService.generateAwb(ctx, orderId);
    }
}
