import Image from "next/image";
import Link from "next/link";

const categories = [
    {
        title: "ECHIPAMENT",
        subtitle: "Echipamente concepute pentru siguranța și confortul sportivilor, indiferent de ramura sportivă",
        image: "/images/banners/competition.jpeg",
        link: "/equipment",
    },
    {
        title: "ÎMBRĂCĂMINTE",
        subtitle: "Haine și Accesorii gândite să îți deblocheze adevăratul potențial",
        image: "/images/banners/train.jpeg",
        link: "/countdown",
    },
    {
        title: "ACCESORII",
        subtitle: "Lucrurile mici care fac diferența",
        image: "/images/banners/boxers.jpeg",
        link: "/countdown",
    }
];

export default function Categories() {
    return (
        <section className="flex w-full justify-center bg-white p-4 font-GemunuExtraBold">
            <div className="flex w-full max-w-full flex-col gap-4 lg:flex-row">
                {categories.map((cat, index) => (
                    <Link
                        key={index}
                        href={cat.link}
                        className="relative block h-[180px] w-full overflow-hidden lg:h-[430px] lg:flex-1"
                    >
                        <Image
                            src={cat.image}
                            alt={cat.title}
                            fill
                            unoptimized
                            className="object-cover"
                            style={{ objectPosition: "50% 30%" }}
                        />

                        <div className="absolute inset-0 bg-black/40" />

                        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
                            <h2 className="text-3xl font-GemunuExtraBold uppercase tracking-widest text-white sm:text-5xl">
                                {cat.title}
                            </h2>
                            <p className="mt-2 max-w-[260px] font-Inter text-sm leading-tight text-white sm:text-base">
                                {cat.subtitle}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}