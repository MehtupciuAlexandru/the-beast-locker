export type ProductPreview = {
    id: string;
    name: string;
    slug: string;
    image: string;
    price: number;
    inStock?: boolean;
};

export type Product = {
    id: string
    name: string
    slug: string
    description?: string
    images: string[]
    price: number
}