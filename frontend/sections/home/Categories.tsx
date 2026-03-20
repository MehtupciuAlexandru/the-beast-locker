import Image from "next/image";

const categories = [
    {
        title: "URBAN",
        subtitle: "Echipament urban, versatil pentru activitățile de zi cu zi",
        image: "/images/banners/grafittiMan.jpeg",
    },
    {
        title: "COMPETITION",
        subtitle: "Echipament de competiție pentru campioni",
        image: "/images/banners/competition.jpeg",
    },
    {
        title: "TRAIN",
        subtitle: "Echipament durabil, gata pentru orice antrenament",
        image: "/images/banners/boxers.jpeg",
    }
];

export default function Categories() {
    return (
        <section className="w-full px-4 py-6 bg-white">
            <div className="flex flex-col gap-4 h-[800px] lg:h-[3050px]">
                {categories.map((cat, index) => (
                    <button
                        key={index}
                        className="relative w-full flex-1 overflow-hidden"
                    >
                        {/* Image */}
                        <Image
                            src={cat.image}
                            alt={cat.title}
                            fill
                            unoptimized
                            className="object-cover"
                            style={{ objectPosition: "50% 30%" }}
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/40" />

                        {/* Content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                            <h2 className="text-white text-2xl sm:text-3xl font-extrabold tracking-widest">
                                {cat.title}
                            </h2>
                            <p className="text-white text-sm sm:text-base mt-2 max-w-[260px] leading-tight">
                                {cat.subtitle}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </section>
    );
}