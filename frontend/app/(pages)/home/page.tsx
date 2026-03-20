import Hero from "@/sections/home/Hero";
import PlatformDetails from "@/sections/home/PlatformDetails";
import Categories from "@/sections/home/Categories";
import FeaturedProducts from "@/sections/home/FeaturedProducts";

export default function HomePage() {
    return (
        <>
            <Hero />
            <PlatformDetails />
            <Categories />
            <FeaturedProducts />
        </>
    );
}