import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="w-full bg-[#f5f5f5] flex justify-center h-[880px] md:h-[500px] text-[#6A6A6A] font-Inter">
            <div className="w-full max-w-[1200px] px-6 md:px-8 flex flex-col justify-between">
                <div className="pt-10 md:pt-16">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1.35fr_1.45fr] gap-10 md:gap-12">
                        <div className="flex flex-col items-center text-center md:items-start md:text-left">
                            <h3 className="text-[13px] font-medium tracking-[0.12em]">
                                SOCIAL MEDIA
                            </h3>

                            <div className="mt-5 flex items-center gap-4">
                                <button
                                    type="button"
                                    aria-label="Facebook"
                                    className="flex items-center justify-center hover:opacity-70 transition"
                                >
                                    <Image
                                        src="/icons/facebook.svg"
                                        alt=""
                                        width={14}
                                        height={14}
                                        className="h-[14px] w-[14px]"
                                    />
                                </button>

                                <button
                                    type="button"
                                    aria-label="Instagram"
                                    className="flex items-center justify-center hover:opacity-70 transition"
                                >
                                    <Image
                                        src="/icons/instagram.svg"
                                        alt=""
                                        width={14}
                                        height={14}
                                        className="h-[14px] w-[14px]"
                                    />
                                </button>

                                <button
                                    type="button"
                                    aria-label="TikTok"
                                    className="flex items-center justify-center hover:opacity-70 transition"
                                >
                                    <Image
                                        src="/icons/tiktok.svg"
                                        alt=""
                                        width={14}
                                        height={14}
                                        className="h-[14px] w-[14px]"
                                    />
                                </button>

                                <button
                                    type="button"
                                    aria-label="YouTube"
                                    className="flex items-center justify-center hover:opacity-70 transition"
                                >
                                    <Image
                                        src="/icons/youtube.svg"
                                        alt=""
                                        width={14}
                                        height={14}
                                        className="h-[14px] w-[14px]"
                                    />
                                </button>

                                <button
                                    type="button"
                                    aria-label="Twitter"
                                    className="flex items-center justify-center hover:opacity-70 transition"
                                >
                                    <Image
                                        src="/icons/twitter.svg"
                                        alt=""
                                        width={14}
                                        height={14}
                                        className="h-[14px] w-[14px]"
                                    />
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col items-center text-center md:items-start md:text-left">
                            <h3 className="text-[13px] font-medium tracking-[0.12em]">
                                CONTUL MEU
                            </h3>

                            <div className="mt-5 flex flex-col gap-3 text-[12px]">
                                <Link
                                    href="/login"
                                    className="text-center md:text-left hover:opacity-70 transition"
                                >
                                    LOGIN
                                </Link>
                                <Link
                                    href="/register"
                                    className="text-center md:text-left hover:opacity-70 transition"
                                >
                                    SIGNUP
                                </Link>
                                <Link
                                    href="/account"
                                    className="text-center md:text-left hover:opacity-70 transition"
                                >
                                    CONT
                                </Link>
                            </div>
                        </div>

                        <div className="flex flex-col items-center text-center md:items-start md:text-left">
                            <h3 className="text-[13px] font-medium tracking-[0.12em]">
                                AJUTOR
                            </h3>

                            <div className="mt-5 flex flex-col gap-3 text-[12px]">
                                <a
                                    href="/about"
                                    className="text-center md:text-left hover:opacity-70 transition block"
                                >
                                    DESPRE NOI
                                </a>
                                <a
                                    href="/return"
                                    className="text-center md:text-left hover:opacity-70 transition block"
                                >
                                    POLITICA DE RETUR
                                </a>
                                <a
                                    href="#"
                                    className="text-center md:text-left hover:opacity-70 transition block"
                                >
                                    POLITICA DE CONFIDENȚIALITATE
                                </a>
                                <a
                                    href="#"
                                    className="text-center md:text-left hover:opacity-70 transition block"
                                >
                                    TERMENI ȘI CONDIȚII
                                </a>
                                <a
                                    href="#"
                                    className="text-center md:text-left hover:opacity-70 transition block"
                                >
                                    FAQ
                                </a>
                            </div>
                        </div>

                        <div className="flex flex-col items-center text-center md:items-start md:text-left md:border-l md:border-gray-300 md:pl-10">
                            <h3 className="text-[13px] font-medium tracking-[0.12em]">
                                CONTACT
                            </h3>

                            <div className="mt-5 space-y-4 text-[12px]">
                                <p className="leading-6">
                                    AI NEVOIE DE AJUTOR? INFORMAȚII?
                                    <br />
                                    CONTACTEAZĂ-NE
                                </p>

                                <div className="flex items-center gap-3 justify-center md:justify-start">
                                    <Image
                                        src="/icons/clock.svg"
                                        alt=""
                                        width={20}
                                        height={20}
                                        className="h-[18px] w-[18px]"
                                    />
                                    <span>DE LUNI PÂNĂ VINERI DE LA 9:00 LA 19:00</span>
                                </div>

                                <div className="flex items-center gap-3 justify-center md:justify-start">
                                    <Image
                                        src="/icons/phone.svg"
                                        alt=""
                                        width={20}
                                        height={20}
                                        className="h-[18px] w-[18px]"
                                    />
                                    <span>+40 770 155 925</span>
                                </div>

                                <div className="flex items-center gap-3 justify-center md:justify-start">
                                    <Image
                                        src="/icons/mail.svg"
                                        alt=""
                                        width={20}
                                        height={20}
                                        className="h-[18px] w-[18px]"
                                    />
                                    <span>beastproject@gmail.com</span>
                                </div>
                            </div>

                            <div className="mt-7 flex items-center gap-3 justify-center md:justify-start">
                                <button
                                    type="button"
                                    aria-label="ANPC"
                                    className="hover:opacity-80 transition"
                                >
                                    <Image
                                        src="/temp/legal1.jpeg"
                                        alt=""
                                        width={96}
                                        height={32}
                                        className="h-auto w-[160px]"
                                    />
                                </button>

                                <button
                                    type="button"
                                    aria-label="Soluționarea online a litigiilor"
                                    className="hover:opacity-80 transition"
                                >
                                    <Image
                                        src="/temp/legal2.jpeg"
                                        alt=""
                                        width={160}
                                        height={38}
                                        className="h-auto w-[160px]"
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="h-px w-full bg-gray-300" />
                    <div className="py-10 text-center text-[10px] tracking-[0.08em]">
                        COPYRIGHT © 2026 BEASTLOCKER
                    </div>
                </div>
            </div>
        </footer>
    );
}