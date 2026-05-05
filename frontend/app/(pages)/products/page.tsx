import ProductsLayout from "@/sections/products/ProductsLayout";
import Navbar from "@/components/layout/Navbar";
import RecentlyViewed from "@/sections/products/RecentlyViewed";
import Footer from "@/components/layout/footer";
import { getProducts } from "@/lib/api/products";

type ProductsPageProps = {
    searchParams: Promise<{
        collection?: string;
        q?: string;
    }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
    const params = await searchParams;

    const collectionSlug = params?.collection;
    const searchTerm = params?.q;

    const products = await getProducts(collectionSlug, searchTerm);

    const baseTitle =
        collectionSlug === "equipment"
            ? "Echipamente"
            : collectionSlug === "clothes"
                ? "Îmbrăcăminte"
                : "Explorează";

    const title = searchTerm
        ? `Rezultate pentru "${searchTerm}"`
        : baseTitle;

    return (
        <>
            <Navbar />
            <ProductsLayout products={products} title={title} />
            <RecentlyViewed />
            <Footer />
        </>
    );
}