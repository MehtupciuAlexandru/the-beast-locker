"use client";

import { useEffect, useRef } from "react";

type SearchOverlayProps = {
    isOpen: boolean;
    onClose: () => void;
};

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
        }
    }, [isOpen]);

    return (
        <div
            className={`fixed inset-0 z-50 flex items-start justify-center bg-black/50 transition-opacity duration-300 ${
                isOpen ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
        >
            <div className="mt-32 w-full max-w-xl px-4">
                <div className="bg-white p-4 shadow-lg">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const value = inputRef.current?.value;
                            console.log("Search:", value);
                            onClose();
                        }}
                        className="flex items-center gap-2"
                    >
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Caută produse..."
                            className="w-full border-b border-gray-300 px-2 py-2 text-sm text-black outline-none"
                        />

                        <button
                            type="submit"
                            className="text-sm font-semibold text-black "
                        >
                            ENTER
                        </button>
                    </form>
                </div>
            </div>

            {/* Click outside to close */}
            <div
                className="absolute inset-0 -z-10"
                onClick={onClose}
            />
        </div>
    );
}