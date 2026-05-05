"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronDown, X, ArrowRight, Loader2 } from "lucide-react";
import { ProductPreview } from "@/types/product";

type SidebarMenuProps = {
    isOpen: boolean;
    onClose: () => void;
};

type OpenSection = "equipment" | "clothes" | "all" | null;

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchProducts(collectionSlug?: string): Promise<ProductPreview[]> {
    if (!API_URL) return [];

    const res = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: `
                query SidebarProducts($collectionSlug: String) {
                    search(input: {
                        collectionSlug: $collectionSlug
                        groupByProduct: true
                        take: 10
                    }) {
                        items {
                            productId
                            productName
                            slug
                            productAsset {
                                preview
                            }
                            priceWithTax {
                                ... on SinglePrice {
                                    value
                                }
                                ... on PriceRange {
                                    min
                                }
                            }
                        }
                    }
                }
            `,
            variables: {
                collectionSlug: collectionSlug || undefined,
            },
        }),
    });

    if (!res.ok) return [];

    const json = await res.json();

    if (json.errors || !json?.data?.search?.items) return [];

    return json.data.search.items.map((item: any) => {
        const price =
            item.priceWithTax?.value ??
            item.priceWithTax?.min ??
            0;

        return {
            id: item.productId,
            name: item.productName,
            slug: item.slug,
            image: item.productAsset?.preview || "",
            price: price / 100,
        };
    });
}

export default function SidebarMenu({ isOpen, onClose }: SidebarMenuProps) {
    const [openSection, setOpenSection] = useState<OpenSection>(null);
    const [equipmentProducts, setEquipmentProducts] = useState<ProductPreview[]>([]);
    const [clothesProducts, setClothesProducts] = useState<ProductPreview[]>([]);
    const [allProducts, setAllProducts] = useState<ProductPreview[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        let cancelled = false;

        async function loadProducts() {
            setIsLoading(true);

            const [equipment, clothes, all] = await Promise.all([
                fetchProducts("equipment"),
                fetchProducts("clothes"),
                fetchProducts(),
            ]);

            if (!cancelled) {
                setEquipmentProducts(equipment);
                setClothesProducts(clothes);
                setAllProducts(all);
                setIsLoading(false);
            }
        }

        loadProducts();

        return () => {
            cancelled = true;
        };
    }, [isOpen]);

    const toggleSection = (section: OpenSection) => {
        setOpenSection((current) => current === section ? null : section);
    };

    const renderProducts = (products: ProductPreview[], collectionHref?: string) => {
        if (isLoading) {
            return (
                <div className="flex items-center gap-2 px-8 py-4">
                    <Loader2 className="h-3 w-3 animate-spin text-zinc-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Încărcare...</span>
                </div>
            );
        }

        if (products.length === 0) {
            return (
                <p className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-300">
                    Niciun produs găsit
                </p>
            );
        }

        return (
            <div className="flex flex-col bg-zinc-50 border-y border-zinc-100 animate-in fade-in slide-in-from-top-1 duration-200">
                {products.map((product) => (
                    <Link
                        key={product.id}
                        href={`/product/${product.slug}`}
                        onClick={onClose}
                        className="group flex items-center justify-between px-8 py-3.5 transition-colors hover:bg-white"
                    >
                        <span className="text-[11px] font-bold uppercase tracking-tight text-zinc-600 group-hover:text-black transition-colors">
                            {product.name}
                        </span>

                    </Link>
                ))}

                {collectionHref && (
                    <Link
                        href={collectionHref}
                        onClick={onClose}
                        className="flex items-center justify-between px-8 py-4 bg-black group transition-colors hover:bg-zinc-800"
                    >
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Vezi toate</span>
                        <ArrowRight size={14} className="text-white transition-transform group-hover:translate-x-1" />
                    </Link>
                )}
            </div>
        );
    };

    return (
        <>
            <div
                onClick={onClose}
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-all duration-500 z-[60] ${
                    isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
            />

            <div
                className={`fixed top-0 left-0 h-full w-[300px] sm:w-[380px] bg-white text-black z-[70] transform transition-transform duration-500 ease-out shadow-2xl border-r border-zinc-100 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-8">
                        <span className="text-xl font-black tracking-tighter italic">BEAST <span className="text-zinc-300">LOCKER</span></span>
                        <button
                            onClick={onClose}
                            className="group flex items-center gap-2 text-[10px] font-black tracking-widest text-zinc-400 hover:text-black transition-colors"
                        >
                            ÎNCHIDE <X size={16} className="group-hover:rotate-90 transition-transform" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar">
                        <nav className="flex flex-col">
                            <div className="border-t border-zinc-100">
                                <button
                                    type="button"
                                    onClick={() => toggleSection("equipment")}
                                    className={`flex w-full items-center justify-between px-8 py-6 text-left transition-all ${
                                        openSection === "equipment" ? "bg-zinc-50" : "hover:bg-zinc-50/50"
                                    }`}
                                >
                                    <span className="text-xs font-black uppercase tracking-[0.2em]">Echipamente</span>
                                    <ChevronDown
                                        className={`h-4 w-4 text-zinc-400 transition-transform duration-300 ${
                                            openSection === "equipment" ? "rotate-180 text-black" : ""
                                        }`}
                                    />
                                </button>
                                {openSection === "equipment" && renderProducts(equipmentProducts, "/products?collection=equipment")}
                            </div>

                            <div className="border-t border-zinc-100">
                                <button
                                    type="button"
                                    onClick={() => toggleSection("clothes")}
                                    className={`flex w-full items-center justify-between px-8 py-6 text-left transition-all ${
                                        openSection === "clothes" ? "bg-zinc-50" : "hover:bg-zinc-50/50"
                                    }`}
                                >
                                    <span className="text-xs font-black uppercase tracking-[0.2em]">Îmbrăcăminte</span>
                                    <ChevronDown
                                        className={`h-4 w-4 text-zinc-400 transition-transform duration-300 ${
                                            openSection === "clothes" ? "rotate-180 text-black" : ""
                                        }`}
                                    />
                                </button>
                                {openSection === "clothes" && renderProducts(clothesProducts, "/products?collection=clothes")}
                            </div>

                            <div className="border-y border-zinc-100">
                                <button
                                    type="button"
                                    onClick={() => toggleSection("all")}
                                    className={`flex w-full items-center justify-between px-8 py-6 text-left transition-all ${
                                        openSection === "all" ? "bg-zinc-50" : "hover:bg-zinc-50/50"
                                    }`}
                                >
                                    <span className="text-xs font-black uppercase tracking-[0.2em]">Explorează</span>
                                    <ChevronDown
                                        className={`h-4 w-4 text-zinc-400 transition-transform duration-300 ${
                                            openSection === "all" ? "rotate-180 text-black" : ""
                                        }`}
                                    />
                                </button>
                                {openSection === "all" && renderProducts(allProducts, "/products")}
                            </div>
                        </nav>
                    </div>

                    <div className="p-8">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-300">
                            © 2026 Beast Locker
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}