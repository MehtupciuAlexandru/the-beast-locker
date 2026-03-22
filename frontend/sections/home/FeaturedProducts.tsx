import { ProductPreview } from "@/types/product";
import ProductCard from "@/components/product/ProductCard";

type FeaturedProductsProps = {
    products: ProductPreview[];
};

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
    return (
        <section className="w-full bg-white flex justify-center">
            <div className="w-full py-10 ml-5 mr-5">

                <h2 className="text-sm font-semibold tracking-widest mb-5 text-black">
                    CELE MAI VANDUTE
                </h2>
                <div className="w-full h-[1px] bg-gray-300 mt-3 mb-6" />

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))}
                </div>

                <div className="flex justify-center mt-10">
                    <button
                        type="button"
                        aria-label="Shop collection"
                        className="border border-black px-6 py-2 text-black text-xs font-semibold tracking-widest transition hover:bg-black hover:text-white"
                    >
                        VEZI TOT
                    </button>
                </div>

            </div>
        </section>
    );
}