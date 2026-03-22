"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function BannerPopup() {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => setOpen(true), 300); // slight delay feels nicer
        return () => clearTimeout(timer);
    }, []);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/70"
                onClick={() => setOpen(false)}
            />

            {/* Modal */}
            <div className="relative z-10 w-[90%] max-w-[780px] h-[540px] bg-white flex">

                {/* LEFT IMAGE */}
                <div className="relative w-1/2 h-full hidden md:block">
                    <Image
                        src="/images/banners/kid.jpeg"
                        alt=""
                        fill
                        className="object-cover"
                    />
                </div>

                {/* RIGHT CONTENT */}
                <div className="w-full md:w-1/2 h-full flex flex-col justify-center items-center px-6 text-center relative">

                    {/* Close */}
                    <button
                        onClick={() => setOpen(false)}
                        className="absolute top-4 right-4 text-gray-500 hover:text-black"
                    >
                        ✕
                    </button>

                    {/* Logo */}
                    <div className="mb-25">
                        <img src="logos/beastLockerLogo.svg" className="w-60" />
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-semibold text-black tracking-wide">
                        BINE AI VENIT
                    </h2>

                    {/* Subtitle */}
                    <p className="text-sm mt-2 text-gray-600">
                        Obține 10% reducere la noua colecție!
                    </p>

                    {/* Input */}
                    <input
                        type="email"
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full mt-6 border-b border-gray-400 text-black bg-transparent outline-none py-2 text-sm"
                    />

                    {/* Button */}
                    <button className="w-full mt-4 bg-black text-white py-3 text-xs tracking-widest font-semibold hover:bg-gray-300 hover:text-black transition">
                        TRIMITE
                    </button>

                </div>
            </div>
        </div>
    );
}