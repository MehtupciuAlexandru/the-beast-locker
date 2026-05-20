import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="w-full bg-white">
            <Navbar />

            <div className="relative h-[740px] w-full overflow-hidden md:h-[740px] lg:h-[760px]">
                <Image
                    src="/images/hero/hero-image.png"
                    alt="Urbanite Collection"
                    fill
                    unoptimized
                    className="object-cover select-none pointer-events-none"
                    style={{ objectPosition: "67%" }}
                />

                <div className="absolute inset-0 bg-black/28 md:bg-black/22" />

                <div className="absolute inset-x-0 bottom-[56px] z-10 px-6 text-center md:bottom-[72px] md:px-10 md:text-left lg:bottom-[84px] lg:px-16 font-GemunuExtraBold">
                    <div className="mx-auto max-w-[280px] text-white md:mx-0 md:max-w-[420px] lg:max-w-[560px]">

                        <h1 className="mb-3 text-[52px] uppercase leading-[0.98] tracking-[-0.02em] md:text-[68px] lg:text-[88px]">
                            NO PLAN B
                        </h1>
                        <h1 className="mb-3 text-[52px] uppercase leading-[0.98] tracking-[-0.02em] md:text-[60px] lg:text-[68px]">
                            COLLECTION 26 //
                        </h1>
                        <h1 className="mb-3 text-[52px] uppercase leading-[0.98] tracking-[-0.02em] md:text-[60px] lg:text-[68px]">
                            NEW
                        </h1>

                        <p className="mx-auto font-Inter18Semibold mb-4 max-w-[280px] text-[18px] leading-[1.35] text-white/90 md:mx-0 md:max-w-[380px] md:text-[14px] lg:max-w-[460px] lg:text-[16px]">
                            NOUA NOASTRĂ COLECȚIE, CONCEPUTĂ PENTRU CEI CARE SUNT SUFICIENT DE PUTERNICI SĂ NU DEA ÎNAPOI
                        </p>

                        <Link
                            href="/products?collection=equipment"
                            className="inline-flex h-[38px] items-center justify-center bg-[#27F2EB] px-5 text-[18px] font-Inter18Semibold uppercase text-black md:h-[44px] md:px-6 md:text-[15px] lg:h-[48px] lg:px-7 lg:text-[12px]"
                        >
                            CUMPĂRĂ ACUM
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}