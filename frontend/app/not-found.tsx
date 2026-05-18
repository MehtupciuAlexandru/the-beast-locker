import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/footer";

export default function NotFound() {
    return (
        <>
            <Navbar />

            <main className="w-full bg-white text-black min-h-[calc(100vh-100px)] flex flex-col justify-center items-center px-6 py-24">
                <div className="w-full max-w-[850px] aspect-[16/9] relative mb-16">
                    <Image
                        src="/images/banners/jackie.jpeg"
                        alt="Page not found"
                        fill
                        priority
                        className="object-cover"
                    />
                </div>

                <div className="text-center space-y-6 max-w-2xl">
                    <h1 className="text-xl sm:text-4xl md:text-5xl font-Inter tracking-tight text-[#1a1a1a]">
                        Ne pare rău!
                    </h1>
                    <h1 className="text-xl sm:text-4xl md:text-5xl font-Inter tracking-tight text-[#1a1a1a]">
                        Pagina nu a fost găsită
                    </h1>
                    <p className="text-base sm:text-lg text-neutral-500 font-Inter max-w-lg mx-auto">
                        Această pagină nu a fost găsită sau link-ul a fost folosit incorect.
                    </p>
                </div>

                <div className="mt-14">
                    <Link
                        href="/home"
                        className="inline-flex items-center justify-center gap-3 whitespace-nowrap text-center bg-[#1a1a1a] text-white uppercase text-xs sm:text-sm tracking-[0.25em] font-Inter18Semibold px-12 py-5 hover:bg-black transition-colors"
                    >
                        Înapoi la pagina principală
                        <svg
                            className="w-4 h-4 shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="3"
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </Link>
                </div>
            </main>

            <Footer />
        </>
    );
}