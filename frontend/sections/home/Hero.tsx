import Image from "next/image";
import Navbar from "@/components/Navbar";

export default function Hero() {
    return (
        <section className="w-full bg-white">
            <Navbar />

            <div className="relative h-[740px] w-full overflow-hidden md:h-[740px] lg:h-[760px]">
                <Image
                    src="/images/hero/hero-image.jpeg"
                    alt="Urbanite Collection"
                    fill
                    unoptimized
                    className="object-cover select-none pointer-events-none"
                    style={{ objectPosition: "67%" }}
                />

                <div className="absolute inset-0 bg-black/28 md:bg-black/22" />

                <div className="absolute inset-x-0 bottom-[56px] z-10 px-6 text-center md:bottom-[72px] md:px-10 md:text-left lg:bottom-[84px] lg:px-16">
                    <div className="mx-auto max-w-[280px] text-white md:mx-0 md:max-w-[420px] lg:max-w-[560px]">

                        <h1 className="mb-3 text-[40px] font-extrabold uppercase leading-[0.98] tracking-[-0.02em] md:text-[42px] lg:text-[62px]">
                            URBANITE COLLECTION 25 // NEW
                        </h1>

                        <p className="mx-auto mb-4 max-w-[250px] text-[15px] leading-[1.35] text-white/90 md:mx-0 md:max-w-[340px] md:text-[11px] lg:max-w-[420px] lg:text-[12px]">
                            NOUA NOASTRĂ COLECȚIE URBANĂ ’25. NUMAI PE PLATFORMA BEAST LOCKER
                        </p>

                        <button className="h-[34px] bg-[#FFD400] px-5 text-[15px] font-bold uppercase text-black md:h-[38px] md:px-6 md:text-[12px] lg:h-[42px] lg:px-7 lg:text-[13px]">
                            CUMPĂRĂ ACUM
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}