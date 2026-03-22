"use client";

import { useState } from "react";

export default function Newsletter() {
    const [email, setEmail] = useState("");
    const [accepted, setAccepted] = useState(false);

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!isValidEmail || !accepted) {
            return;
        }

        console.log({ email, accepted });
    };

    return (
        <section className="w-full bg-[#f5f5f5] flex justify-center py-10 md:py-20">
            <div className="w-full max-w-[390px] md:max-w-[800px] px-6 text-center">

                {/* Title */}
                <h1 className="text-2xl md:text-4xl font-semibold leading-tight text-black">
                    Obține 10% reducere la noua colecție!
                </h1>

                {/* Subtitle */}
                <p className="mt-4 text-sm text-gray-700 leading-relaxed">
                    Înscrie-te la newsletterul nostru pentru a primi un cod de reducere și fii la curent cu noutățile de la BeastLocker.
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-8">

                    {/* Input + Button */}
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-2">

                        <input
                            type="email"
                            placeholder="E-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full md:flex-1 border-b ${
                                email && !isValidEmail ? "border-red-500" : "border-gray-400"
                            } bg-transparent outline-none py-2 text-black text-sm placeholder-gray-500`}
                        />

                        <button
                            type="submit"
                            disabled={!isValidEmail || !accepted}
                            className="w-full md:w-auto bg-black text-white px-6 py-3 text-xs tracking-widest font-semibold transition
                            disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-800"
                        >
                            ÎNSCRIE-TE
                        </button>

                    </div>

                    {/* Checkbox */}
                    <label className="flex items-start gap-2 mt-6 text-left text-[11px] text-gray-700 cursor-pointer max-w-[600px] mx-auto">
                        <input
                            type="checkbox"
                            checked={accepted}
                            onChange={(e) => setAccepted(e.target.checked)}
                            className="mt-1 accent-black"
                        />

                        <span>
                            Accept și înțeleg{" "}
                            <button
                                type="button"
                                className="underline"
                                onClick={() => alert("Open privacy policy")}
                            >
                                politica de confidențialitate
                            </button>.
                            <br />
                            Discountul este valabil doar pentru produsele aflate la preț întreg și care nu fac parte din altă campanie promoțională. Oferta valabilă în limita stocului disponibil.
                            <br />
                            Discountul este valabil 7 zile de la primirea acestuia.
                        </span>
                    </label>

                </form>

            </div>
        </section>
    );
}