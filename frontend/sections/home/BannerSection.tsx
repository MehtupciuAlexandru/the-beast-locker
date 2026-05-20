import Image from "next/image";

export default function UrbanBanner() {
    return (
        <section className="w-full relative overflow-hidden h-[600px] flex items-center justify-center text-center">
            <Image
                src="/images/banners/dog.jpeg"
                alt=""
                fill
                className="object-cover"
                style={{ objectPosition: "center" }}
                priority
            />

            <div className="absolute inset-0 bg-black/40" />

            <div className="relative z-10 flex flex-col items-center px-6">
                <div className="w-[280px] md:w-[500px] lg:w-[650px]">
                    <Image
                        src="/svg/reserved.svg"
                        alt="Reserved Only For The Motivated"
                        width={650}
                        height={260}
                        className="w-full h-auto"
                    />
                </div>

                <h2 className="text-white font-GemunuExtraBold uppercase mt-6 leading-tight text-2xl md:text-4xl lg:text-5xl tracking-wide">
                    NO PLAN B COLLECTION 26 // NEW
                </h2>

                <p className="text-white font-Inter18Semibold text-xs md:text-sm mt-3 max-w-[300px] md:max-w-[600px] leading-relaxed">
                    NOUA NOASTRĂ COLECȚIE, CONCEPUTĂ PENTRU CEI CARE SUNT SUFICIENT DE PUTERNICI SĂ NU DEA ÎNAPOI
                </p>

                <button
                    type="button"
                    className="mt-6 bg-[#27F2EB] text-black px-6 py-3 text-xs md:text-sm font-Inter18Semibold tracking-widest hover:bg-black hover:text-white cursor-pointer transition"
                >
                    CUMPĂRĂ ACUM
                </button>
            </div>
        </section>
    );
}