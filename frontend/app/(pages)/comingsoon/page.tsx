'use client';

export default function Page() {
    return (
        <div className="fixed inset-0 bg-black overflow-hidden">
            {/* Background image layer */}
            <div className="absolute inset-0 -z-10 grid grid-cols-2 grid-rows-3 md:grid-cols-3 md:grid-rows-1 opacity-30">
                <div className="bg-[url('/images/comingSoon/dancingMan.jpeg')] bg-cover bg-no-repeat bg-[position:30%_50%] md:bg-center" />
                <div className="bg-[url('/images/comingSoon/blurryMan.jpeg')] bg-cover bg-no-repeat bg-[position:60%_35%] md:bg-center" />
                <div className="bg-[url('/images/comingSoon/boxers.jpeg')] bg-cover bg-no-repeat bg-[position:50%_65%] md:bg-center" />
                <div className="bg-[url('/images/comingSoon/boyOnWall.jpeg')] bg-cover bg-no-repeat bg-[position:55%_45%] md:bg-center" />
                <div className="bg-[url('/images/comingSoon/armUpMan.jpeg')] bg-cover bg-no-repeat bg-[position:45%_35%] md:bg-center" />
                <div className="bg-[url('/images/comingSoon/grafittiMan.jpeg')] bg-cover bg-no-repeat bg-[position:55%_40%] md:bg-center" />
            </div>

            {/* Top Rip */}
            <img
                src="/images/comingSoon/topHalfRip3.svg"
                className="absolute top-0 left-0 w-full z-30 pointer-events-none"
            />

            {/* Bottom Rip */}
            <img
                src="/images/comingSoon/bottomHalfRip3.svg"
                className="absolute bottom-0 left-0 w-full z-30 pointer-events-none"
            />

            {/* Content */}
            <div className="relative z-40 flex flex-col items-center justify-center h-screen gap-4 px-4">
                <div>

                        <img
                        src="/svg/beastLocker.svg"
                        alt="Logo"
                        className="w-[95vw] sm:w-[55vw] lg:w-[45vw] max-w-[900px] h-auto pr-5"
                        />
                </div>

                <div className="text-center mb-2 md:mb-3">
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#27F2EB] tracking-tighter leading-none animate-slide-in-right">
                        COMING SOON
                    </h2>

                    <div className="w-28 h-1 bg-[#27F2EB] mx-auto mt-4 animate-expand"></div>
                </div>
                <a href="/home">
                    <p className="text-sm md:text-base text-gray-300 mb-4 md:mb-6 animate-fade-in-up animation-delay-800">
                        2026
                    </p>
                </a>
                <div className="flex gap-4 justify-center animate-fade-in-up animation-delay-1000 mb-2 md:mb-4">
                    <a href="#" className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/30 rounded-full text-white hover:bg-[#27F2EB] hover:text-black hover:scale-110 hover:-translate-y-1 transition-all">
                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                        </svg>
                    </a>
                    <a href="#" className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/30 rounded-full text-white hover:bg-[#27F2EB] hover:text-black hover:scale-110 hover:-translate-y-1 transition-all">
                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                    </a>
                    <a href="#" className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/30 rounded-full text-white hover:bg-[#27F2EB] hover:text-black hover:scale-110 hover:-translate-y-1 transition-all">
                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
}