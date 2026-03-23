import { ProductPreview } from "@/types/product";

type ProductsQuery = {
    sizes: string[];
    colors: string[];
    inStock: boolean;
    sort: string;
};

export async function getProducts(query: ProductsQuery): Promise<ProductPreview[]> {
    console.log("QUERY →", query);

    return [
        {
            id: "1",
            name: "Tank Top Black",
            slug: "tank-top-black",
            image: "/images/products/tankTopProduct.jpeg",
            price: 259,
        },

        {
            id: "2",
            name: "Gloves",
            slug: "gloves",
            image: "/images/products/glovesProduct.jpeg",
            price: 259,
        },

        {
            id: "3",
            name: "Tank Top Black",
            slug: "tank-top-black",
            image: "/images/products/tankTopProduct.jpeg",
            price: 259,
        },
    ];
}