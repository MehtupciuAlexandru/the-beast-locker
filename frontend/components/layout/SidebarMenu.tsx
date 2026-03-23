"use client";
import Link from "next/link";

type SidebarMenuProps = {
    isOpen: boolean;
    onClose: () => void;
};

export default function SidebarMenu({ isOpen, onClose }: SidebarMenuProps) {
    return (
        <>
            {/* Overlay */}
            <div
                onClick={onClose}
                className={`fixed inset-0 bg-black/40 transition-opacity duration-300 z-40 ${
                    isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
            />
            
            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full w-[280px] bg-white z-50 transform transition-transform duration-300 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="p-4">

                    <button
                        onClick={onClose}
                        className="text-sm font-semibold text-black"
                    >
                        CLOSE
                    </button>

                    <div className="mt-6 flex flex-col gap-4 text-m font-semibold text-black">

                        <Link
                            href="/products"
                            onClick={onClose}
                            className="block"
                        >
                            Tricouri
                        </Link>

                        <Link
                            href="/products"
                            onClick={onClose}
                            className="block"
                        >
                            Hanorace
                        </Link>

                        <Link
                            href="/products"
                            onClick={onClose}
                            className="block"
                        >
                            Pantaloni
                        </Link>

                        <Link
                            href="/products"
                            onClick={onClose}
                            className="block"
                        >
                            Accesorii
                        </Link>

                    </div>
                </div>
            </div>
        </>
    );
}