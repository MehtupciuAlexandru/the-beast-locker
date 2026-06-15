"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { addToCart } from "@/lib/api/cart";
import { useCartUI } from "@/lib/context/CartUIContext";
import { addRecentlyViewedProduct } from "@/lib/recentlyViewed";

type Props = {
    product: any;
};

export default function ProductDetails({ product }: Props) {
    const productImages = product.gallery.length > 0
        ? product.gallery
        : [product.image];

    const variants = product.variants || [];

    const getVariantLabel = (variant: any) => {
        const optionNames = variant.options
            ?.map((option: any) => option.name)
            .join(" / ");

        return optionNames || variant.name;
    };

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedVariantId, setSelectedVariantId] = useState(
        variants[0]?.id || product.variantId
    );
    const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);
    const [isCompositionOpen, setIsCompositionOpen] = useState(false);
    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

    const selectedVariant =
        variants.find((variant: any) => variant.id === selectedVariantId) ||
        variants[0];

    const displayedPrice = selectedVariant?.price ?? product.price;

    const variantImages = selectedVariant?.gallery?.length > 0
        ? selectedVariant.gallery
        : selectedVariant?.image
            ? [selectedVariant.image]
            : [];

    const displayImages = variantImages.length > 0
        ? variantImages
        : productImages;

    const currentImage = displayImages[currentIndex] || displayImages[0];

    const mobileSliderRef = useRef<HTMLDivElement>(null);
    const desktopSliderRef = useRef<HTMLDivElement>(null);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const scrollLeft = e.currentTarget.scrollLeft;
        const width = e.currentTarget.clientWidth;
        if (width > 0) {
            const index = Math.round(scrollLeft / width);
            if (currentIndex !== index) {
                setCurrentIndex(index);
            }
        }
    };

    const scrollTo = (index: number) => {
        const newIndex = index < 0 ? displayImages.length - 1 : index >= displayImages.length ? 0 : index;

        if (mobileSliderRef.current) {
            mobileSliderRef.current.scrollTo({
                left: mobileSliderRef.current.clientWidth * newIndex,
                behavior: "smooth",
            });
        }

        if (desktopSliderRef.current) {
            desktopSliderRef.current.scrollTo({
                left: desktopSliderRef.current.clientWidth * newIndex,
                behavior: "smooth",
            });
        }

        setCurrentIndex(newIndex);
    };

    const nextImage = () => scrollTo(currentIndex + 1);

    const prevImage = () => scrollTo(currentIndex - 1);

    const { openCart } = useCartUI();

    const handleAddToCart = async () => {
        if (!selectedVariant?.id) return;

        await addToCart(selectedVariant.id);

        openCart();
    };

    useEffect(() => {
        setCurrentIndex(0);
        if (mobileSliderRef.current) {
            mobileSliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
        }
        if (desktopSliderRef.current) {
            desktopSliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
        }
    }, [selectedVariantId]);

    useEffect(() => {
        if (!product?.id) return;

        addRecentlyViewedProduct({
            id: product.id,
            name: product.name,
            slug: product.slug,
            image: currentImage || product.image,
            price: displayedPrice,
        });
    }, [product, displayedPrice, currentImage]);

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: `
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}} />
            {isSizeGuideOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 cursor-pointer backdrop-blur-[1px]"
                    onClick={() => setIsSizeGuideOpen(false)}
                >
                    <div
                        className="bg-white max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8 relative cursor-default shadow-sm"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setIsSizeGuideOpen(false)}
                            className="absolute top-5 right-5 p-2 hover:bg-neutral-50 cursor-pointer text-[#1a1a1a]"
                            aria-label="Close size guide"
                        >
                            <X className="w-[18px] h-[18px]" />
                        </button>

                        <h2 className="text-lg text-[#1a1a1a] font-Inter18SemiBold mb-6 uppercase tracking-wider">
                            Size Guide
                        </h2>

                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-[#1a1a1a]">
                                <thead>
                                <tr className="border-b border-neutral-200">
                                    <th className="text-left py-3 px-2 font-Inter18SemiBold uppercase tracking-wider">Size</th>
                                    <th className="text-left py-3 px-2 font-Inter18SemiBold uppercase tracking-wider">Chest (cm)</th>
                                    <th className="text-left py-3 px-2 font-Inter18SemiBold uppercase tracking-wider">Length (cm)</th>
                                    <th className="text-left py-3 px-2 font-Inter18SemiBold uppercase tracking-wider">Shoulder (cm)</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr className="border-b border-neutral-100 text-neutral-600">
                                    <td className="py-3 px-2 font-Inter18SemiBold text-[#1a1a1a]">XS</td>
                                    <td className="py-3 px-2">91-96</td>
                                    <td className="py-3 px-2">69</td>
                                    <td className="py-3 px-2">42</td>
                                </tr>
                                <tr className="border-b border-neutral-100 text-neutral-600">
                                    <td className="py-3 px-2 font-Inter18SemiBold text-[#1a1a1a]">S</td>
                                    <td className="py-3 px-2">96-101</td>
                                    <td className="py-3 px-2">71</td>
                                    <td className="py-3 px-2">44</td>
                                </tr>
                                <tr className="border-b border-neutral-100 text-neutral-600">
                                    <td className="py-3 px-2 font-Inter18SemiBold text-[#1a1a1a]">M</td>
                                    <td className="py-3 px-2">101-106</td>
                                    <td className="py-3 px-2">73</td>
                                    <td className="py-3 px-2">46</td>
                                </tr>
                                <tr className="border-b border-neutral-100 text-neutral-600">
                                    <td className="py-3 px-2 font-Inter18SemiBold text-[#1a1a1a]">L</td>
                                    <td className="py-3 px-2">106-111</td>
                                    <td className="py-3 px-2">75</td>
                                    <td className="py-3 px-2">48</td>
                                </tr>
                                <tr className="border-b border-neutral-100 text-neutral-600">
                                    <td className="py-3 px-2 font-Inter18SemiBold text-[#1a1a1a]">XL</td>
                                    <td className="py-3 px-2">111-116</td>
                                    <td className="py-3 px-2">77</td>
                                    <td className="py-3 px-2">50</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>

                        <p className="mt-6 text-[11px] text-neutral-400 font-Inter">
                            All measurements are approximate and may vary by up to 2cm.
                        </p>
                    </div>
                </div>
            )}

            <section className="w-full bg-white">
                <div className="lg:hidden">
                    <div className="relative w-full aspect-[3/4] bg-white cursor-pointer">
                        <div
                            ref={mobileSliderRef}
                            className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide"
                            onScroll={handleScroll}
                            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                        >
                            {displayImages.map((img: string, i: number) => (
                                <div key={i} className="min-w-full h-full flex-shrink-0 snap-center flex items-center justify-center">
                                    <img
                                        src={img}
                                        alt={`${product.name} view ${i + 1}`}
                                        className="w-full h-full object-contain p-4"
                                    />
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/90 hover:bg-white transition-colors cursor-pointer"
                            aria-label="Previous image"
                        >
                            <ChevronLeft className="w-5 h-5 text-[#1a1a1a]" />
                        </button>

                        <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/90 hover:bg-white transition-colors cursor-pointer"
                            aria-label="Next image"
                        >
                            <ChevronRight className="w-5 h-5 text-[#1a1a1a]" />
                        </button>

                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                            {displayImages.map((_: any, i: number) => (
                                <button
                                    key={i}
                                    onClick={() => scrollTo(i)}
                                    className={`w-1.5 h-1.5 rounded-full transition-colors cursor-pointer ${
                                        currentIndex === i ? "bg-[#1a1a1a]" : "bg-neutral-300"
                                    }`}
                                    aria-label={`Go to image ${i + 1}`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="px-4 py-8 bg-white flex flex-col items-center text-center">
                        <h1 className="text-4xl font-Inter mb-1 uppercase tracking-widest text-[#1a1a1a]">
                            {product.name}
                        </h1>

                        <p className="text-sm font-Inter mb-6 uppercase tracking-wider text-[#1a1a1a]">
                            {getVariantLabel(selectedVariant)}
                        </p>

                        <p className="text-2xl font-InterLight mb-8 text-[#6A6A6A] tracking-wide">
                            {displayedPrice.toFixed(2).replace(".", ",")} lei
                        </p>

                        {variants.length > 0 && (
                            <div className="mb-6 w-full border-b border-[#e5e5e5] pb-6">
                                <label className="text-[11px] font-Inter mb-3 block text-neutral-700 uppercase tracking-wide text-left">
                                    Variantă -{" "}
                                    <span className="text-neutral-400 font-InterLight">
                                        Alegeți varianta
                                    </span>
                                </label>

                                <div className="grid grid-cols-4 gap-2">
                                    {variants.map((variant: any) => (
                                        <button
                                            key={variant.id}
                                            onClick={() => setSelectedVariantId(variant.id)}
                                            className={`h-[40px] text-[11px] border tracking-wider transition-colors cursor-pointer flex items-center justify-center uppercase ${
                                                selectedVariantId === variant.id
                                                    ? "border-[#1a1a1a] text-[#1a1a1a] font-Inter18SemiBold bg-white"
                                                    : "border-[#e5e5e5] bg-white text-neutral-300 font-Inter hover:border-neutral-400 hover:text-neutral-500"
                                            }`}
                                        >
                                            {getVariantLabel(variant)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-[#1a1a1a] text-white py-3.5 text-xs font-Inter18SemiBold uppercase tracking-[0.15em] mb-6 hover:bg-black transition-colors cursor-pointer"
                        >
                            ADAUGĂ ÎN COȘ
                        </button>

                        <div className="border-t border-[#e5e5e5] w-full text-left">
                            <button
                                onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
                                className="w-full flex items-center justify-between py-4 text-xs font-Inter uppercase border-b border-[#e5e5e5] text-[#1a1a1a] tracking-wider cursor-pointer"
                            >
                                DESCRIERE
                                {isDescriptionOpen ? (
                                    <span className="text-lg font-InterLight text-neutral-400 leading-none">−</span>
                                ) : (
                                    <span className="text-lg font-InterLight text-neutral-400 leading-none">+</span>
                                )}
                            </button>

                            {isDescriptionOpen && (
                                <div className="py-4 text-xs text-neutral-500 leading-relaxed border-b border-[#e5e5e5] space-y-4 font-Inter">
                                    <div dangerouslySetInnerHTML={{ __html: product.description }} />
                                </div>
                            )}

                            <button
                                onClick={() => setIsCompositionOpen(!isCompositionOpen)}
                                className="w-full flex items-center justify-between py-4 text-xs font-Inter uppercase border-b border-[#e5e5e5] text-[#1a1a1a] tracking-wider cursor-pointer"
                            >
                                PRODUCT CARE INSTRUCTIONS
                                {isCompositionOpen ? (
                                    <span className="text-lg font-InterLight text-neutral-400 leading-none">−</span>
                                ) : (
                                    <span className="text-lg font-InterLight text-neutral-400 leading-none">+</span>
                                )}
                            </button>

                            {isCompositionOpen && (
                                <div className="py-4 text-xs font-InterLight text-neutral-500 leading-relaxed border-b border-[#e5e5e5]">
                                    <p className="mb-4">
                                        Pentru a pastra performanta si durabilitatea echipamentului Beast Locker:
                                    </p>

                                    <ul className="list-disc list-inside space-y-2 text-neutral-400 mb-4">
                                        <li>Curatati dupa fiecare utilizare</li>
                                        <li>Lasati produsul sa se usuce natural</li>
                                        <li>Nu spalati la masina</li>
                                        <li>Evitati contactul direct cu surse de caldura</li>
                                        <li>Nu lasati produsul umed in geanta de antrenament</li>
                                        <li>Depozitati intr-un loc uscat si aerisit</li>
                                    </ul>

                                    <p>
                                        Echipamentul bine intretinut rezista mai mult, la fel ca luptatorul care il poarta.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="hidden lg:flex lg:max-w-[1750px] lg:mx-auto lg:px-16 lg:py-20 lg:gap-36 bg-white justify-center items-start">
                    <div className="flex gap-14 items-start select-none">
                        <div className="flex flex-col gap-4">
                            {displayImages.map((img: string, i: number) => (
                                <button
                                    key={i}
                                    onClick={() => scrollTo(i)}
                                    className={`w-[84px] h-[112px] border overflow-hidden transition-colors bg-white cursor-pointer ${
                                        currentIndex === i ? "border-[#1a1a1a]" : "border-[#e5e5e5] hover:border-neutral-400"
                                    }`}
                                >
                                    <img
                                        src={img}
                                        alt={`${product.name} view ${i + 1}`}
                                        className="w-full h-full object-contain p-1"
                                    />
                                </button>
                            ))}
                        </div>

                        <div className="relative bg-white overflow-hidden w-[760px] h-[950px] flex items-center justify-center">
                            <div
                                ref={desktopSliderRef}
                                className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide"
                                onScroll={handleScroll}
                                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                            >
                                {displayImages.map((img: string, i: number) => (
                                    <div key={i} className="min-w-full h-full flex-shrink-0 snap-center flex items-center justify-center">
                                        <img
                                            src={img}
                                            alt={`${product.name} view ${i + 1}`}
                                            className="w-full h-full object-contain p-6 transition-all"
                                        />
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={prevImage}
                                className="absolute left-5 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-white/80 hover:bg-white shadow-sm transition-colors cursor-pointer"
                                aria-label="Previous image"
                            >
                                <ChevronLeft className="w-6 h-6 text-[#1a1a1a]" />
                            </button>

                            <button
                                onClick={nextImage}
                                className="absolute right-5 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-white/80 hover:bg-white shadow-sm transition-colors cursor-pointer"
                                aria-label="Next image"
                            >
                                <ChevronRight className="w-6 h-6 text-[#1a1a1a]" />
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col w-[460px] bg-white pt-2">
                        <h1 className="text-3xl font-Inter mb-3 uppercase tracking-wider text-[#1a1a1a] leading-tight">
                            {product.name}
                        </h1>

                        <p className="text-2xl font-Inter mb-8 text-[#1a1a1a]">
                            {displayedPrice.toFixed(2)} lei
                        </p>

                        {variants.length > 0 && (
                            <div className="mb-6 border-b border-[#e5e5e5] pb-6">
                                <label className="text-[11px] font-Inter mb-3 block text-neutral-700 uppercase tracking-wide">
                                    Variantă - <span className="text-neutral-400 font-InterLight">Alegeți varianta</span>
                                </label>

                                <div className="grid grid-cols-5 gap-1.5 mb-3.5">
                                    {variants.map((variant: any) => (
                                        <button
                                            key={variant.id}
                                            onClick={() => setSelectedVariantId(variant.id)}
                                            className={`h-[40px] text-[11px] border tracking-wider transition-colors cursor-pointer flex items-center justify-center ${
                                                selectedVariantId === variant.id
                                                    ? "border-[#1a1a1a] text-[#1a1a1a] font-Inter18SemiBold bg-white"
                                                    : "border-[#e5e5e5] bg-white text-neutral-300 font-Inter hover:border-neutral-400 hover:text-neutral-500"
                                            }`}
                                        >
                                            {getVariantLabel(variant)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-[#1a1a1a] text-white py-4.5 text-sm font-Inter18SemiBold uppercase tracking-[0.18em] mb-8 hover:bg-black transition-colors cursor-pointer flex items-center justify-center"
                        >
                            ADAUGĂ ÎN COȘ
                        </button>

                        <div className="border-t border-[#e5e5e5]">
                            <button
                                onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
                                className="w-full flex items-center justify-between py-4.5 text-xs font-Inter uppercase border-b border-[#e5e5e5] text-[#1a1a1a] tracking-wider cursor-pointer"
                            >
                                DESCRIERE
                                {isDescriptionOpen ? (
                                    <span className="text-base font-InterLight text-neutral-400 leading-none">−</span>
                                ) : (
                                    <span className="text-base font-InterLight text-neutral-400 leading-none">+</span>
                                )}
                            </button>

                            {isDescriptionOpen && (
                                <div className="py-4.5 text-xs text-neutral-500 leading-relaxed border-b border-[#e5e5e5] space-y-4 font-Inter">
                                    <div dangerouslySetInnerHTML={{ __html: product.description }} />
                                </div>
                            )}

                            <div className="border-t border-[#e5e5e5]">
                                <button
                                    onClick={() => setIsCompositionOpen(!isCompositionOpen)}
                                    className="w-full flex items-center justify-between py-4.5 text-xs font-Inter18SemiBold uppercase border-b border-[#e5e5e5] text-[#1a1a1a] tracking-wider cursor-pointer"
                                >
                                    PRODUCT CARE INSTRUCTIONS
                                    {isCompositionOpen ? (
                                        <span className="text-base font-InterLight text-neutral-400 leading-none">−</span>
                                    ) : (
                                        <span className="text-base font-InterLight text-neutral-400 leading-none">+</span>
                                    )}
                                </button>

                                {isCompositionOpen && (
                                    <div className="py-4.5 text-xs font-InterLight text-neutral-500 leading-relaxed border-b border-[#e5e5e5]">
                                        <p className="mb-4">
                                            Pentru a pastra performanta si durabilitatea echipamentului Beast Locker:
                                        </p>

                                        <ul className="list-disc list-inside space-y-2 text-neutral-400 mb-4">
                                            <li>Curatati dupa fiecare utilizare</li>
                                            <li>Lasati produsul sa se usuce natural</li>
                                            <li>Nu spalati la masina</li>
                                            <li>Evitati contactul direct cu surse de caldura</li>
                                            <li>Nu lasati produsul umed in geanta de antrenament</li>
                                            <li>Depozitati intr-un loc uscat si aerisit</li>
                                        </ul>

                                        <p>
                                            Echipamentul bine intretinut rezista mai mult, la fel ca luptatorul care il poarta.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}