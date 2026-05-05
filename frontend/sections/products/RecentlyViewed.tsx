"use client";

import { useEffect, useState } from "react";
import { ProductPreview } from "@/types/product";
import ProductCardCompact from "@/components/product/ProductCardCompact";
import { getRecentlyViewedProducts } from "@/lib/recentlyViewed";

type RecentlyViewedProps = {
    title?: string;
    excludeProductId?: string;
};

export default function RecentlyViewed({
                                           title = "VĂZUTE RECENT",
                                           excludeProductId,
                                       }: RecentlyViewedProps) {
    const [products, setProducts] = useState<ProductPreview[]>([]);

    useEffect(() => {
        const recentlyViewedProducts = getRecentlyViewedProducts();

        const filteredProducts = excludeProductId
            ? recentlyViewedProducts.filter(
                (product) => product.id !== excludeProductId
            )
            : recentlyViewedProducts;

        setProducts(filteredProducts.slice(0, 5));
    }, [excludeProductId]);

    if (!products || products.length === 0) return null;

    return (
        <section className="w-full bg-[#f3f3f3] px-6 lg:px-12 py-8">

            <h2 className="text-xs tracking-widest text-black mb-4">
                {title}
            </h2>

            <div className="w-full h-[1px] bg-black mb-6" />

            <div className="lg:hidden overflow-x-auto">
                <div className="flex gap-6 w-max">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="w-[140px] flex-shrink-0"
                        >
                            <ProductCardCompact product={product} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="hidden lg:grid grid-cols-3 xl:grid-cols-3 gap-8">
                {products.map((product) => (
                    <ProductCardCompact
                        key={product.id}
                        product={product}
                    />
                ))}
            </div>

        </section>
    );
}