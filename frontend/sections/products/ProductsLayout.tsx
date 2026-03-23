"use client";

import { useEffect, useState } from "react";
import { ProductPreview } from "@/types/product";
import ProductCardCompact from "@/components/product/ProductCardCompact";
import FiltersSidebar from "@/components/filters/FiltersSidebar";
import SortDropdown from "@/components/sort/SortDropdown";
import { getProducts } from "@/lib/api/products";

type SortOption =
    | "featured"
    | "best_selling"
    | "a_z"
    | "z_a"
    | "price_low"
    | "price_high";

type ProductsLayoutProps = {
    products: ProductPreview[];
};

export default function ProductsLayout({ products }: ProductsLayoutProps) {
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [inStockOnly, setInStockOnly] = useState(false);
    const [sort, setSort] = useState<SortOption>("featured");

    const [data, setData] = useState<ProductPreview[]>(products);

    const [columns, setColumns] = useState<1 | 2>(2);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    const query = {
        sizes: selectedSizes,
        colors: selectedColors,
        inStock: inStockOnly,
        sort,
    };

    const toggleSize = (size: string) => {
        setSelectedSizes((prev) =>
            prev.includes(size)
                ? prev.filter((item) => item !== size)
                : [...prev, size]
        );
    };

    const toggleColor = (color: string) => {
        setSelectedColors((prev) =>
            prev.includes(color)
                ? prev.filter((item) => item !== color)
                : [...prev, color]
        );
    };

    const resetFilters = () => {
        setSelectedSizes([]);
        setSelectedColors([]);
        setInStockOnly(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            const result = await getProducts(query);
            setData(result);
        };

        fetchData();
    }, [selectedSizes, selectedColors, inStockOnly, sort]);

    return (
        <section className="w-full bg-[#f3f3f3] px-6 lg:px-12 py-8">

            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-xs tracking-widest text-black">
                    EXPLORE
                </h1>

                <div className="hidden lg:block">
                    <SortDropdown value={sort} onChange={setSort} />
                </div>
            </div>

            {/* Mobile Controls */}
            <div className="flex lg:hidden border-t border-b border-black">

                <button
                    onClick={() => setMobileFiltersOpen(true)}
                    className="flex-1 py-3 text-[10px] tracking-widest text-black border-r border-black"
                >
                    FILTRE
                </button>

                <div className="flex-1 border-r border-black flex items-center justify-center">
                    <SortDropdown value={sort} onChange={setSort} />
                </div>

                <div className="flex">
                    <button
                        onClick={() => setColumns(1)}
                        className={`px-3 ${
                            columns === 1 ? "bg-black text-white" : "text-black"
                        }`}
                    >
                        ▢
                    </button>

                    <button
                        onClick={() => setColumns(2)}
                        className={`px-3 ${
                            columns === 2 ? "bg-black text-white" : "text-black"
                        }`}
                    >
                        ▦
                    </button>
                </div>
            </div>

            <div className="flex gap-16 mt-6">

                {/* Desktop Filters */}
                <div className="hidden lg:block">
                    <FiltersSidebar
                        selectedSizes={selectedSizes}
                        toggleSize={toggleSize}
                        selectedColors={selectedColors}
                        toggleColor={toggleColor}
                        inStockOnly={inStockOnly}
                        setInStockOnly={setInStockOnly}
                        resetFilters={resetFilters}
                    />
                </div>

                {/* Products */}
                <div className="flex-1">
                    <div
                        className={`grid ${
                            columns === 1 ? "grid-cols-1" : "grid-cols-2"
                        } md:grid-cols-3 gap-x-8 gap-y-12`}
                    >
                        {data.map((product) => (
                            <ProductCardCompact
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </div>
                </div>

            </div>

            {/* Mobile Filters Modal */}
            <>
                {/* Overlay */}
                <div
                    onClick={() => setMobileFiltersOpen(false)}
                    className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
                        mobileFiltersOpen ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
                />

                {/* Drawer */}
                <div
                    className={`fixed top-0 left-0 h-full w-[280px] bg-white z-50 p-6 overflow-y-auto transform transition-transform duration-300 ${
                        mobileFiltersOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                >
                    <button
                        onClick={() => setMobileFiltersOpen(false)}
                        className="mb-6 text-sm text-black"
                    >
                        CLOSE
                    </button>

                    <FiltersSidebar
                        selectedSizes={selectedSizes}
                        toggleSize={toggleSize}
                        selectedColors={selectedColors}
                        toggleColor={toggleColor}
                        inStockOnly={inStockOnly}
                        setInStockOnly={setInStockOnly}
                        resetFilters={resetFilters}
                    />
                </div>
            </>

        </section>
    );
}