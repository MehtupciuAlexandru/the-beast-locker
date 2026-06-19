import { getProductsForListing } from "@/lib/api/search";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const PAGE_SIZE = 100;

type ProductStockResult = {
    slug: string;
    variants: {
        stockLevel: string;
    }[];
};

type ProductStockPage = {
    totalItems: number;
    items: ProductStockResult[];
};

async function getProductStockPage(
    skip: number
): Promise<ProductStockPage> {
    if (!API_URL) {
        throw new Error("NEXT_PUBLIC_API_URL is not defined");
    }

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: `
                query GetProductStockLevels(
                    $skip: Int!
                    $take: Int!
                ) {
                    products(
                        options: {
                            skip: $skip
                            take: $take
                        }
                    ) {
                        totalItems
                        items {
                            slug
                            variants {
                                stockLevel
                            }
                        }
                    }
                }
            `,
            variables: {
                skip,
                take: PAGE_SIZE,
            },
        }),
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error(
            `Failed to fetch product stock: ${response.status}`
        );
    }

    const json = await response.json();

    if (json.errors) {
        throw new Error(json.errors[0].message);
    }

    return {
        totalItems: json.data?.products?.totalItems || 0,
        items: json.data?.products?.items || [],
    };
}

async function getProductStockMap() {
    const products: ProductStockResult[] = [];
    let skip = 0;
    let totalItems = 0;

    do {
        const page = await getProductStockPage(skip);

        products.push(...page.items);
        totalItems = page.totalItems;

        if (page.items.length === 0) {
            break;
        }

        skip += PAGE_SIZE;
    } while (skip < totalItems);

    return new Map<string, string[]>(
        products.map((product) => [
            product.slug,
            product.variants.map(
                (variant) => variant.stockLevel
            ),
        ])
    );
}

export async function getProducts(
    collectionSlug?: string,
    searchTerm?: string
) {
    const products = await getProductsForListing(
        collectionSlug,
        searchTerm
    );

    const stockMap = await getProductStockMap();

    return products.map((product: any) => {
        const stockLevels =
            stockMap.get(product.slug) || [];

        const inStock =
            stockLevels.length === 0 ||
            stockLevels.some(
                (stockLevel) =>
                    stockLevel !== "OUT_OF_STOCK"
            );

        return {
            ...product,
            inStock,
        };
    });
}

export async function getProductBySlug(slug: string) {
    if (!API_URL) {
        throw new Error(
            "NEXT_PUBLIC_API_URL is not defined"
        );
    }

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: `
                query GetProduct($slug: String!) {
                    products(
                        options: {
                            filter: {
                                slug: {
                                    eq: $slug
                                }
                            }
                            take: 1
                        }
                    ) {
                        items {
                            id
                            name
                            slug
                            description
                            featuredAsset {
                                preview
                            }
                            assets {
                                preview
                            }
                            variants {
                                id
                                name
                                priceWithTax
                                stockLevel
                                featuredAsset {
                                    preview
                                }
                                assets {
                                    preview
                                }
                                options {
                                    id
                                    name
                                    code
                                    group {
                                        id
                                        name
                                        code
                                    }
                                }
                            }
                            collections {
                                id
                                name
                                slug
                            }
                            customFields {
                                seoTitle
                                seoDescription
                                searchKeywords
                            }
                        }
                    }
                }
            `,
            variables: {
                slug,
            },
        }),
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error(
            `Failed to fetch product: ${response.status}`
        );
    }

    const json = await response.json();

    if (json.errors) {
        throw new Error(json.errors[0].message);
    }

    const product =
        json?.data?.products?.items?.[0];

    if (!product) {
        return null;
    }

    const variants =
        product.variants?.map((variant: any) => ({
            id: variant.id,
            name: variant.name,
            price:
                (variant.priceWithTax || 0) / 100,
            stockLevel: variant.stockLevel,
            inStock:
                variant.stockLevel !==
                "OUT_OF_STOCK",
            image:
                variant.featuredAsset?.preview ||
                "",
            gallery:
                variant.assets?.map(
                    (asset: any) => asset.preview
                ) || [],
            options:
                variant.options?.map(
                    (option: any) => ({
                        id: option.id,
                        name: option.name,
                        code: option.code,
                        groupName:
                        option.group?.name,
                        groupCode:
                        option.group?.code,
                    })
                ) || [],
        })) || [];

    const firstAvailableVariant =
        variants.find(
            (variant: any) => variant.inStock
        ) || variants[0];

    const inStock = variants.some(
        (variant: any) => variant.inStock
    );

    return {
        id: product.id,
        variantId: firstAvailableVariant?.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        image:
            product.featuredAsset?.preview || "",
        gallery:
            product.assets?.map(
                (asset: any) => asset.preview
            ) || [],
        price:
            firstAvailableVariant?.price || 0,
        inStock,
        variants,
        collections:
            product.collections || [],
        seoTitle:
            product.customFields?.seoTitle ||
            "",
        seoDescription:
            product.customFields
                ?.seoDescription || "",
        searchKeywords:
            product.customFields
                ?.searchKeywords || "",
    };
}