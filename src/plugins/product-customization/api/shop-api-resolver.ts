import { Resolver, Query } from '@nestjs/graphql';
import {Ctx, RequestContext, ProductService, CollectionService, ProductVariantService} from '@vendure/core';

@Resolver()
export class BeastLockerShopResolver {

    constructor(
        private productService: ProductService,
        private collectionService: CollectionService,
        private productVariantService: ProductVariantService

) {}
    @Query()
    beastLockerInfo(): string {
        return 'Beast Locker backend works!';
    }

    @Query()
    async featuredProducts(@Ctx() ctx: RequestContext) {
        const featuredCollection = await this.collectionService.findOneBySlug(
            ctx,
            'featured'
        );

        if (!featuredCollection) {
            return [];
        }

        const variantIds = await this.collectionService.getCollectionProductVariantIds(
            featuredCollection
        );

        const variants = await Promise.all(
            variantIds.slice(0, 10).map(id =>
                this.productVariantService.findOne(ctx, id)
            )
        );

        return variants.filter(v => v !== undefined);
    }

}