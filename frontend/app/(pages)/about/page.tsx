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

                <div className="w-full max-w-[1790px] mx-auto px-4 pt-4 md:px-0 md:pt-12">
                    <div className="relative w-full overflow-hidden h-[550px] md:h-auto md:aspect-[1790/806]">
                        <div className="absolute inset-0 origin-center scale-[1.78] translate-y-[-15%] md:scale-100 md:translate-y-0">
                            <Image
                                src="/images/hero/aboutUs.jpeg"
                                alt="Only for the motivated"
                                fill
                                className="object-cover object-center"
                            />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <h1 className="px-4 text-center font-GemunuExtraBold text-5xl uppercase leading-tight tracking-wider text-white md:text-[128px]">
                                ONLY FOR THE<br className="md:hidden" /> MOTIVATED
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
                                WELCOME TO BEAST LOCKER
                            </h2>
                            <p>
                                At Beast Locker, we don't just make gym clothes — we craft tools for transformation. Whether you're stepping into the gym for the first time or crushing personal records on the daily, our gear is designed to fuel your drive. Beast Locker stands for strength, grit, and relentless progression. When you wear our brand, you're not just wearing apparel — you're making a statement. You're choosing to show up, push harder, and rise above.
                            </p>
                        </div>

                        <div>
                            <h2 className="uppercase tracking-[0.15em]  mb-4 text-black">
                                OUR MISSION
                            </h2>
                            <p className="mb-4">
                                Our mission is simple: to empower the everyday athlete. We believe fitness isn't just about looks — it's about mindset. Beast Locker exists to inspire confidence, elevate performance, and support your journey through high-quality, durable, and stylish athletic wear. We design for those who train with purpose, move with intensity, and chase self-improvement every damn day.
                            </p>
                            <p>
                                Every detail in our clothing is intentional. From breathable, sweat-wicking fabrics to seamless stretch zones and reinforced stitching — our gear is built to last and made to move. Whether you're in the middle of a brutal deadlift session, hitting a new sprint PR, or flowing through a full-body calisthenics workout, Beast Locker keeps you locked in and distraction-free. We test each product through real-world workouts, gathering feedback from athletes, trainers, and fitness lovers to ensure our pieces live up to the Beast standard. When you're pushing your limits, you need gear that won't hold you back.
                            </p>
                        </div>

                        <div className="w-full h-[150px] md:h-[220px] relative my-12">
                            <Image
                                src="/images/banners/dog.jpeg"
                                alt="Separator"
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div>
                            <p className="mb-4">
                                We believe gymwear should be as bold as your goals. Our limited drops feature edgy designs, unique textures, and colorways that stand out. Beast Locker collections are built in small batches to keep your fit exclusive.
                            </p>
                            <p>
                                We source premium-grade fabrics that are both sustainable and high-performance. Think buttery-soft compression blends, antibacterial mesh zones, and feather-light mobility fabrics. Our stitching is built to take on weight-room wear and high-impact movement without compromise. Beast Locker means gear you can trust — even when you're drenched in sweat, deep in the grind.
                            </p>
                        </div>

                        <div>
                            <h2 className="uppercase tracking-[0.15em]  mb-4 ">
                                MADE BY ATHLETES, FOR ATHLETES
                            </h2>
                            <p className="mb-4">
                                We're not some boardroom brand. Beast Locker was born in real gyms, during real workouts, by real people who live the fitness lifestyle. We design with experience, purpose, and feedback from a tribe of lifters, sprinters, yogis, and fighters. You don't have to be a pro athlete — just someone who gives a damn about showing up stronger than yesterday.
                            </p>
                            <p>
                                Beast Locker is more than threads and logos. It's a mindset. A reminder that nothing is handed to you — everything is earned. When you wear Beast Locker, you wear the grind, the discipline, the pain, and the pride. You represent the few who show up when no one's watching. We celebrate every rep, every drop of sweat, every small win. Whether you're training in your garage, a local gym, or on the competition floor — we've got your back.
                            </p>
                        </div>

                        <div className="w-full h-[150px] md:h-[220px] relative my-12">
                            <Image
                                src="/images/banners/dog.jpeg"
                                alt="Separator"
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div>
                            <p className="mb-8">
                                Tag us. Train with us. Grow with us.<br />
                                Our community is filled with beasts of all kinds — from beginners transforming their lives to elite athletes pushing the edge. We highlight real stories, real hustle, and real progress.<br />
                                We don't do fake. We don't do fluff.<br />
                                Just passion, strength, and the relentless pursuit of better.
                            </p>
                            <p className="uppercase tracking-[0.15em]">
                                JOIN THE LOCKER
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}