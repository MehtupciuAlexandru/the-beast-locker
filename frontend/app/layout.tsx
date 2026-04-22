import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartUIProvider } from "@/lib/context/CartUIContext"; // ⭐ ADD THIS

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "BeastLocker - Coming Soon",
    description:
        "Premium athletic wear for the relentless. Sport, street and competition equipment. Coming 2025.",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <CartUIProvider>
            {children}
        </CartUIProvider>
        </body>
        </html>
    );
}