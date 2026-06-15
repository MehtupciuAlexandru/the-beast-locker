import Image from "next/image";
import Link from "next/link";
import { ProductPreview } from "@/types/product";

type ProductCardProps = {
    product: ProductPreview;
    className?: string;
};

export default function ProductCard({ product, className = "" }: ProductCardProps) {
    return (
        <Link
            href={`/product/${product.slug}`}
            aria-label={`View ${product.name}`}
            className={`flex flex-col items-center justify-center ${className}`}
        >
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-white">
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-contain p-3"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] uppercase tracking-widest text-neutral-300">
                        Fără imagine
                    </div>
                )}
            </div>

            <div className="mt-4 flex flex-col items-center text-center w-full px-2">
                <p className="text-[11px] uppercase leading-5 tracking-[0.18em] text-[#1a1a1a] font-Inter w-full">
                    {product.name}
                </p>

                <p className="mt-2 text-[13px] font-InterLight text-neutral-400 tracking-wide w-full">
                    {product.price.toFixed(2).replace(".", ",")} lei
                </p>
            </div>
        </Link>
    );
}