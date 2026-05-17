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
    "MANUSI BOX",
    "TIBIERE",
    "MANUSI MMA",
    "BANDAJE",
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
    const [collectionsOpen, setCollectionsOpen] = useState(true);
    const [equipmentOpen, setEquipmentOpen] = useState(true);
    const [stockOpen, setStockOpen] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function loadCollections() {
            try {
                const result = await getCollections();

                if (!cancelled) {
                    setCollections(result);
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
        <div className="w-[230px] text-black select-none font-sans  p-2">
            <div className="mb-5 border-b border-neutral-200 pb-3">
                <button
                    type="button"
                    onClick={() => setCollectionsOpen((prev) => !prev)}
                    className="flex w-full items-center justify-between text-[11px] font-medium tracking-widest text-neutral-800 cursor-pointer"
                >
                    <span>COLECȚIE</span>
                    <span className="text-sm font-light text-neutral-400">{collectionsOpen ? "−" : "+"}</span>
                </button>

                {collectionsOpen && (
                    <div className="mt-3 flex flex-col gap-2 pl-0.5">
                        <button
                            type="button"
                            onClick={() => setCollection("")}
                            className={`text-left text-[10px] tracking-widest cursor-pointer transition-colors ${
                                selectedCollection === "" ? "font-bold text-black" : "text-neutral-400 hover:text-black"
                            }`}
                        >
                            TOATE
                        </button>

                        {collections.map((collection) => (
                            <button
                                key={collection.id}
                                type="button"
                                onClick={() => setCollection(collection.slug)}
                                className={`text-left text-[10px] uppercase tracking-widest cursor-pointer transition-colors ${
                                    selectedCollection === collection.slug ? "font-bold text-black" : "text-neutral-400 hover:text-black"
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
                    className="flex w-full items-center justify-between text-[11px] font-medium tracking-widest text-neutral-800 cursor-pointer"
                >
                    <span>TIPUL ECHIPAMENTULUI</span>
                    <span className="text-sm font-light text-neutral-400">{equipmentOpen ? "−" : "+"}</span>
                </button>

                {equipmentOpen && (
                    <div className="mt-3 flex flex-col gap-2 pl-0.5">
                        <button
                            type="button"
                            onClick={() => setSelectedEquipmentType("")}
                            className={`text-left text-[10px] tracking-widest cursor-pointer transition-colors ${
                                selectedEquipmentType === "" ? "font-bold text-black" : "text-neutral-400 hover:text-black"
                            }`}
                        >
                            TOATE
                        </button>

                        {equipmentTypes.map((type) => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => setSelectedEquipmentType(type)}
                                className={`text-left text-[10px] tracking-widest cursor-pointer transition-colors ${
                                    selectedEquipmentType === type ? "font-bold text-black" : "text-neutral-400 hover:text-black"
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="mb-5 border-b border-neutral-200 pb-3">
                <button
                    type="button"
                    onClick={() => setStockOpen((prev) => !prev)}
                    className="flex w-full items-center justify-between text-[11px] font-medium tracking-widest text-neutral-800 cursor-pointer"
                >
                    <span>STOC</span>
                    <span className="text-sm font-light text-neutral-400">{stockOpen ? "−" : "+"}</span>
                </button>

                {stockOpen && (
                    <div className="mt-3">
                        <div
                            onClick={() => setInStockOnly(!inStockOnly)}
                            className={`w-[36px] h-[18px] relative cursor-pointer p-[1px] border transition-colors duration-150 ease-out ${
                                inStockOnly ? "bg-black border-black" : "bg-[#b3b3b3] border-[#b3b3b3]"
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
                <p className="mb-3 text-[11px] font-medium tracking-widest text-neutral-700">RESETARE FILTRE</p>
                <button
                    type="button"
                    onClick={resetFilters}
                    className="border border-neutral-200 w-24 py-2.5 text-[10px] font-medium tracking-[0.2em] text-neutral-400 hover:text-black hover:border-black transition-colors cursor-pointer bg-white"
                >
                    RESET
                </button>
            </div>
        </div>
    );
}