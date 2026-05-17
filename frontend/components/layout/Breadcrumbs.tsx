import Link from "next/link";

type ProductCollection = {
    id: string;
    name: string;
    slug: string;
};

type ProductBreadcrumbsProps = {
    product: {
        name: string;
        collections?: ProductCollection[];
    };
};

export default function ProductBreadcrumbs({ product }: ProductBreadcrumbsProps) {
    const collection = product.collections?.[0];

    return (
        <section className="w-full bg-white px-6 lg:px-20 py-5 border-y border-gray-200">
            <nav className="flex flex-wrap items-center gap-1 text-[10px] uppercase tracking-widest text-gray-500">
                {collection && (
                    <>
                        <Link
                            href={`/products?collection=${collection.slug}`}
                            className="transition hover:text-black"
                        >
                            {collection.name}
                        </Link>

                        <span>/</span>
                    </>
                )}

                <span className="text-gray-700">
                    {product.name}
                </span>
            </nav>
        </section>
    );
}