import ProductsLayout from "@/sections/products/ProductsLayout";
import Navbar from "@/components/layout/Navbar";
import RecentlyViewed from "@/sections/products/RecentlyViewed";
import Footer from "@/components/layout/footer";
import { getProducts } from "@/lib/api/products";

type ProductsPageProps = {
    searchParams: Promise<{
        collection?: string;
    }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
    const params = await searchParams;
    const collectionSlug = params?.collection;

    const products = await getProducts(collectionSlug);

    const title =
        collectionSlug === "equipment"
            ? "Echipamente"
            : collectionSlug === "clothes"
                ? "Îmbrăcăminte"
                : "Explorează";

    return (
        <>
            <Navbar />
            <ProductsLayout products={products} title={title} />
            <RecentlyViewed products={products} />
            <Footer />
        </>
    );
}