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

            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="text-xs tracking-widest text-black flex items-center gap-1"
            >
                SORTEAZĂ
                <span>▾</span>
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-[200px] bg-white border border-black z-50">

                    {options.map((option) => {
                        const active = option.value === value;

                        return (
                            <button
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value);
                                    setOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 text-[10px] tracking-widest ${
                                    active
                                        ? "bg-black text-white"
                                        : "text-black"
                                }`}
                            >
                                {option.label}
                            </button>
                        );
                    })}

                </div>
            )}
        </div>
    );
}