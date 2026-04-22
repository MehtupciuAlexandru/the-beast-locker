"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { addToCart } from "@/lib/api/cart";
import { useCartUI } from "@/lib/context/CartUIContext";

type Props = {
    product: any;
};

export default function ProductDetails({ product }: Props) {
    const images = product.gallery.length > 0
        ? product.gallery
        : [product.image];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedSize, setSelectedSize] = useState("S");
    const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
    const [isCompositionOpen, setIsCompositionOpen] = useState(false);
    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

    const currentImage = images[currentIndex];

    // Touch swipe handling
    const touchStartX = useRef<number>(0);
    const touchEndX = useRef<number>(0);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (touchStartX.current - touchEndX.current > 50) {
            // Swiped left
            nextImage();
        }

        if (touchStartX.current - touchEndX.current < -50) {
            // Swiped right
            prevImage();
        }
    };

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? images.length - 1 : prev - 1
        );
    };

    const sizes = ["S", "M", "L", "XL"];
    const colors = [
        { name: "Abascus Black", value: "#000000" },
        { name: "Navy Blue", value: "#1e3a5f" },
        { name: "Gray", value: "#808080" },
    ];
    const [selectedColor, setSelectedColor] = useState(colors[0].name);

    const { openCart } = useCartUI();

    const handleAddToCart = async () => {
        if (!product.variantId) return;

        await addToCart(product.variantId);

        openCart();
    };

    return (
        <>
            {/* Size Guide Modal */}
            {isSizeGuideOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 cursor-pointer"
                    onClick={() => setIsSizeGuideOpen(false)}
                >
                    <div
                        className="bg-white max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 relative cursor-default"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setIsSizeGuideOpen(false)}
                            className="absolute top-4 right-4 p-2 hover:bg-gray-100 cursor-pointer"
                            aria-label="Close size guide"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h2 className="text-xl text-gray-950 font-medium mb-6 uppercase">Size Guide</h2>

                        <div className="overflow-x-auto ">
                            <table className="w-full text-sm ">
                                <thead>
                                <tr className="border-b border-gray-300 ">
                                    <th className="text-left py-3 px-2">Size</th>
                                    <th className="text-left py-3 px-2">Chest (cm)</th>
                                    <th className="text-left py-3 px-2">Length (cm)</th>
                                    <th className="text-left py-3 px-2">Shoulder (cm)</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr className="border-b border-gray-200">
                                    <td className="py-3 px-2 font-medium">S</td>
                                    <td className="py-3 px-2">96-101</td>
                                    <td className="py-3 px-2">71</td>
                                    <td className="py-3 px-2">44</td>
                                </tr>
                                <tr className="border-b border-gray-200">
                                    <td className="py-3 px-2 font-medium">M</td>
                                    <td className="py-3 px-2">101-106</td>
                                    <td className="py-3 px-2">73</td>
                                    <td className="py-3 px-2">46</td>
                                </tr>
                                <tr className="border-b border-gray-200">
                                    <td className="py-3 px-2 font-medium">L</td>
                                    <td className="py-3 px-2">106-111</td>
                                    <td className="py-3 px-2">75</td>
                                    <td className="py-3 px-2">48</td>
                                </tr>
                                <tr className="border-b border-gray-200 ">
                                    <td className="py-3 px-2 font-medium">XL</td>
                                    <td className="py-3 px-2">111-116</td>
                                    <td className="py-3 px-2">77</td>
                                    <td className="py-3 px-2">50</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>

                        <p className="mt-6 text-xs text-black">
                            All measurements are approximate and may vary by up to 2cm.
                        </p>
                    </div>
                </div>
            )}

            <section className="w-full bg-white mt-8 lg:mt-12">

                {/* Mobile Layout */}
                <div className="lg:hidden">

                    {/* Mobile Image Carousel */}
                    <div
                        className="relative w-full aspect-[3/4] bg-white cursor-pointer"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <img
                            src={currentImage}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />

                        {/* Navigation Arrows */}
                        <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/90 hover:bg-white transition-colors cursor-pointer"
                            aria-label="Previous image"
                        >
                            <ChevronLeft className="w-5 h-5 text-black" />
                        </button>

                        <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/90 hover:bg-white transition-colors cursor-pointer"
                            aria-label="Next image"
                        >
                            <ChevronRight className="w-5 h-5 text-black" />
                        </button>

                        {/* Image Indicators */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                            {images.map((_: any, i: number) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentIndex(i)}
                                    className={`w-1.5 h-1.5 rounded-full transition-colors cursor-pointer ${
                                        currentIndex === i ? "bg-black" : "bg-gray-400"
                                    }`}
                                    aria-label={`Go to image ${i + 1}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Mobile Product Info */}
                    <div className="px-4 py-6 bg-white">

                        {/* SKU */}
                        <p className="text-xs text-gray-500 mb-2">050225</p>

                        {/* Product Name */}
                        <h1 className="text-lg font-medium mb-1 uppercase tracking-wide text-black">
                            {product.name}
                        </h1>

                        {/* Color Name */}
                        <p className="text-xs text-gray-600 mb-3 uppercase">
                            {selectedColor}
                        </p>

                        {/* Price */}
                        <p className="text-lg font-medium mb-6 text-black">
                            {product.price.toFixed(2)} RON
                        </p>

                        {/* Color Selection */}
                        <div className="mb-6">
                            <label className="text-xs font-medium mb-3 block text-black">
                                Culoare - {selectedColor}
                            </label>
                            <div className="flex gap-2">
                                {colors.map((color) => (
                                    <button
                                        key={color.name}
                                        onClick={() => setSelectedColor(color.name)}
                                        className={`w-14 h-14 border-2 transition-colors cursor-pointer ${
                                            selectedColor === color.name
                                                ? "border-black"
                                                : "border-gray-300"
                                        } bg-white`}
                                        aria-label={color.name}
                                    >
                                        <div className="w-full h-full p-1">
                                            <div
                                                className="w-full h-full"
                                                style={{ backgroundColor: color.value }}
                                            />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Size Selection */}
                        <div className="mb-6">
                            <label className="text-xs font-medium mb-3 block text-black">
                                Mărime - Alege mărimea
                            </label>
                            <div className="flex gap-2 mb-2">
                                {sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`flex-1 py-2.5 text-sm border transition-colors cursor-pointer ${
                                            selectedSize === size
                                                ? "border-black bg-black text-white"
                                                : "border-gray-300 bg-white text-black hover:border-black"
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setIsSizeGuideOpen(true)}
                                className="text-xs underline text-black hover:no-underline cursor-pointer"
                            >
                                SIZE GUIDE
                            </button>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-black text-white py-4 text-sm font-medium uppercase tracking-wider mb-6 hover:bg-gray-800 transition-colors cursor-pointer"
                        >
                            ADAUGĂ ÎN COȘ
                        </button>

                        {/* Expandable Sections */}
                        <div className="border-t border-gray-300">

                            {/* Description */}
                            <button
                                onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
                                className="w-full flex items-center justify-between py-4 text-sm font-medium uppercase border-b border-gray-300 text-black cursor-pointer"
                            >
                                DESCRIERE
                                {isDescriptionOpen ? (
                                    <X className="w-4 h-4 text-black" />
                                ) : (
                                    <Plus className="w-4 h-4 text-black" />
                                )}
                            </button>
                            {isDescriptionOpen && (
                                <div className="py-4 text-sm text-gray-700 border-b border-gray-300">
                                    <div dangerouslySetInnerHTML={{ __html: product.description }} />
                                    <p className="mt-4 text-xs text-gray-500">
                                        Model is 5'11 (180cm) wearing a size M
                                    </p>
                                </div>
                            )}

                            {/* Composition & Care */}
                            <button
                                onClick={() => setIsCompositionOpen(!isCompositionOpen)}
                                className="w-full flex items-center justify-between py-4 text-sm font-medium uppercase border-b border-gray-300 text-black cursor-pointer"
                            >
                                COMPOZIȚIE ȘI ÎNTREȚINERE
                                {isCompositionOpen ? (
                                    <X className="w-4 h-4 text-black" />
                                ) : (
                                    <Plus className="w-4 h-4 text-black" />
                                )}
                            </button>
                            {isCompositionOpen && (
                                <div className="py-4 text-sm text-gray-700 border-b border-gray-300">
                                    <p className="mb-2"><strong>Composition:</strong></p>
                                    <p className="mb-4">100% Premium Cotton</p>
                                    <p className="mb-2"><strong>Care Instructions:</strong></p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Machine wash cold</li>
                                        <li>Do not bleach</li>
                                        <li>Tumble dry low</li>
                                        <li>Iron on low heat</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden lg:flex lg:px-20 lg:py-10 lg:gap-12 bg-white">

                    {/* LEFT - Images */}
                    <div className="flex gap-4">

                        {/* Thumbnails */}
                        <div className="flex flex-col gap-3">
                            {images.map((img: string, i: number) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentIndex(i)}
                                    className={`w-16 h-20 border-2 overflow-hidden transition-colors bg-white cursor-pointer ${
                                        currentIndex === i ? "border-black" : "border-gray-300"
                                    }`}
                                >
                                    <img
                                        src={img}
                                        alt={`${product.name} view ${i + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>

                        {/* Main Image */}
                        <div className="relative bg-white">
                            <img
                                src={currentImage}
                                alt={product.name}
                                className="w-[500px] h-[650px] object-cover"
                            />

                            {/* Navigation Arrows */}
                            <button
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-white shadow-md transition-colors cursor-pointer"
                                aria-label="Previous image"
                            >
                                <ChevronLeft className="w-6 h-6 text-black" />
                            </button>

                            <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-white shadow-md transition-colors cursor-pointer"
                                aria-label="Next image"
                            >
                                <ChevronRight className="w-6 h-6 text-black" />
                            </button>
                        </div>
                    </div>

                    {/* RIGHT - Product Info */}
                    <div className="flex flex-col max-w-md bg-white">

                        {/* SKU */}
                        <p className="text-xs text-gray-500 mb-3">050225</p>

                        {/* Product Name */}
                        <h1 className="text-xl font-medium mb-2 uppercase tracking-wide text-black">
                            {product.name}
                        </h1>

                        {/* Color Name */}
                        <p className="text-sm text-gray-600 mb-4 uppercase">
                            {selectedColor}
                        </p>

                        {/* Price */}
                        <p className="text-2xl font-medium mb-8 text-black">
                            {product.price.toFixed(2)} RON
                        </p>

                        {/* Color Selection */}
                        <div className="mb-6">
                            <label className="text-xs font-medium mb-3 block text-black">
                                Culoare - {selectedColor}
                            </label>
                            <div className="flex gap-3">
                                {colors.map((color) => (
                                    <button
                                        key={color.name}
                                        onClick={() => setSelectedColor(color.name)}
                                        className={`w-16 h-16 border-2 transition-colors cursor-pointer ${
                                            selectedColor === color.name
                                                ? "border-black"
                                                : "border-gray-300"
                                        } bg-white`}
                                        aria-label={color.name}
                                    >
                                        <div className="w-full h-full p-1.5">
                                            <div
                                                className="w-full h-full"
                                                style={{ backgroundColor: color.value }}
                                            />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Size Selection */}
                        <div className="mb-6">
                            <label className="text-xs font-medium mb-3 block text-black">
                                Mărime - Alege mărimea
                            </label>
                            <div className="flex gap-2 mb-3">
                                {sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`w-16 h-12 text-sm border transition-colors cursor-pointer ${
                                            selectedSize === size
                                                ? "border-black bg-black text-white"
                                                : "border-gray-300 bg-white text-black hover:border-black"
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setIsSizeGuideOpen(true)}
                                className="text-xs underline hover:no-underline text-black cursor-pointer"
                            >
                                SIZE GUIDE
                            </button>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-black text-white py-4 text-sm font-medium uppercase tracking-wider mb-8 hover:bg-gray-800 transition-colors cursor-pointer"
                        >
                            ADAUGĂ ÎN COȘ
                        </button>

                        {/* Expandable Sections */}
                        <div className="border-t border-gray-300">

                            {/* Description */}
                            <button
                                onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
                                className="w-full flex items-center justify-between py-5 text-sm font-medium uppercase text-black cursor-pointer"
                            >
                                DESCRIERE
                                {isDescriptionOpen ? (
                                    <X className="w-5 h-5 text-black" />
                                ) : (
                                    <Plus className="w-5 h-5 text-black" />
                                )}
                            </button>
                            {isDescriptionOpen && (
                                <div className="pb-6 text-sm text-gray-700 leading-relaxed border-b border-gray-300">
                                    <div dangerouslySetInnerHTML={{ __html: product.description }} />
                                    <p className="mt-6 text-xs text-gray-500">
                                        Model is 5'11 (180cm) wearing a size M
                                    </p>
                                </div>
                            )}

                            {/* Composition & Care */}
                            <div className="border-t border-gray-300">
                                <button
                                    onClick={() => setIsCompositionOpen(!isCompositionOpen)}
                                    className="w-full flex items-center justify-between py-5 text-sm font-medium uppercase text-black cursor-pointer"
                                >
                                    COMPOZIȚIE ȘI ÎNTREȚINERE
                                    {isCompositionOpen ? (
                                        <X className="w-5 h-5 text-black" />
                                    ) : (
                                        <Plus className="w-5 h-5 text-black" />
                                    )}
                                </button>
                                {isCompositionOpen && (
                                    <div className="pb-6 text-sm text-gray-700 leading-relaxed">
                                        <p className="mb-2"><strong>Composition:</strong></p>
                                        <p className="mb-4">100% Premium Cotton</p>
                                        <p className="mb-2"><strong>Care Instructions:</strong></p>
                                        <ul className="list-disc list-inside space-y-1">
                                            <li>Machine wash cold</li>
                                            <li>Do not bleach</li>
                                            <li>Tumble dry low</li>
                                            <li>Iron on low heat</li>
                                        </ul>
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