import Image from "next/image";
import Link from "next/link";
import { ProductPreview } from "@/types/product";

type Props = {
    product: ProductPreview;
};

export default function ProductCardCompact({ product }: Props) {
    return (
        <Link
            href={`/product/${product.slug}`}
            className="block"
        >
            {/* Image */}
            <div className="bg-white p-2">
                <div className="relative aspect-square w-full">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain"
                    />
                </div>
            </div>

            {/* Name */}
            <p className="mt-2 text-[10px] tracking-widest text-black">
                {product.name}
            </p>

            {/* Price */}
            <p className="mt-1 text-[10px] text-black">
                {product.price.toFixed(2)} lei
            </p>
        </Link>
    );
}