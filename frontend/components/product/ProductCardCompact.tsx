import Link from "next/link";
import { ProductPreview } from "@/types/product";

type Props = {
    product: ProductPreview;
};

export default function ProductCardCompact({ product }: Props) {
    return (
        <Link
            href={`/product/${product.slug}`}
            className="flex flex-col w-[335px] h-[335px] mx-auto text-center font-InterLight overflow-hidden"
        >
            <div className="bg-white p-2 relative flex-1 min-h-0 w-full flex items-center justify-center">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain"
                />
            </div>

            <div className="mt-4 px-2 shrink-0 pb-2">
                <p className="text-[12px] uppercase tracking-[0.22em] text-[#1a1a1e] leading-relaxed font-InterLight line-clamp-2">
                    {product.name}
                </p>

                <p className="mt-3 text-[12px] text-[#6a6a6a] font-InterLight">
                    {product.price.toFixed(2).replace(".", ",")} lei
                </p>
            </div>
        </Link>
    );
}