import ProductCard from "@/components/product/ProductCard";
import Link from "next/link";
import { getProducts } from "@/lib/api/products";

export default async function FeaturedProducts() {
    const products = await getProducts("no-plan-b");

    return (
        <section className="flex w-full justify-center bg-white">
            <div className="w-full px-5 py-10">
                <h2 className="mb-5 text-lg font-GemunuBold tracking-widest text-black">
                    NO PLAN B
                </h2>

                <div className="mb-6 mt-3 h-[1px] w-full bg-gray-300" />

                {products.length === 0 ? (
                    <p className="py-10 text-center text-xs uppercase tracking-widest text-neutral-400">
                        Nu există produse momentan.
                    </p>
                ) : (
                    <div className="grid font-InterLight grid-cols-2 gap-y-10 gap-x-12 sm:gap-x-24 md:gap-x-32 lg:grid-cols-4 lg:gap-x-40 xl:gap-x-[200px]">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </div>
                )}

                <div className="mt-10 flex justify-center">
                    <Link
                        href="/products?collection=no-plan-b"
                        aria-label="Shop No Plan B collection"
                        className="border border-black px-6 py-2 text-xs font-semibold tracking-widest text-black transition hover:bg-black hover:text-white"
                    >
                        VEZI TOT
                    </Link>
                </div>
            </div>
        </section>
    );
}