import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/footer";
import ProductDetails from "@/sections/products/ProductDetails";
import {getProductBySlug, getProducts} from "@/lib/api/products";
import RecentlyViewed from "@/sections/products/RecentlyViewed";

export default async function ProductPage(
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    const product = await getProductBySlug(slug);
    const products = await getProducts();

    if (!product) {
        return <div>Product not found</div>;
    }

    return (
        <>
            <Navbar />
            <ProductDetails product={product} />
            <RecentlyViewed products={products} />
            <Footer />
        </>
    );
}