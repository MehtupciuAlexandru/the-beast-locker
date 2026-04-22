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
            {/* Overlay */}
            <div
                onClick={onClose}
                className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-all duration-500 ease-in-out cursor-pointer ${
                    isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
            />

            {/* Drawer */}
            <div
                className={`fixed text-black right-0 top-0 h-full w-[75%] sm:w-[350px] sm:w-[400px] bg-white z-50 flex flex-col shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-sm font-bold tracking-widest uppercase">
                        Coșul Tău
                        {!loading && order?.lines?.length > 0 && (
                            <span className="ml-2 text-gray-400 font-normal">
                                ({order.lines.reduce((acc: number, line: any) => acc + line.quantity, 0)})
                            </span>
                        )}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-gray-400 hover:text-black transition-colors duration-300 hover:rotate-90 cursor-pointer"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                    {loading && !order ? (
                        <div className="h-full flex flex-col items-center justify-center space-y-4 text-gray-400">
                            <svg className="w-6 h-6 animate-spin text-black" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="text-xs uppercase tracking-wider">Se încarcă...</p>
                        </div>
                    ) : (!order || order.lines.length === 0) ? (
                        <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
                            <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <p className="text-sm text-gray-500 uppercase tracking-widest">Coșul este gol</p>
                            <button onClick={onClose} className="mt-4 text-xs font-medium border-b border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors duration-300 cursor-pointer">
                                CONTINUĂ CUMPĂRĂTURILE
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {order.lines.map((line: any, index: number) => (
                                <div
                                    key={line.id}
                                    className={`flex gap-5 group transition-opacity duration-300 ${updatingLine === line.id ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}
                                    style={{ animation: `fadeInUp 0.4s ease-out ${index * 0.1}s both` }}
                                >
                                    <div className="relative w-24 h-24 bg-gray-50 overflow-hidden shrink-0 border border-gray-100">
                                        {line.featuredAsset?.preview ? (
                                            <img
                                                src={line.featuredAsset.preview}
                                                alt={line.productVariant.name}
                                                className="w-full h-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-100" />
                                        )}
                                    </div>

                                    <div className="flex-1 flex flex-col justify-between py-1">
                                        <div>
                                            <div className="flex justify-between items-start gap-2">
                                                <h3 className="text-xs font-medium uppercase tracking-wide leading-relaxed line-clamp-2">
                                                    {line.productVariant.name}
                                                </h3>
                                                <button
                                                    onClick={() => remove(line.id)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors duration-200 mt-0.5 cursor-pointer"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {(line.productVariant.priceWithTax / 100).toFixed(2)} RON
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex items-center border border-gray-200">
                                                <button
                                                    onClick={() => decrease(line.id, line.quantity)}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-black hover:text-white hover:border-black transition-colors duration-200 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                                                    disabled={line.quantity <= 1}
                                                >
                                                    <span className="text-lg leading-none -mt-0.5">-</span>
                                                </button>
                                                <span className="w-8 text-center text-xs font-medium">
                                                    {line.quantity}
                                                </span>
                                                <button
                                                    onClick={() => increase(line.id, line.quantity)}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-black hover:text-white hover:border-black transition-colors duration-200 cursor-pointer"
                                                >
                                                    <span className="text-lg leading-none -mt-0.5">+</span>
                                                </button>
                                            </div>

                                            <p className="text-sm font-semibold">
                                                {((line.productVariant.priceWithTax * line.quantity) / 100).toFixed(2)} RON
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {!loading && order?.lines?.length > 0 && (
                    <div className="border-t border-gray-100 p-6 bg-white">
                        <div className="flex justify-between items-end mb-6">
                            <span className="text-sm text-gray-500 uppercase tracking-widest">Total Estimativ</span>
                            <span className="text-xl font-bold">
                                {((order?.totalWithTax || 0) / 100).toFixed(2)} RON
                            </span>
                        </div>

                        <button className="relative w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-widest overflow-hidden group cursor-pointer">
                            <span className="relative z-10 flex items-center justify-center gap-2 transition-transform duration-300 group-hover:-translate-y-10">
                                FINALIZAȚI COMANDA
                            </span>
                            <span className="absolute inset-0 z-10 flex items-center justify-center gap-2 translate-y-10 transition-transform duration-300 group-hover:translate-y-0">
                                SPRE CHECKOUT
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </span>
                        </button>
                        <p className="text-[10px] text-center text-gray-400 mt-4 uppercase tracking-wider">
                            Taxele și transportul sunt calculate la checkout
                        </p>
                    </div>
                )}
            </div>

            {/* Required for the stagger animation without tailwind config changes */}
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