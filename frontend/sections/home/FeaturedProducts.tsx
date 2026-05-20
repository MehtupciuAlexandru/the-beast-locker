import { ProductPreview } from "@/types/product";
import ProductCard from "@/components/product/ProductCard";
import Link from "next/link";

type FeaturedProductsProps = {
    products: ProductPreview[];
};

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
    return (
        <section className="flex w-full justify-center bg-white">
            <div className="w-full px-5 py-10">
                <h2 className="mb-5 text-lg font-GemunuBold tracking-widest text-black">
                    NO PLAN B
                </h2>

                <div className="mb-6 mt-3 h-[1px] w-full bg-gray-300" />

                <div className="grid font-InterLight grid-cols-2 gap-y-10 gap-x-12 sm:gap-x-24 md:gap-x-32 lg:grid-cols-4 lg:gap-x-40 xl:gap-x-[200px]">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))}
                </div>

                <div className="mt-10 flex justify-center">
                    <Link
                        href="/products"
                        aria-label="Shop collection"
                        className="border border-black px-6 py-2 text-xs font-semibold tracking-widest text-black transition hover:bg-black hover:text-white"
                    >
                        VEZI TOT
                    </Link>
                </div>
            </div>
        </section>
    );
}