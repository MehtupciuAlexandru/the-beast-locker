import Hero from "@/sections/home/Hero";
import PlatformDetails from "@/sections/home/PlatformDetails";
import Categories from "@/sections/home/Categories";
import FeaturedProducts from "@/sections/home/FeaturedProducts";
import BannerSection from "@/sections/home/BannerSection";
import Story from "@/sections/home/Story";
import SocialFavorites from "@/sections/home/SocialFavorites";
import Newsletter from "@/sections/home/Newsletter";
import Footer from "@/components/layout/footer";
import BannerPopup from "@/components/bannerPopup";
import CookiesPopup from "@/components/cookiesPopups";
import { mockProducts } from "@/lib/mocks/products";


export default function HomePage() {
    return (
        <>
            <><BannerPopup/></>
            <CookiesPopup />
            <Hero />
            <PlatformDetails />
            <Categories />
            <FeaturedProducts products={mockProducts} />
            <BannerSection />
            <Story />
            <SocialFavorites items={mockProducts} />
            <Newsletter />
            <Footer />
        </>
    );
}