"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import SidebarMenu from "@/components/layout/SidebarMenu";
import SearchOverlay from "@/components/layout/SearchOverlay";
import CartDrawer from "@/components/cart/CartDrawer";
import { useCartUI } from "@/lib/context/CartUIContext";

const desktopLinks = [
    { label: "Echipamente", href: "/equipment" },
    { label: "Îmbrăcăminte", href: "/countdown" },
    { label: "Accesorii", href: "/countdown" },
];

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const { isOpen, openCart, closeCart } = useCartUI();

    return (
        <header className="w-full">
            <div className="flex h-7 items-center justify-center gap-2 bg-[#1C1C1E] px-4 text-[10px] font-Inter tracking-[0.08em] text-white sm:h-8">
                <span className="text-center">
                    Transport GRATUIT la comenzi peste 299 RON (vezi condiții)
                </span>
                <span aria-hidden="true">→</span>
            </div>

            <div className="grid h-[56px] grid-cols-[auto_1fr_auto] items-center bg-white pl-4 sm:px-6">
                <div className="flex items-center justify-start lg:hidden">
                    <button
                        type="button"
                        aria-label="Open menu"
                        onClick={() => setIsMenuOpen(true)}
                        className="mr-6 flex h-8 w-8 items-center justify-center"
                    >
                        <Image
                            src="/icons/menuButton.svg"
                            alt=""
                            width={22}
                            height={22}
                            className="h-5 w-5"
                        />
                    </button>
                </div>

                <div className="hidden lg:flex lg:items-center lg:justify-start">
                    <Link href="/home" aria-label="Go to homepage" className="flex items-center">
                        <Image
                            src="/logos/beastLockerLogo.svg"
                            alt="Beast Locker"
                            width={140}
                            height={32}
                            className="h-auto w-[140px]"
                            priority
                        />
                    </Link>
                </div>

                <div className="flex items-center justify-center lg:hidden">
                    <Link href="/home" aria-label="Go to homepage" className="flex items-center justify-center">
                        <Image
                            src="/logos/beastLockerLogo.svg"
                            alt="Beast Locker"
                            width={140}
                            height={32}
                            className="h-auto w-[120px] sm:w-[140px]"
                            priority
                        />
                    </Link>
                </div>

                <nav className="hidden lg:flex lg:items-center lg:justify-center lg:gap-8">
                    {desktopLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="text-lg font-Inter18Semibold text-[#1C1C1E] transition hover:opacity-70"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center justify-end gap-1 sm:gap-3">
                    <button
                        type="button"
                        aria-label="Search"
                        onClick={() => setIsSearchOpen(true)}
                        className="flex h-8 w-8 cursor-pointer items-center justify-center"
                    >
                        <Image
                            src="/icons/searchIcon.svg"
                            alt=""
                            width={18}
                            height={18}
                            className="h-[18px] w-[18px]"
                        />
                    </button>

                    <Link
                        href="/account"
                        aria-label="Account"
                        className="flex h-8 w-8 cursor-pointer items-center justify-center"
                    >
                        <Image
                            src="/icons/accountIcon.svg"
                            alt=""
                            width={18}
                            height={18}
                            className="h-[18px] w-[18px]"
                        />
                    </Link>

                    <button
                        aria-label="Cart"
                        onClick={openCart}
                        className="flex h-8 w-8 cursor-pointer items-center justify-center"
                    >
                        <Image
                            src="/icons/cartIcon.svg"
                            alt=""
                            width={18}
                            height={18}
                            className="h-[18px] w-[18px]"
                        />
                    </button>
                </div>
            </div>

            <SidebarMenu
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
            />

            <SearchOverlay
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
            />

            <CartDrawer isOpen={isOpen} onClose={closeCart} />
        </header>
    );
}