import Image from "next/image"
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/Navbar";

export default function AboutUs() {
    return (
        <>
            <Navbar />

            <main className="w-full bg-white text-[#1c1c1e] min-h-screen pb-20 font-Inter">
                <div className="w-full border-b border-gray-200">
                    <div className="w-full px-4 py-4 md:py-6 text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest">
                        EXPLOREAZĂ // DESPRE NOI // CINE SUNTEM
                    </div>
                </div>

                <div className="w-full max-w-[1400px] mx-auto px-4 pt-4 md:px-0 md:pt-12">
                    <div className="relative w-full overflow-hidden h-[550px] md:h-auto md:aspect-[1790/806]">
                        <div className="absolute inset-0 origin-center scale-[1.78] translate-y-[-15%] md:scale-100 md:translate-y-0">
                            <Image
                                src="/images/hero/hero-image.png"
                                alt="Only for the motivated"
                                fill
                                className="object-cover object-center"
                            />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <h1 className="px-4 text-center font-GemunuExtraBold text-5xl uppercase leading-tight tracking-wider text-white md:text-[128px]">
                                BEAST<br className="md:hidden" /> LOCKER
                            </h1>
                        </div>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto px-6 pt-12 md:pt-20 flex flex-col items-center">
                    <div className="w-20 h-20 relative mb-12 opacity-40">
                        <Image
                            src="/logos/claw.svg"
                            alt="Beast Locker"
                            fill
                            className="object-contain"
                        />
                    </div>

                    <div className="w-full text-[15px] font-Inter md:text-[15px] leading-loose text-gray-800 space-y-10">
                        <div>
                            <h2 className="uppercase tracking-[0.15em]  mb-4 text-black">
                                DESPRE NOI
                            </h2>
                            <p>
                                De la un luptător pentru luptători. Beast Locker nu a fost creat într-un birou și nici de oameni care au descoperit sporturile de contact din spatele unui ecran. Beast Locker s-a născut din antrenamente, competiții, cantonamente și ani petrecuți în sală.
                            </p>
                        </div>

                        <div>
                            <h2 className="uppercase tracking-[0.15em]  mb-4 text-black">
                                DE CE BEAST LOCKER
                            </h2>
                            <p className="mb-4">
                                Știm cum este să îți cauți prima pereche de mănuși și să nu știi ce să alegi. Știm cum este să investești bani într-un echipament care arată bine în poze, dar nu rezistă la antrenamente. Știm cum este să testezi zeci de produse până găsești ceva care chiar funcționează. Tocmai de aceea am construit Beast Locker.
                            </p>
                            <p>
                                Ne-am propus să construim un brand care reprezintă disciplina, progresul și mentalitatea celor care aleg să intre în sală atunci când majoritatea aleg confortul.
                            </p>
                        </div>

                        <div className="w-full h-[150px] md:h-[220px] relative my-12">
                            <Image
                                src="/images/banners/dogNEW.jpeg"
                                alt="Separator"
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div>
                            <p className="mb-4">
                                Fiecare produs Beast Locker este dezvoltat pornind de la experiența reală a sportivilor care practică box, kickboxing și MMA. Înainte să ajungă în mâinile clienților noștri, produsele sunt testate în condiții reale de antrenament, sparring și competiție.
                            </p>
                            <p>
                                Pentru noi, testarea nu înseamnă câteva lovituri într-un sac. Înseamnă sute de ore petrecute în sală, mii de lovituri și experiență acumulată în ring și în cușcă. De aceea fiecare detaliu contează: protecția, confortul, susținerea, rezistența și senzația pe care o ai atunci când echipamentul devine o extensie naturală a corpului tău.
                            </p>
                        </div>

                        <div>
                            <h2 className="uppercase tracking-[0.15em]  mb-4 ">
                                COMUNITATEA NOASTRĂ
                            </h2>
                            <p className="mb-4">
                                Astăzi, Beast Locker este o comunitate construită în jurul oamenilor care aleg munca în locul scuzelor, disciplina în locul confortului și progresul în locul stagnării.
                            </p>
                            <p>
                                Dacă ești aici, probabil că și tu faci parte dintre ei.
                            </p>
                        </div>

                        <div className="w-full h-[150px] md:h-[220px] relative my-12">
                            <Image
                                src="/images/banners/dogNEW.jpeg"
                                alt="Separator"
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div>
                            <p className="mb-8">
                                Bine ai venit în Beast Locker.
                            </p>
                            <p className="uppercase tracking-[0.15em]">
                                BINE AI VENIT ÎN BEAST LOCKER
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}