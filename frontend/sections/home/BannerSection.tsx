import Image from "next/image";

export default function UrbanBanner() {
    return (
        <section className="w-full relative h-[990px] md:h-[900px] flex items-center justify-center text-center">

            {/* Background */}
            <Image
                src="/images/banners/dog.jpeg"
                alt=""
                fill
                className="object-cover"
                priority
            />

            {/* Dark overlay (important for readability) */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center px-6">

                {/* Script SVG */}
                <div className="mb-6 w-[380px] md:w-[900px]">
                    <Image
                        src="/svg/reserved.svg"
                        alt="Reserved Only For The Motivated"
                        width={500}
                        height={200}
                        className="w-full h-auto"
                    />
                </div>

                {/* Main title */}
                <h2 className="text-white font-bold uppercase pt-40 leading-tight text-3xl md:text-5xl tracking-wide">
                    URBANITE COLLECTION 25 // NEW
                </h2>

                {/* Subtitle */}
                <p className="text-white text-xs md:text-sm mt-4 max-w-[300px] md:max-w-[420px] leading-relaxed">
                    NOUA NOASTRĂ COLECȚIE URBANĂ ‘25. NUMAI PE PLATFORMA BEAST LOCKER
                </p>

                {/* Button */}
                <button
                    type="button"
                    className="mt-6 bg-white text-black px-6 py-3 text-xs md:text-sm font-semibold tracking-widest hover:bg-black hover:text-white border border-white transition"
                >
                    CUMPĂRĂ ACUM
                </button>

            </div>
        </section>
    );
}