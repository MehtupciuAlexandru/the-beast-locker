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
            className={`block text-left ${className}`}
        >
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-white">
                <img
                    src={product.image}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </div>

            <p className="mt-3 text-[11px] uppercase leading-5 tracking-[0.12em] text-gray-800">
                {product.name}
            </p>

            <p className="mt-1 text-[11px] text-gray-600">
                {product.price.toFixed(2)} lei
            </p>
        </Link>
    );
}