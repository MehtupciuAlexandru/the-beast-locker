import BannerPopup from "@/components/bannerPopup";
import CookiesPopup from "@/components/cookiesPopups";
import Hero from "@/sections/home/Hero";
import ProductsLayout from "@/sections/products/ProductsLayout";
import { mockProducts } from "@/lib/mocks/products";
import Navbar from "@/components/layout/Navbar";
import RecentlyViewed from "@/sections/products/RecentlyViewed";
import Footer from "@/components/layout/footer";

export default function ProductsPage() {
    return (
        <>
            <Navbar />
            <ProductsLayout products={mockProducts} />
            <RecentlyViewed products={mockProducts} />
            <Footer />
        </>
        );
}
