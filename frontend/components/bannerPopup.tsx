"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function BannerPopup() {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState("");

    useEffect(() => {
        const bannerClosed = localStorage.getItem("bannerPopupClosed");

        if (!bannerClosed) {
            const timer = setTimeout(() => setOpen(true), 300);
            return () => clearTimeout(timer);
        }
    }, []);

    const closeBanner = () => {
        localStorage.setItem("bannerPopupClosed", "true");
        setOpen(false);
    };

    const handleSubmit = () => {
        localStorage.setItem("bannerPopupClosed", "true");
        setOpen(false);
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/70 cursor-pointer"
                onClick={closeBanner}
            />

            <div className="relative z-10 w-[90%] max-w-[780px] h-[540px] bg-white flex">
                <div className="relative w-1/2 h-full hidden md:block">
                    <Image
                        src="/images/banners/kid.jpeg"
                        alt=""
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="w-full md:w-1/2 h-full flex flex-col justify-center items-center px-6 text-center relative">
                    <button
                        onClick={closeBanner}
                        className="absolute top-4 right-4 text-gray-500 hover:text-black cursor-pointer"
                    >
                        ✕
                    </button>

                    <div className="mb-3">
                        <img
                            src="logos/blackClaw.svg"
                            alt="Beast Locker"
                            className="w-13"
                        />
                    </div>

                    <h2 className="text-5xl font-GemunuExtraBold text-black tracking-wide">
                        BINE AI VENIT
                    </h2>

                    <p className="text-sm font-Inter mt-2 text-gray-600">
                        Obține 10% reducere la noua colecție!
                    </p>

                    <input
                        type="email"
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full mt-6 border-b border-gray-400 text-black bg-transparent outline-none py-2 text-sm"
                    />

                    <button
                        onClick={handleSubmit}
                        className="w-full mt-4 bg-[#1c1c1E] text-white py-3 text-xs tracking-widest font-Inter hover:bg-black transition cursor-pointer"
                    >
                        TRIMITE
                    </button>
                </div>
            </div>
        </div>
    );
}