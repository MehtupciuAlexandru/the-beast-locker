import Image from "next/image";

export default function PlatformDetails() {
    return (
        <section className="w-full bg-[#f3f3f3] py-12 sm:py-16 px-4 sm:px-6">
            <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8 text-center">

                {/* Transport */}
                <div className="flex flex-col items-center gap-4">
                    <Image
                        src="/svg/bag.circle.svg"
                        alt="Transport icon"
                        width={48}
                        height={48}
                        className="w-10 h-10 sm:w-12 sm:h-12"
                    />
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                        Transport GRATUIT de la 299
                    </h3>
                    <p className="text-gray-700 text-sm sm:text-base max-w-xs">
                        Serviciu disponibil doar în România. În curând și Internațional
                    </p>
                </div>

                {/* Payment */}
                <div className="flex flex-col items-center gap-4">
                    <Image
                        src="/svg/bag.circle.svg"
                        alt="Secure payment icon"
                        width={48}
                        height={48}
                        className="w-10 h-10 sm:w-12 sm:h-12"
                    />
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                        Plată sigură
                    </h3>
                    <p className="text-gray-700 text-sm sm:text-base max-w-xs">
                        Toate plățile sunt făcute în siguranță și niciun detaliu bancar nu este păstrat
                    </p>
                </div>

                {/* Customer Service */}
                <div className="flex flex-col items-center gap-4">
                    <Image
                        src="/svg/beats.headphones.svg"
                        alt="Customer service icon"
                        width={48}
                        height={48}
                        className="w-10 h-10 sm:w-12 sm:h-12"
                    />
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                        Customer Service
                    </h3>
                    <p className="text-gray-700 text-sm sm:text-base max-w-xs">
                        Dacă ai vreo întrebare sau problemă, nu ezita să folosești metodele de contact
                    </p>
                </div>

            </div>
        </section>
    );
}