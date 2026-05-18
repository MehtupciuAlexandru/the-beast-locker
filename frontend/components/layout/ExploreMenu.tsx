"use client"

import Link from "next/link"
import { useState } from "react"

const menuItems = [
    { label: "Cumpărare / Retur", href: "#", active: true },
    { label: "Contact", href: "#" },
    { label: "Despre noi", href: "/about" },
    { label: "Politica de confidențialitate", href: "#" },
    { label: "Termeni și condiții", href: "#" },
    { label: "Întrebări frecvente", href: "#" },
    { label: "Disponibilitatea produselor", href: "#" },
    { label: "Urmărirea comenzii", href: "#" },
    { label: "Pot modifica o comandă deja plasată?", href: "#" },
    { label: "Facturare / TVA", href: "#" },
    { label: "Anularea unei comenzi", href: "#" },
    { label: "Ghid de mărimi", href: "#" },
]

export default function ExploreMenu() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <aside className="w-full bg-[#f0f4f8] h-full px-6 md:px-10 py-6 md:py-8 font-Inter">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full md:cursor-default md:mb-8"
                aria-expanded={isOpen}
            >
                <div className="flex items-center gap-3">
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-800"
                    >
                        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                        <path d="M8 7h6" />
                        <path d="M8 11h8" />
                    </svg>
                    <h2 className="text-lg font-bold text-gray-800">
                        Explorează
                    </h2>
                </div>
                <svg
                    className={`w-5 h-5 text-gray-600 transition-transform md:hidden ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <nav className={`flex-col space-y-4 mt-6 md:mt-0 ${isOpen ? 'flex' : 'hidden md:flex'}`}>
                {menuItems.map((item, index) => (
                    <Link
                        key={index}
                        href={item.href}
                        className="flex items-center justify-between group"
                    >
                        <span
                            className={`text-[13px] transition-colors ${
                                item.active
                                    ? "text-gray-900 font-bold"
                                    : "text-gray-500 font-medium group-hover:text-gray-900"
                            }`}
                        >
                            {item.label}
                        </span>
                        <svg
                            className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                                item.active ? "text-gray-900" : "text-gray-400 group-hover:text-gray-900"
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                ))}
            </nav>
        </aside>
    )
}