export type ProductPreview = {
    id: string
    name: string
    slug: string
    image: string
    price: number
}

export type Product = {
    id: string
    name: string
    slug: string
    description?: string
    images: string[]
    price: number
}