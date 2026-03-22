import Image from "next/image";

export default function Story() {
    return (
        <section className="w-full flex justify-center bg-white block md:hidden">
            {/* Container */}
            <div className="relative w-full max-w-[360px] h-[655px] md:max-w-[500px] md:h-[750px] mt-10 mb-10">

                {/* Background */}
                <Image
                    src="/images/banners/bannerStory.jpeg"
                    alt=""
                    fill
                    className="object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/70" />

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center text-center text-white px-6 py-8 h-full">

                    {/* Title */}
                    <h2 className="uppercase font-bold tracking-widest text-xl font-semibold md:text-2xl leading-tight">
                        RESERVED ONLY <br />
                        FOR THE <br />
                        MOTIVATED
                    </h2>

                    {/* Subtitle */}
                    <h3 className="mt-4 text-[14px] md:text-xs font-semibold tracking-wide">
                        EVERYTHING YOU NEED TO KNOW TO GET STARTED
                    </h3>

                    {/* Paragraph */}
                    <p className="mt-4 text-[15px] md:text-sm leading-relaxed font-semibold max-w-[280px] md:max-w-[360px]">
                        Deciding to get into shape may be one of the best things you can do for your health.
                        A physical regimen that involves strength training and conditioning not only reduces
                        chronic disease but also improves your balance and coordination. If you're unsure where
                        to begin consider joining MMA for beginners. As a new hobby, it is one of the most
                        rewarding and exciting things to do.
                        <br /><br />
                        In this guide, we set you up on everything that you need to know before starting MMA training.
                    </p>

                    {/* Button */}
                    <button
                        type="button"
                        className="mt-auto bg-white text-black px-6 py-3 text-xs font-semibold tracking-widest flex items-center gap-2 hover:bg-black hover:text-white border border-white transition"
                    >
                        CITEȘTE MAI MULTE
                        <span>→</span>
                    </button>

                </div>
            </div>

        </section>
    );
}