import { ProductPreview } from "@/types/product";
import ProductCard from "@/components/product/ProductCard";

type SocialMediaProps = {
    items: ProductPreview[];
};

export default function SocialMedia({ items }: SocialMediaProps) {
    return (
        <section className="w-full overflow-hidden bg-[#f5f5f5]">
            <div className="w-full py-6">
                <div className="px-4">
                    <h2 className="text-sm font-semibold tracking-widest text-gray-900">
                        SOCIAL MEDIA FAVES
                    </h2>
                    <div className="mt-4 h-px w-full bg-gray-300" />
                </div>

                <div className="mt-6 md:hidden">
                    <div className="w-full overflow-x-auto">
                        <div className="flex gap-4 px-4">
                            {items.map((item) => (
                                <ProductCard
                                    key={item.id}
                                    product={item}
                                    className="w-[160px] flex-shrink-0"
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-6 hidden px-4 md:grid md:grid-cols-3 md:gap-6">
                    {items.map((item) => (
                        <ProductCard
                            key={item.id}
                            product={item}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}