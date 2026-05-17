"use client";

import { useState } from "react";

type SortOption =
    | "featured"
    | "best_selling"
    | "a_z"
    | "z_a"
    | "price_low"
    | "price_high";

type Props = {
    value: SortOption;
    onChange: (value: SortOption) => void;
};

const options: { label: string; value: SortOption }[] = [
    { label: "Featured", value: "featured" },
    { label: "Cele mai vândute", value: "best_selling" },
    { label: "Alfabetic, A-Z", value: "a_z" },
    { label: "Alfabetic, Z-A", value: "z_a" },
    { label: "Preț, mic la mare", value: "price_low" },
    { label: "Preț, mare la mic", value: "price_high" },
];

export default function SortDropdown({ value, onChange }: Props) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <style>{`
                @keyframes menuSlideUp {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                @keyframes backdropFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-menu-slide-up {
                    animation: menuSlideUp 0.25s cubic-bezier(0.25, 1, 0.5, 1) forwards;
                }
                .animate-backdrop-fade-in {
                    animation: backdropFadeIn 0.2s ease-out forwards;
                }
            `}</style>

            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="text-xs tracking-[0.15em] text-neutral-800 flex items-center gap-1.5 font-medium uppercase bg-transparent border-none p-0 cursor-pointer"
            >
                SORTEAZĂ
                <svg
                    className={`w-3 h-3 text-neutral-500 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {open && (
                <>
                    <div
                        className="fixed inset-0 bg-neutral-800/40 backdrop-blur-xs z-50 md:hidden animate-backdrop-fade-in"
                        onClick={() => setOpen(false)}
                    />

                    <div className="fixed bottom-0 left-0 right-0 bg-white z-50 shadow-[0_-8px_30px_rgb(0,0,0,0.08)] border-t border-neutral-100 rounded-t-xl md:rounded-t-none animate-menu-slide-up md:animate-none md:absolute md:bottom-auto md:left-auto md:right-0 md:top-full md:mt-3 md:w-[280px] md:border md:border-neutral-200/60 md:shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
                        <div className="relative flex items-center justify-center py-4 border-b border-neutral-100">
                            <span className="text-[11px] font-semibold tracking-[0.2em] text-neutral-800 uppercase"></span>
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="absolute right-4 text-neutral-400 hover:text-neutral-800 text-sm font-light bg-transparent border-none p-0 cursor-pointer outline-none transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="flex flex-col items-center justify-center py-6 gap-4">
                            {options.map((option) => {
                                const active = option.value === value;

                                return (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            onChange(option.value);
                                            setOpen(false);
                                        }}
                                        className={`text-center text-xs tracking-wide py-1 px-4 bg-transparent border-none cursor-pointer block transition-colors duration-200 ${
                                            active
                                                ? "text-neutral-800 font-medium underline underline-offset-4 decoration-neutral-400"
                                                : "text-neutral-400 hover:text-neutral-800 font-light"
                                        }`}
                                    >
                                        {option.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}