"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import SidebarMenu from "@/components/layout/SidebarMenu";
import SearchOverlay from "@/components/layout/SearchOverlay";

const desktopLinks = [
    { label: "Echipamente", href: "/products?category=echipamente" },
    { label: "Îmbrăcăminte", href: "/products?category=imbracaminte" },
    { label: "Explorează", href: "/products" },
];

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (
        <header className="w-full">
            <div className="flex h-9 items-center justify-center gap-2 bg-black px-4 text-[11px] font-medium tracking-[0.08em] text-white sm:h-10 sm:text-xs">
                <span className="text-center">
                    Transport GRATUIT la comenzi peste 299 RON (vezi condiții)
                </span>
                <span aria-hidden="true">→</span>
            </div>

            <div className="grid h-[76px] grid-cols-[auto_1fr_auto] items-center bg-[#f3f3f3] pl-4 sm:px-6">
                <div className="flex items-center justify-start lg:hidden">
                    <button
                        type="button"
                        aria-label="Open menu"
                        onClick={() => setIsMenuOpen(true)}
                        className="flex h-10 w-10 items-center justify-center mr-14"
                    >
                        <Image
                            src="/icons/menuButton.svg"
                            alt=""
                            width={26}
                            height={26}
                            className="h-7 w-7"
                        />
                    </button>
                </div>

                <div className="hidden lg:flex lg:items-center lg:justify-start">
                    <Link href="/" aria-label="Go to homepage" className="flex items-center">
                        <Image
                            src="/logos/beastLockerLogo.svg"
                            alt="Beast Locker"
                            width={170}
                            height={40}
                            className="h-auto w-[170px]"
                            priority
                        />
                    </Link>
                </div>

                <div className="flex items-center justify-center lg:hidden">
                    <Link href="/" aria-label="Go to homepage" className="flex items-center justify-center">
                        <Image
                            src="/logos/beastLockerLogo.svg"
                            alt="Beast Locker"
                            width={170}
                            height={40}
                            className="h-auto w-[150px] sm:w-[170px]"
                            priority
                        />
                    </Link>
                </div>

                <nav className="hidden lg:flex lg:items-center lg:justify-center lg:gap-10">
                    {desktopLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="text-3xl font-GemunuRegular text-black transition hover:opacity-70"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center justify-end sm:gap-5">
                    <button
                        type="button"
                        aria-label="Search"
                        onClick={() => setIsSearchOpen(true)}
                        className="flex h-10 w-10 items-center justify-center"
                    >
                        <Image
                            src="/icons/searchIcon.svg"
                            alt=""
                            width={22}
                            height={22}
                            className="h-[22px] w-[22px]"
                        />
                    </button>

                    <Link
                        href="/account"
                        aria-label="Account"
                        className="flex h-10 w-10 items-center justify-center"
                    >
                        <Image
                            src="/icons/accountIcon.svg"
                            alt=""
                            width={22}
                            height={22}
                            className="h-[22px] w-[22px]"
                        />
                    </Link>

                    <Link
                        href="/cart"
                        aria-label="Cart"
                        className="flex h-10 w-10 items-center justify-center"
                    >
                        <Image
                            src="/icons/cartIcon.svg"
                            alt=""
                            width={22}
                            height={22}
                            className="h-[22px] w-[22px]"
                        />
                    </Link>
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
        </header>
    );
}