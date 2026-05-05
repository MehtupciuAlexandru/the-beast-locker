"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, X, ArrowRight } from "lucide-react";

// Types and API function are identical and preserved
type SearchSuggestion = {
    id: string;
    name: string;
    slug: string;
    image: string;
    price: number;
};

type SearchOverlayProps = {
    isOpen: boolean;
    onClose: () => void;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function searchProductSuggestions(term: string): Promise<SearchSuggestion[]> {
    if (!API_URL) throw new Error("NEXT_PUBLIC_API_URL is not defined");

    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            query: `
                query SearchSuggestions($term: String!) {
                    search(input: { term: $term, groupByProduct: true, take: 5 }) {
                        items {
                            productId
                            productName
                            slug
                            productAsset { preview }
                            priceWithTax {
                                ... on SinglePrice { value }
                                ... on PriceRange { min }
                            }
                        }
                    }
                }
            `,
            variables: { term },
        }),
    });

    if (!res.ok) throw new Error("Failed to fetch search suggestions");

    const json = await res.json();

    if (json.errors) throw new Error(json.errors[0].message);

    return json.data.search.items.map((item: any) => ({
        id: item.productId,
        name: item.productName,
        slug: item.slug,
        image: item.productAsset?.preview || "",
        price: (item.priceWithTax?.value ?? item.priceWithTax?.min ?? 0) / 100,
    }));
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    useEffect(() => {
        const trimmedQuery = query.trim();

        if (!isOpen || trimmedQuery.length < 2) {
            setSuggestions([]);
            setIsLoading(false);
            return;
        }

        let cancelled = false;

        const timeout = setTimeout(async () => {
            try {
                setIsLoading(true);
                const results = await searchProductSuggestions(trimmedQuery);

                if (!cancelled) setSuggestions(results);
            } catch (error) {
                if (!cancelled) setSuggestions([]);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }, 250);

        return () => {
            cancelled = true;
            clearTimeout(timeout);
        };
    }, [query, isOpen]);

    const closeSearch = () => {
        setQuery("");
        setSuggestions([]);
        onClose();
    };

    const handleSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
        event?.preventDefault();

        const trimmedQuery = query.trim();

        if (!trimmedQuery) {
            router.push("/products");
            closeSearch();
            return;
        }

        if (isLoading) return;

        if (suggestions.length === 0) {
            router.push("/products");
            closeSearch();
            return;
        }

        router.push(`/products?q=${encodeURIComponent(trimmedQuery)}`);
        closeSearch();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-20 sm:pt-32">
            <div
                onClick={closeSearch}
                className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity animate-in fade-in duration-500"
            />

            <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 slide-in-from-top-6 duration-300">

                <div className="border-b border-zinc-100 p-6">
                    <form onSubmit={handleSubmit} className="relative group">
                        <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-6 text-zinc-400 group-focus-within:text-black transition-colors" />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            autoFocus
                            placeholder="Ce cauți în catalog?"
                            className="w-full bg-transparent pl-10 pr-12 py-3 text-2xl font-bold uppercase tracking-tight text-black outline-none placeholder:text-zinc-300 placeholder:normal-case placeholder:font-medium placeholder:tracking-normal"
                        />
                        <div className="absolute bottom-0 left-0 h-px w-full bg-zinc-100 group-focus-within:bg-black group-focus-within:h-0.5 transition-all" />
                        <button
                            type="button"
                            onClick={closeSearch}
                            className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-black hover:rotate-90 transition-all duration-300"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </form>
                </div>

                <div className="max-h-[65vh] overflow-y-auto bg-white">
                    {query.trim().length >= 2 ? (
                        <>
                            {isLoading && (
                                <div className="flex flex-col items-center gap-4 p-12 text-zinc-500">
                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-black" />
                                    <p className="text-sm uppercase tracking-widest font-semibold text-center">Se caută în catalog...</p>
                                </div>
                            )}

                            {!isLoading && suggestions.length === 0 && (
                                <div className="p-12 text-center text-zinc-500">
                                    <p className="text-lg italic">Nu am găsit niciun produs pentru "{query}"</p>
                                    <p className="text-sm mt-1">Verificați ortografia sau încercați un alt cuvânt cheie.</p>
                                </div>
                            )}

                            {!isLoading && suggestions.length > 0 && (
                                <div>
                                    {/* Section Header */}
                                    <div className="flex items-center justify-between bg-zinc-50 px-8 py-4 border-b border-zinc-100">
                                        <span className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Sugestii Produse</span>
                                        <button
                                            type="button"
                                            onClick={() => handleSubmit()}
                                            className="text-[11px] font-bold uppercase tracking-widest text-black flex items-center gap-1.5 group hover:underline"
                                        >
                                            Vezi toate rezultatele <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                                        </button>
                                    </div>

                                    <div className="divide-y divide-zinc-100 px-2">
                                        {suggestions.map((product, index) => (
                                            <Link
                                                key={product.id}
                                                href={`/product/${product.slug}`}
                                                onClick={closeSearch}
                                                className={`group flex items-center gap-6 px-6 py-5 transition-colors hover:bg-zinc-50/50 rounded-xl animate-in slide-in-from-top-2 duration-300`}
                                                style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'both' }}
                                            >
                                                <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-zinc-100 shadow-inner group-hover:shadow-lg transition-shadow">
                                                    {product.image && (
                                                        <Image
                                                            src={product.image}
                                                            alt={product.name}
                                                            fill
                                                            unoptimized
                                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                        />
                                                    )}
                                                </div>

                                                <div className="flex flex-1 flex-col justify-between self-stretch">
                                                    <div>
                                                        <p className="text-base font-bold uppercase tracking-tight text-black line-clamp-1 group-hover:text-black/80 transition-colors">
                                                            {product.name}
                                                        </p>
                                                        <p className="text-xs uppercase tracking-widest text-zinc-400 mt-1">
                                                            Ref: {product.slug.split("-").slice(0, 2).join(" ")}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="text-right flex items-center self-stretch ml-auto pl-4">
                                                    <p className="text-lg font-black text-black">
                                                        {product.price.toFixed(2)} <span className="text-[11px]">RON</span>
                                                    </p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="p-12 text-center">
                            <p className="text-xs uppercase tracking-[0.25em] text-zinc-300 font-bold">Introdu cel puțin 2 caractere pentru a căuta.</p>
                        </div>
                    )}
                </div>

                <div className="bg-zinc-50 px-8 py-4 border-t border-zinc-100">
                    <p className="text-[11px] text-zinc-400 text-center font-medium">
                        Apasă <kbd className="rounded-md border border-zinc-200 px-1.5 py-0.5 bg-white shadow-inner font-mono">ESC</kbd> pentru a închide căutarea.
                    </p>
                </div>
            </div>
        </div>
    );
}