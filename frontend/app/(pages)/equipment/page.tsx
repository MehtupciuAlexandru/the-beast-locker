import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/Navbar";

const categories = [
    {
        title: "BOX",
        // subtitle: "Echipamente concepute pentru siguranța și confortul sportivilor, indiferent de ramura sportivă",
        image: "/images/banners/competition.jpeg",
        link: "/products?collection=equipment",
    },
    {
        title: "KICKBOX",
        // subtitle: "Haine și Accesorii gândite să îți deblocheze adevăratul potențial",
        image: "/images/banners/boxers.jpeg",
        link: "/products?collection=clothes",
    },
    {
        title: "MMA",
        // subtitle: "Lucrurile mici care fac diferența",
        image: "/images/banners/train.jpeg",
        link: "/products",
    }
];

export default function Categories() {
    return (

        <>
            <Navbar />
        <section className="w-full p-4 bg-white flex justify-center">
            <div className="flex flex-col lg:flex-row gap-4 w-full max-w-full">
                {categories.map((cat, index) => (
                    <Link
                        key={index}
                        href={cat.link}
                        className="relative w-full flex-1 h-[600px] lg:h-[1133px] overflow-hidden block"
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

                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                            <h2 className="text-white text-2xl sm:text-3xl font-extrabold tracking-widest uppercase">
                                {cat.title}
                            </h2>
                            {/*<p className="text-white text-sm sm:text-base mt-2 max-w-[260px] leading-tight">*/}
                            {/*    {cat.subtitle}*/}
                            {/*</p>*/}
                        </div>
                    </Link>
                ))}
            </div>
        </section>
            <Footer />
        </>
    );
}