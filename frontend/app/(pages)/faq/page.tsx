import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/footer";
import ExploreMenu from "@/components/layout/ExploreMenu";

export default function FAQ() {
    return (
        <div className="flex min-h-screen w-full flex-col bg-white">
            <Navbar />

            <div className="w-full border-b border-gray-200">
                <div className="w-full px-6 md:px-10 py-6 text-[15px] font-Inter text-[#6a6a6a] uppercase tracking-widest">
                    EXPLOREAZĂ // DESPRE NOI // ÎNTREBĂRI FRECVENTE
                </div>
            </div>

            <main className="flex flex-col md:flex-row w-full flex-1">
                <div className="w-full md:w-[320px] lg:w-[350px] shrink-0 bg-[#f0f4f8]">
                    <ExploreMenu />
                </div>

                <section id="faq" className="flex-1 w-full pb-20 pt-8 md:pt-12 px-6 md:px-12 lg:px-20 xl:px-32">
                    <h1 className="text-3xl md:text-4xl font-Inter text-black mb-10">
                        Întrebări frecvente
                    </h1>

                    <div className="w-full text-[15px] font-Inter leading-relaxed text-[#6a6a6a] space-y-6 max-w-5xl">

                        <div>
                            <h2 className="font-bold text-[#1c1c1E] pt-4 text-base uppercase tracking-wider">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit?
                            </h2>
                            <p className="mt-2">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </p>
                        </div>

                        <div>
                            <h2 className="font-bold text-[#1c1c1E] pt-4 text-base uppercase tracking-wider">
                                Duis aute irure dolor in reprehenderit in voluptate?
                            </h2>
                            <p className="mt-2">
                                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </p>
                        </div>

                        <div>
                            <h2 className="font-bold text-[#1c1c1E] pt-4 text-base uppercase tracking-wider">
                                Curabitur pretium tincidunt lacus nulla gravida orci a odio?
                            </h2>
                            <p className="mt-2">
                                Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida.
                            </p>
                            <p className="mt-4">
                                Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante.
                            </p>
                        </div>

                        <div>
                            <h2 className="font-bold text-[#1c1c1E] pt-4 text-base uppercase tracking-wider">
                                Donec eu libero sit amet quam egestas semper?
                            </h2>
                            <p className="mt-2">
                                Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi.
                            </p>
                        </div>

                        <div>
                            <h2 className="font-bold text-[#1c1c1E] pt-4 text-base uppercase tracking-wider">
                                Aenean fermentum, elit eget tincidunt condimentum?
                            </h2>
                            <p className="mt-2">
                                Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat.
                            </p>
                            <ul className="mt-4 list-disc space-y-1 pl-6">
                                <li>Aliquam tincidunt mauris eu risus.</li>
                                <li>Vestibulum auctor dapibus neque.</li>
                                <li>Nunc dignissim risus id metus.</li>
                                <li>Cras ornare tristique elit.</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="font-bold text-[#1c1c1E] pt-4 text-base uppercase tracking-wider">
                                Vivamus vestibulum ntulla nec ante?
                            </h2>
                            <p className="mt-2">
                                Vivamus vestibulum ntulla nec ante. Praesent in sapien. Pellentesque aliquet nibh nec urna. In nisi neque, aliquet vel, dapibus id, mattis vel, nisi. Sed pretium, ligula sollicitudin laoreet viverra, tortor libero sodales leo, eget blandit nunc tortor eu nibh.
                            </p>
                        </div>

                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}