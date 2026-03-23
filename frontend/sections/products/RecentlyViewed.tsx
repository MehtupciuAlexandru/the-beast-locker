"use client";

import { ProductPreview } from "@/types/product";
import ProductCardCompact from "@/components/product/ProductCardCompact";

type RecentlyViewedProps = {
    products: ProductPreview[];
    title?: string;
};

export default function RecentlyViewed({
                                           products,
                                           title = "VĂZUTE RECENT",
                                       }: RecentlyViewedProps) {
    if (!products || products.length === 0) return null;

    return (
        <section className="w-full bg-[#f3f3f3] px-6 lg:px-12 py-8">

            {/* Title */}
            <h2 className="text-xs tracking-widest text-black mb-4">
                {title}
            </h2>

            {/* Divider */}
            <div className="w-full h-[1px] bg-black mb-6" />

            {/* MOBILE → horizontal scroll */}
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

            {/* DESKTOP */}
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