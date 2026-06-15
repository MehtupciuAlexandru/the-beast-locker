import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/Navbar";

const categories = [
    {
        title: "BOX",
        image: "/images/categories/BOXING.jpg",
        link: "/products?collection=box",
        objectPosition: "50% 25%",
    },
    {
        title: "KICKBOX",
        image: "/images/categories/KICKBOXING.jpg",
        link: "/products?collection=kickbox",
        objectPosition: "50% 15%",
    },
    {
        title: "MMA",
        image: "/images/categories/MMA.jpg",
        link: "/products?collection=mma",
        objectPosition: "50% 40%",
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
                            className="relative w-full lg:flex-1 h-[265px] lg:h-[566px] overflow-hidden block"
                        >
                            <Image
                                src={cat.image}
                                alt={cat.title}
                                fill
                                unoptimized
                                className="object-cover"
                                style={{ objectPosition: cat.objectPosition }}
                            />

                            <div className="absolute inset-0 bg-black/40" />

                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                                <h2 className="text-white text-2xl sm:text-3xl font-GemunuExtraBold tracking-widest uppercase">
                                    {cat.title}
                                </h2>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
            <Footer />
        </>
    );
}