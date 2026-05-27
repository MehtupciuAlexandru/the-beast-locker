import Image from "next/image";
import Link from "next/link";

const categories = [
    {
        title: "ECHIPAMENT",
        subtitle: "Echipamente concepute pentru siguranța și confortul sportivilor, indiferent de ramura sportivă",
        image: "/images/categories/ECHIPAMENTE.jpeg",
        link: "/equipment",
        objectPositionMobile: "50% 57%",
        objectPositionDesktop: "50% 67%",
    },
    {
        title: "ÎMBRĂCĂMINTE",
        subtitle: "Haine și Accesorii gândite să îți deblocheze adevăratul potențial",
        image: "/images/categories/Imbracaminte.jpeg",
        link: "/countdown",
        objectPosition: "50% 10%",
    },
    {
        title: "ACCESORII",
        subtitle: "Lucrurile mici care fac diferența",
        image: "/images/categories/ACCESORII.jpeg",
        link: "/countdown",
        objectPosition: "50% 50%",
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
                        className="relative block h-[230px] w-full overflow-hidden lg:h-[430px] lg:flex-1"
                    >
                        {cat.objectPositionMobile && cat.objectPositionDesktop ? (
                            <>
                                <Image
                                    src={cat.image}
                                    alt={cat.title}
                                    fill
                                    unoptimized
                                    className="block object-cover lg:hidden"
                                    style={{ objectPosition: cat.objectPositionMobile }}
                                />
                                <Image
                                    src={cat.image}
                                    alt={cat.title}
                                    fill
                                    unoptimized
                                    className="hidden object-cover lg:block"
                                    style={{ objectPosition: cat.objectPositionDesktop }}
                                />
                            </>
                        ) : (
                            <Image
                                src={cat.image}
                                alt={cat.title}
                                fill
                                unoptimized
                                className="object-cover"
                                style={{ objectPosition: cat.objectPosition }}
                            />
                        )}

                        <div className="absolute inset-0 bg-black/40" />

                        <div className="absolute left-1/2 top-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 flex-col items-center px-4 text-center">
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