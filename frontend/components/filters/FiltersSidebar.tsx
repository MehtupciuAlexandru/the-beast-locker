"use client";

import { useEffect, useState } from "react";
import { getCollections, StoreCollection } from "@/lib/api/collections";

type FiltersSidebarProps = {
    selectedCollection: string;
    setCollection: (value: string) => void;
    selectedEquipmentType: string;
    setSelectedEquipmentType: (value: string) => void;
    inStockOnly: boolean;
    setInStockOnly: (value: boolean) => void;
    resetFilters: () => void;
};


const equipmentTypes = [
    { label: "MANUSI BOX", slug: "manusi-box" },
    { label: "TIBIERE", slug: "tibiere" },
    { label: "MANUSI MMA", slug: "manusi-mma" },
    { label: "BANDAJE", slug: "bandaje" },
    // { label: "NO PLAN B", slug: "no-plan-b" },
];

export default function FiltersSidebar({
                                           selectedCollection,
                                           setCollection,
                                           selectedEquipmentType,
                                           setSelectedEquipmentType,
                                           inStockOnly,
                                           setInStockOnly,
                                           resetFilters,
                                       }: FiltersSidebarProps) {
    const [collections, setCollections] = useState<StoreCollection[]>([]);
    const [collectionsOpen, setCollectionsOpen] = useState(false);
    const [equipmentOpen, setEquipmentOpen] = useState(false);
    const [stockOpen, setStockOpen] = useState(false);

    const visibleCollectionSlugs = ["no-plan-b"];


    useEffect(() => {
        let cancelled = false;

        async function loadCollections() {
            try {
                const result = await getCollections();

                const visibleCollections = result.filter((collection) =>
                    visibleCollectionSlugs.includes(collection.slug)
                );

                if (!cancelled) {
                    setCollections(visibleCollections);
                }
            } catch {
                if (!cancelled) {
                    setCollections([]);
                }
            }
        }

        loadCollections();

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div className="w-[420px] text-[#1C1C1E] select-none font-Inter p-2">
            <div className="mb-5 border-b border-neutral-200 pb-3">
                <button
                    type="button"
                    onClick={() => setCollectionsOpen((prev) => !prev)}
                    className="flex w-full items-center justify-between text-[11px] font-medium tracking-widest text-[#1C1C1E] cursor-pointer"
                >
                    <span>COLECȚIE</span>
                    <span className="text-sm font-light text-[#1C1C1E]/50">{collectionsOpen ? "−" : "+"}</span>
                </button>

                {collectionsOpen && (
                    <div className="mt-3 flex flex-col gap-2 pl-0.5">
                        {/*<button*/}
                        {/*    type="button"*/}
                        {/*    onClick={() => setCollection("")}*/}
                        {/*    className={`text-left text-[10px] tracking-widest cursor-pointer transition-colors ${*/}
                        {/*        selectedCollection === "" ? "font-bold text-[#1C1C1E]" : "text-[#1C1C1E]/50 hover:text-[#1C1C1E]"*/}
                        {/*    }`}*/}
                        {/*>*/}
                        {/*    TOATE*/}
                        {/*</button>*/}

                        {collections.map((collection) => (
                            <button
                                key={collection.id}
                                type="button"
                                onClick={() => setCollection(collection.slug)}
                                className={`text-left text-[10px] uppercase tracking-widest cursor-pointer transition-colors ${
                                    selectedCollection === collection.slug ? "font-bold text-[#1C1C1E]" : "text-[#1C1C1E]/50 hover:text-[#1C1C1E]"
                                }`}
                            >
                                {collection.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="mb-5 border-b border-neutral-200 pb-3">
                <button
                    type="button"
                    onClick={() => setEquipmentOpen((prev) => !prev)}
                    className="flex w-full items-center justify-between text-[11px] font-medium tracking-widest text-[#1C1C1E] cursor-pointer"
                >
                    <span>TIPUL ECHIPAMENTULUI</span>
                    <span className="text-sm font-light text-[#1C1C1E]/50">{equipmentOpen ? "−" : "+"}</span>
                </button>

                {equipmentOpen && (
                    <div className="mt-3 flex flex-col gap-2 pl-0.5">
                        {/*<button*/}
                        {/*    type="button"*/}
                        {/*    onClick={() => {*/}
                        {/*        setSelectedEquipmentType("");*/}
                        {/*        setCollection("");*/}
                        {/*    }}*/}
                        {/*    className={`text-left text-[10px] tracking-widest cursor-pointer transition-colors ${*/}
                        {/*        selectedCollection === "" ? "font-bold text-[#1C1C1E]" : "text-[#1C1C1E]/50 hover:text-[#1C1C1E]"*/}
                        {/*    }`}*/}
                        {/*>*/}
                        {/*    TOATE*/}
                        {/*</button>*/}

                        {equipmentTypes.map((type) => (
                            <button
                                key={type.slug}
                                type="button"
                                onClick={() => {
                                    setSelectedEquipmentType("");
                                    setCollection(type.slug);
                                }}
                                className={`text-left text-[10px] tracking-widest cursor-pointer transition-colors ${
                                    selectedCollection === type.slug
                                        ? "font-bold text-[#1C1C1E]"
                                        : "text-[#1C1C1E]/50 hover:text-[#1C1C1E]"
                                }`}
                            >
                                {type.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="mb-5 border-b border-neutral-200 pb-3">
                <button
                    type="button"
                    onClick={() => setStockOpen((prev) => !prev)}
                    className="flex w-full items-center justify-between text-[11px] font-medium tracking-widest text-[#1C1C1E] cursor-pointer"
                >
                    <span>STOC</span>
                    <span className="text-sm font-light text-[#1C1C1E]/50">{stockOpen ? "−" : "+"}</span>
                </button>

                {stockOpen && (
                    <div className="mt-3">
                        <div
                            onClick={() => setInStockOnly(!inStockOnly)}
                            className={`w-[36px] h-[18px] relative cursor-pointer p-[1px] border transition-colors duration-150 ease-out ${
                                inStockOnly ? "bg-[#1C1C1E] border-[#1C1C1E]" : "bg-[#b3b3b3] border-[#b3b3b3]"
                            }`}
                        >
                            <div
                                className={`w-[16px] h-full bg-white border border-neutral-300 shadow-sm transition-transform duration-150 ease-out ${
                                    inStockOnly ? "translate-x-[16px]" : "translate-x-0"
                                }`}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="pt-1">
                <p className="mb-3 text-[11px] font-medium tracking-widest text-[#1C1C1E]">RESETARE FILTRE</p>
                <button
                    type="button"
                    onClick={resetFilters}
                    className="border border-neutral-200 w-24 py-2.5 text-[10px] font-medium tracking-[0.2em] text-[#1C1C1E]/50 hover:text-[#1C1C1E] hover:border-[#1C1C1E] transition-colors cursor-pointer bg-white"
                >
                    RESET
                </button>
            </div>
        </div>
    );
}