"use client";

import { useEffect, useState } from "react";
import {
    getActiveOrder,
    adjustOrderLine,
    removeOrderLine,
} from "@/lib/api/cart";

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

export default function CartDrawer({ isOpen, onClose }: Props) {
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [updatingLine, setUpdatingLine] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            load();
        }
    }, [isOpen]);

    const load = async () => {
        setLoading(true);
        try {
            const data = await getActiveOrder();
            setOrder(data);
        } catch (err) {
            console.error("Failed to load cart:", err);
        } finally {
            setLoading(false);
        }
    };

    const increase = async (lineId: string, qty: number) => {
        setUpdatingLine(lineId);
        await adjustOrderLine(lineId, qty + 1);
        await load();
        setUpdatingLine(null);
    };

    const decrease = async (lineId: string, qty: number) => {
        if (qty <= 1) return;
        setUpdatingLine(lineId);
        await adjustOrderLine(lineId, qty - 1);
        await load();
        setUpdatingLine(null);
    };

    const remove = async (lineId: string) => {
        setUpdatingLine(lineId);
        await removeOrderLine(lineId);
        await load();
        setUpdatingLine(null);
    };

    return (
        <>
            <div
                onClick={onClose}
                className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-all duration-500 ease-in-out cursor-pointer ${
                    isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
            />

            <div
                className={`fixed text-[#6a6a6a] font-Inter right-0 top-0 h-full w-[85%] sm:w-[450px] bg-white z-50 flex flex-col shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-[13px] text-[#1c1c1e] font-Inter tracking-widest uppercase">
                        COȘ DE CUMPĂRĂTURI
                        {!loading && order?.lines?.length > 0 && (
                            <span className="ml-2 text-gray-400 font-normal">
                                ({order.lines.reduce((acc: number, line: any) => acc + line.quantity, 0)})
                            </span>
                        )}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-gray-500 hover:text-black transition-colors duration-300 hover:rotate-90 cursor-pointer"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 scrollbar-hide">
                    {loading && !order ? (
                        <div className="h-full flex flex-col items-center justify-center space-y-4 text-gray-400">
                            <svg className="w-6 h-6 animate-spin text-black" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="text-xs uppercase tracking-wider font-Inter">Se încarcă...</p>
                        </div>
                    ) : (!order || order.lines.length === 0) ? (
                        <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
                            <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-Inter">Coșul tău este gol</p>
                            <button onClick={onClose} className="mt-4 text-xs font-medium border-b border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors duration-300 cursor-pointer font-Inter">
                                CONTINUĂ CUMPĂRĂTURILE
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {order.lines.map((line: any, index: number) => (
                                <div
                                    key={line.id}
                                    className={`flex gap-6 py-6 border-b border-gray-200 group transition-opacity duration-300 ${updatingLine === line.id ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}
                                    style={{ animation: `fadeInUp 0.4s ease-out ${index * 0.1}s both` }}
                                >
                                    <div className="relative w-28 shrink-0 bg-transparent">
                                        {line.featuredAsset?.preview ? (
                                            <img
                                                src={line.featuredAsset.preview}
                                                alt={line.productVariant.name}
                                                className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full aspect-[3/4] bg-gray-100" />
                                        )}
                                    </div>

                                    <div className="flex-1 flex flex-col justify-start">
                                        <h3 className="text-[13px] text-[#1c1c1e] font-normal font-Inter tracking-wide uppercase leading-snug">
                                            {line.productVariant.name}
                                        </h3>

                                        <p className="text-[13px] text-[#1c1c1e] font-Inter mt-4 mb-5">
                                            {(line.productVariant.priceWithTax / 100).toFixed(2).replace(".", ",")} lei
                                        </p>

                                        <div className="flex items-center justify-between mt-auto">
                                            <div className="flex items-center border border-gray-300">
                                                <button
                                                    onClick={() => decrease(line.id, line.quantity)}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                                                    disabled={line.quantity <= 1}
                                                >
                                                    <span className="text-lg leading-none -mt-0.5">–</span>
                                                </button>
                                                <span className="w-8 text-center text-[13px] text-[#1c1c1e] font-normal font-Inter">
                                                    {line.quantity}
                                                </span>
                                                <button
                                                    onClick={() => increase(line.id, line.quantity)}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                                                >
                                                    <span className="text-lg leading-none -mt-0.5">+</span>
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => remove(line.id)}
                                                className="text-[11px] text-gray-500 font-Inter hover:text-[#1c1c1e] underline decoration-gray-400 hover:decoration-[#1c1c1e] underline-offset-4 transition-colors duration-200 cursor-pointer"
                                            >
                                                Șterge
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {!loading && order?.lines?.length > 0 && (
                    <div className="border-t border-gray-200 p-6 bg-white font-Inter">
                        <p className="text-[12px] text-center text-[#737373] mb-5 tracking-wide">
                            Transportul și taxele sunt calculate la Checkout
                        </p>
                        <button className="w-full bg-[#1c1c1e] text-white py-[18px] text-[12px] font-medium uppercase tracking-[0.15em] hover:bg-black transition-colors duration-300 cursor-pointer">
                            CHECKOUT // {((order?.totalWithTax || 0) / 100).toFixed(2).replace(".", ",")}lei
                        </button>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </>
    );
}