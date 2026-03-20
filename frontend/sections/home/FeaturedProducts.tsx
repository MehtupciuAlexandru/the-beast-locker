import Image from "next/image";

const baseProducts = [
    {
        name: "TRICOU TANK TOP NEGRU",
        price: "149 RON",
        image: "/images/products/tankTopProduct.jpeg",
    },
    {
        name: "MĂNUȘI BOX PREMIUM",
        price: "249 RON",
        image: "/images/products/glovesProduct.jpeg",
    },
];

// build 12 items
const products = Array.from({ length: 12 }, (_, i) => baseProducts[i % 2]);

export default function FeaturedProducts() {
    return (
        <section className="w-full bg-white flex justify-center">
            <div className="w-full py-10 ml-5 mr-5">

                {/* Title */}
                <h2 className="text-sm font-semibold tracking-widest mb-5 text-black">
                    CELE MAI VANDUTE
                </h2>
                <div className="w-full h-[1px] bg-gray-300 mt-3 mb-6" />

                {/* Grid: 2 cols mobile, 4 cols desktop */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6">
                    {products.map((product, index) => (
                        <button
                            key={index}
                            type="button"
                            aria-label={`View product ${product.name}`}
                            className="flex flex-col items-center text-center group"
                        >
                            {/* Image frame */}
                            <div className="relative w-full aspect-square mb-3 p-4">
                                <Image
                                    src={product.image}
                                    alt=""
                                    fill
                                    unoptimized
                                    className="object-cover"
                                />
                            </div>

                            {/* Name */}
                            <p className="text-[11px] uppercase tracking-wide text-gray-900">
                                {product.name}
                            </p>

                            {/* Price */}
                            <p className="text-[11px] font-semibold mt-1 text-gray-800">
                                {product.price}
                            </p>
                        </button>
                    ))}
                </div>

                {/* CTA */}
                <div className="flex justify-center mt-10">
                    <button
                        type="button"
                        aria-label="Shop collection"
                        className="border border-black px-6 py-2 text-xs font-semibold tracking-widest transition hover:bg-black hover:text-white"
                    >
                        VEZI TOT
                    </button>
                </div>

            </div>
        </section>
    );
}