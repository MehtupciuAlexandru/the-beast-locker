import Image from "next/image";

export default function PlatformDetails() {
    return (
        <section className="w-full bg-[#f3f3f3] py-20 sm:py-32 px-6 sm:px-10 lg:px-16">
            {/* Expanded container to an ultra-wide 1800px and forced extreme column gaps */}
            <div className="max-w-[1800px] w-full mx-auto grid grid-cols-1 sm:grid-cols-3 gap-y-24 gap-x-8 sm:gap-x-12 md:gap-x-24 lg:gap-x-[150px] xl:gap-x-[250px] text-center">

                {/* Transport */}
                <div className="flex flex-col items-center gap-5 sm:gap-7">
                    <Image
                        src="/svg/giftcard.svg"
                        alt="Transport icon"
                        width={64}
                        height={64}
                        className="w-14 h-14 sm:w-16 sm:h-16"
                    />
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-GemunuBold text-[#1c1c1e]">
                        Transport GRATUIT de la 299
                    </h3>
                    <p className="text-[#1c1c1e] font-Inter text-base sm:text-[17px] leading-relaxed w-full">
                        Serviciu disponibil doar în România. În curând și Internațional
                    </p>
                </div>

                {/* Payment */}
                <div className="flex flex-col items-center gap-5 sm:gap-7">
                    <Image
                        src="/svg/bag.circle.svg"
                        alt="Secure payment icon"
                        width={64}
                        height={64}
                        className="w-14 h-14 sm:w-16 sm:h-16"
                    />
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-GemunuBold text-[#1c1c1e]">
                        Plată sigură
                    </h3>
                    <p className="text-[#1c1c1e] font-Inter text-base sm:text-[17px] leading-relaxed w-full">
                        Toate plățile sunt făcute în siguranță și niciun detaliu bancar nu este păstrat
                    </p>
                </div>

                {/* Customer Service */}
                <div className="flex flex-col items-center gap-5 sm:gap-7">
                    <Image
                        src="/svg/beats.headphones.svg"
                        alt="Customer service icon"
                        width={64}
                        height={64}
                        className="w-14 h-14 sm:w-16 sm:h-16"
                    />
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-GemunuBold text-[#1c1c1e]">
                        Customer Service
                    </h3>
                    <p className="text-[#1c1c1e] font-Inter text-base sm:text-[17px] leading-relaxed w-full">
                        Dacă ai vreo întrebare sau problemă, nu ezita să folosești metodele de contact
                    </p>
                </div>

            </div>
        </section>
    );
}