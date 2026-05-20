import Image from "next/image";

export default function PlatformDetails() {
    return (
        <section className="w-full bg-white px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
            <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-x-4 gap-y-8 text-center sm:grid-cols-3 sm:gap-x-6 md:gap-x-8 lg:gap-x-[60px] xl:gap-x-[100px]">

                <div className="flex flex-col items-center gap-2 sm:gap-3">
                    <Image
                        src="/svg/giftcard.svg"
                        alt="Transport icon"
                        width={40}
                        height={40}
                        className="h-8 w-8 sm:h-10 sm:w-10"
                    />
                    <h3 className="font-GemunuBold text-base text-[#1c1c1e] sm:text-lg lg:text-xl">
                        Transport GRATUIT de la 299
                    </h3>
                    <p className="w-full font-Inter text-xs leading-relaxed text-[#1c1c1e] sm:text-sm">
                        Serviciu disponibil doar în România. În curând și Internațional
                    </p>
                </div>

                <div className="flex flex-col items-center gap-2 sm:gap-3">
                    <Image
                        src="/svg/bag.circle.svg"
                        alt="Secure payment icon"
                        width={40}
                        height={40}
                        className="h-8 w-8 sm:h-10 sm:w-10"
                    />
                    <h3 className="font-GemunuBold text-base text-[#1c1c1e] sm:text-lg lg:text-xl">
                        Plată sigură
                    </h3>
                    <p className="w-full font-Inter text-xs leading-relaxed text-[#1c1c1e] sm:text-sm">
                        Toate plățile sunt făcute în siguranță și niciun detaliu bancar nu este păstrat
                    </p>
                </div>

                <div className="flex flex-col items-center gap-2 sm:gap-3">
                    <Image
                        src="/svg/beats.headphones.svg"
                        alt="Customer service icon"
                        width={40}
                        height={40}
                        className="h-8 w-8 sm:h-10 sm:w-10"
                    />
                    <h3 className="font-GemunuBold text-base text-[#1c1c1e] sm:text-lg lg:text-xl">
                        Customer Service
                    </h3>
                    <p className="w-full font-Inter text-xs leading-relaxed text-[#1c1c1e] sm:text-sm">
                        Dacă ai vreo întrebare sau problemă, nu ezita să folosești metodele de contact
                    </p>
                </div>

            </div>
        </section>
    );
}