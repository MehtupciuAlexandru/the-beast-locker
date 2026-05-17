"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductPreview } from "@/types/product";
import ProductCardCompact from "@/components/product/ProductCardCompact";
import FiltersSidebar from "@/components/filters/FiltersSidebar";
import SortDropdown from "@/components/sort/SortDropdown";

type SortOption =
    | "featured"
    | "best_selling"
    | "a_z"
    | "z_a"
    | "price_low"
    | "price_high";

type ProductsLayoutProps = {
    products: ProductPreview[];
    title?: string;
};

export default function ProductsLayout({
                                           products,
                                           title = "Explorează",
                                       }: ProductsLayoutProps) {
    const [selectedEquipmentType, setSelectedEquipmentType] = useState("");
    const [inStockOnly, setInStockOnly] = useState(false);
    const [sort, setSort] = useState<SortOption>("featured");

    const [columns, setColumns] = useState<1 | 2>(2);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();

    const selectedCollection = searchParams.get("collection") || "";

    const setCollection = (collectionSlug: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (collectionSlug) {
            params.set("collection", collectionSlug);
        } else {
            params.delete("collection");
        }

        const queryString = params.toString();

        router.push(queryString ? `/products?${queryString}` : "/products");
    };

    const resetFilters = () => {
        const params = new URLSearchParams(searchParams.toString());

        params.delete("collection");

        setSelectedEquipmentType("");
        setInStockOnly(false);

        const queryString = params.toString();

        router.push(queryString ? `/products?${queryString}` : "/products");
    };

    const sortedProducts = useMemo(() => {
        let result = [...products];

        if (selectedEquipmentType) {
            result = result.filter((product: any) => {
                const searchableText = [
                    product.name,
                    product.slug,
                    product.searchKeywords,
                    product.seoTitle,
                    product.seoDescription,
                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();

                return searchableText.includes(selectedEquipmentType.toLowerCase());
            });
        }

        if (sort === "a_z") {
            result.sort((a, b) => a.name.localeCompare(b.name));
        }

        if (sort === "z_a") {
            result.sort((a, b) => b.name.localeCompare(a.name));
        }

        if (sort === "price_low") {
            result.sort((a, b) => a.price - b.price);
        }

        if (sort === "price_high") {
            result.sort((a, b) => b.price - a.price);
        }

        return result;
    }, [products, sort, selectedEquipmentType]);

    return (
        <section className="w-full bg-[#f3f3f3] px-6 lg:px-12 py-8">

            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-xs tracking-widest text-black uppercase">
                    {title}
                </h1>

                {/* Desktop Sort */}
                <div className="hidden lg:flex items-center gap-4">

                    {/* Quick buttons for price sorting */}
                    <button
                        onClick={() => setSort("price_low")}
                        className={`text-xs ${
                            sort === "price_low" ? "font-bold" : ""
                        }`}
                    >
                        PRICE ↑
                    </button>

                    <button
                        onClick={() => setSort("price_high")}
                        className={`text-xs ${
                            sort === "price_high" ? "font-bold" : ""
                        }`}
                    >
                        PRICE ↓
                    </button>

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
                        selectedCollection={selectedCollection}
                        setCollection={setCollection}
                        selectedEquipmentType={selectedEquipmentType}
                        setSelectedEquipmentType={setSelectedEquipmentType}
                        inStockOnly={inStockOnly}
                        setInStockOnly={setInStockOnly}
                        resetFilters={resetFilters}
                    />
                </div>

                {/* Products */}
                <div className="flex-1">
                    {sortedProducts.length === 0 ? (
                        <div className="py-20 text-center">
                            <p className="text-sm uppercase tracking-widest text-black">
                                Nu am găsit produse.
                            </p>
                        </div>
                    ) : (
                        <div
                            className={`grid ${
                                columns === 1 ? "grid-cols-1" : "grid-cols-2"
                            } md:grid-cols-3 gap-x-8 gap-y-12`}
                        >
                            {sortedProducts.map((product) => (
                                <ProductCardCompact
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>
                    )}
                </div>

            </div>

            {/* Mobile Filters Modal */}
            <>
                <div
                    onClick={() => setMobileFiltersOpen(false)}
                    className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
                        mobileFiltersOpen ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
                />

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
                        selectedCollection={selectedCollection}
                        setCollection={(value) => {
                            setCollection(value);
                            setMobileFiltersOpen(false);
                        }}
                        selectedEquipmentType={selectedEquipmentType}
                        setSelectedEquipmentType={(value) => {
                            setSelectedEquipmentType(value);
                            setMobileFiltersOpen(false);
                        }}
                        inStockOnly={inStockOnly}
                        setInStockOnly={setInStockOnly}
                        resetFilters={() => {
                            resetFilters();
                            setMobileFiltersOpen(false);
                        }}
                    />
                </div>
            </>

        </section>
    );
}