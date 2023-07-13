import { NextRequest, NextResponse } from "next/server";

export const products = {
    _embedded: {
        products: [
            {
                name: "Intelligent Aluminum Car",
                id: 1,
                variants: [
                    {
                        id: 1,
                        price: 189,
                    },
                    {
                        id: 2,
                        price: 667,
                    },
                    {
                        id: 3,
                        price: 818,
                    },
                    {
                        id: 4,
                        price: 899,
                    },
                    {
                        id: 5,
                        price: 657,
                    },
                    {
                        id: 6,
                        price: 758,
                    },
                    {
                        id: 7,
                        price: 624,
                    },
                    {
                        id: 8,
                        price: 895,
                    },
                    {
                        id: 9,
                        price: 863,
                    },
                    {
                        id: 10,
                        price: 831,
                    },
                ],
                slug: null,
                brand: null,
                shortDescription: "Games",
                thumbnail: "https://i.ibb.co/BVzsqvz/10.webp",
                reviewCount: 0,
                reviewScore: null,
                category: {
                    id: 8,
                },
                description: "Heavy Duty Steel Keyboard",
                _links: {
                    self: {
                        href: "http://localhost:8080/api/products/1",
                    },
                    product: {
                        href: "http://localhost:8080/api/products/1{?projection}",
                        templated: true,
                    },
                    brand: {
                        href: "http://localhost:8080/api/products/1/brand",
                    },
                    variants: {
                        href: "http://localhost:8080/api/products/1/variants{?projection}",
                        templated: true,
                    },
                    category: {
                        href: "http://localhost:8080/api/products/1/category",
                    },
                },
            },
            {
                name: "Practical Silk Chair",
                id: 2,
                variants: [],
                slug: null,
                brand: null,
                shortDescription: "Home",
                thumbnail: "https://i.ibb.co/yPJjB3r/top6.webp",
                reviewCount: 0,
                reviewScore: null,
                category: {
                    id: 7,
                },
                description: "Small Aluminum Wallet",
                _links: {
                    self: {
                        href: "http://localhost:8080/api/products/2",
                    },
                    product: {
                        href: "http://localhost:8080/api/products/2{?projection}",
                        templated: true,
                    },
                    brand: {
                        href: "http://localhost:8080/api/products/2/brand",
                    },
                    variants: {
                        href: "http://localhost:8080/api/products/2/variants{?projection}",
                        templated: true,
                    },
                    category: {
                        href: "http://localhost:8080/api/products/2/category",
                    },
                },
            },
            {
                name: "Small Wool Bag",
                id: 3,
                variants: [],
                slug: null,
                brand: null,
                shortDescription: "Computers",
                thumbnail: "https://i.ibb.co/5F3nWv6/7.webp",
                reviewCount: 0,
                reviewScore: null,
                category: {
                    id: 10,
                },
                description: "Fantastic Marble Gloves",
                _links: {
                    self: {
                        href: "http://localhost:8080/api/products/3",
                    },
                    product: {
                        href: "http://localhost:8080/api/products/3{?projection}",
                        templated: true,
                    },
                    brand: {
                        href: "http://localhost:8080/api/products/3/brand",
                    },
                    variants: {
                        href: "http://localhost:8080/api/products/3/variants{?projection}",
                        templated: true,
                    },
                    category: {
                        href: "http://localhost:8080/api/products/3/category",
                    },
                },
            },
            {
                name: "Rustic Bronze Wallet",
                id: 4,
                variants: [],
                slug: null,
                brand: null,
                shortDescription: "Sports",
                thumbnail: "https://i.ibb.co/Ycz8hkV/6.webp",
                reviewCount: 0,
                reviewScore: null,
                category: {
                    id: 15,
                },
                description: "Mediocre Wooden Coat",
                _links: {
                    self: {
                        href: "http://localhost:8080/api/products/4",
                    },
                    product: {
                        href: "http://localhost:8080/api/products/4{?projection}",
                        templated: true,
                    },
                    brand: {
                        href: "http://localhost:8080/api/products/4/brand",
                    },
                    variants: {
                        href: "http://localhost:8080/api/products/4/variants{?projection}",
                        templated: true,
                    },
                    category: {
                        href: "http://localhost:8080/api/products/4/category",
                    },
                },
            },
            {
                name: "Heavy Duty Paper Bottle",
                id: 5,
                variants: [],
                slug: null,
                brand: null,
                shortDescription: "Kids & Sports",
                thumbnail: "https://i.ibb.co/qdfB3s6/2.webp",
                reviewCount: 0,
                reviewScore: null,
                category: {
                    id: 17,
                },
                description: "Mediocre Wooden Shirt",
                _links: {
                    self: {
                        href: "http://localhost:8080/api/products/5",
                    },
                    product: {
                        href: "http://localhost:8080/api/products/5{?projection}",
                        templated: true,
                    },
                    brand: {
                        href: "http://localhost:8080/api/products/5/brand",
                    },
                    variants: {
                        href: "http://localhost:8080/api/products/5/variants{?projection}",
                        templated: true,
                    },
                    category: {
                        href: "http://localhost:8080/api/products/5/category",
                    },
                },
            },
            {
                name: "Ergonomic Leather Plate",
                id: 6,
                variants: [],
                slug: null,
                brand: null,
                shortDescription: "Movies & Sports",
                thumbnail: "https://i.ibb.co/xgZWmdq/8.jpg",
                reviewCount: 0,
                reviewScore: null,
                category: {
                    id: 12,
                },
                description: "Mediocre Iron Plate",
                _links: {
                    self: {
                        href: "http://localhost:8080/api/products/6",
                    },
                    product: {
                        href: "http://localhost:8080/api/products/6{?projection}",
                        templated: true,
                    },
                    brand: {
                        href: "http://localhost:8080/api/products/6/brand",
                    },
                    variants: {
                        href: "http://localhost:8080/api/products/6/variants{?projection}",
                        templated: true,
                    },
                    category: {
                        href: "http://localhost:8080/api/products/6/category",
                    },
                },
            },
            {
                name: "Mediocre Paper Bag",
                id: 7,
                variants: [],
                slug: null,
                brand: null,
                shortDescription: "Computers",
                thumbnail: "https://i.ibb.co/TTS9wY4/9.webp",
                reviewCount: 0,
                reviewScore: null,
                category: {
                    id: 10,
                },
                description: "Small Copper Table",
                _links: {
                    self: {
                        href: "http://localhost:8080/api/products/7",
                    },
                    product: {
                        href: "http://localhost:8080/api/products/7{?projection}",
                        templated: true,
                    },
                    brand: {
                        href: "http://localhost:8080/api/products/7/brand",
                    },
                    variants: {
                        href: "http://localhost:8080/api/products/7/variants{?projection}",
                        templated: true,
                    },
                    category: {
                        href: "http://localhost:8080/api/products/7/category",
                    },
                },
            },
            {
                name: "Ergonomic Cotton Pants",
                id: 8,
                variants: [],
                slug: null,
                brand: null,
                shortDescription: "Shoes",
                thumbnail: "https://i.ibb.co/TTS9wY4/9.webp",
                reviewCount: 0,
                reviewScore: null,
                category: {
                    id: 18,
                },
                description: "Gorgeous Cotton Coat",
                _links: {
                    self: {
                        href: "http://localhost:8080/api/products/8",
                    },
                    product: {
                        href: "http://localhost:8080/api/products/8{?projection}",
                        templated: true,
                    },
                    brand: {
                        href: "http://localhost:8080/api/products/8/brand",
                    },
                    variants: {
                        href: "http://localhost:8080/api/products/8/variants{?projection}",
                        templated: true,
                    },
                    category: {
                        href: "http://localhost:8080/api/products/8/category",
                    },
                },
            },
            {
                name: "Aerodynamic Concrete Plate",
                id: 9,
                variants: [],
                slug: null,
                brand: null,
                shortDescription: "Grocery",
                thumbnail: "https://i.ibb.co/qdfB3s6/2.webp",
                reviewCount: 0,
                reviewScore: null,
                category: {
                    id: 17,
                },
                description: "Durable Leather Watch",
                _links: {
                    self: {
                        href: "http://localhost:8080/api/products/9",
                    },
                    product: {
                        href: "http://localhost:8080/api/products/9{?projection}",
                        templated: true,
                    },
                    brand: {
                        href: "http://localhost:8080/api/products/9/brand",
                    },
                    variants: {
                        href: "http://localhost:8080/api/products/9/variants{?projection}",
                        templated: true,
                    },
                    category: {
                        href: "http://localhost:8080/api/products/9/category",
                    },
                },
            },
            {
                name: "Sleek Cotton Keyboard",
                id: 10,
                variants: [],
                slug: null,
                brand: null,
                shortDescription: "Automotive, Grocery & Industrial",
                thumbnail: "https://i.ibb.co/TTS9wY4/9.webp",
                reviewCount: 0,
                reviewScore: null,
                category: {
                    id: 3,
                },
                description: "Synergistic Bronze Table",
                _links: {
                    self: {
                        href: "http://localhost:8080/api/products/10",
                    },
                    product: {
                        href: "http://localhost:8080/api/products/10{?projection}",
                        templated: true,
                    },
                    brand: {
                        href: "http://localhost:8080/api/products/10/brand",
                    },
                    variants: {
                        href: "http://localhost:8080/api/products/10/variants{?projection}",
                        templated: true,
                    },
                    category: {
                        href: "http://localhost:8080/api/products/10/category",
                    },
                },
            },
            {
                name: "Heavy Duty Steel Pants",
                id: 11,
                variants: [],
                slug: null,
                brand: null,
                shortDescription: "Sports",
                thumbnail: "https://i.ibb.co/1r28gMk/1.webp",
                reviewCount: 0,
                reviewScore: null,
                category: {
                    id: 7,
                },
                description: "Awesome Marble Bag",
                _links: {
                    self: {
                        href: "http://localhost:8080/api/products/11",
                    },
                    product: {
                        href: "http://localhost:8080/api/products/11{?projection}",
                        templated: true,
                    },
                    brand: {
                        href: "http://localhost:8080/api/products/11/brand",
                    },
                    variants: {
                        href: "http://localhost:8080/api/products/11/variants{?projection}",
                        templated: true,
                    },
                    category: {
                        href: "http://localhost:8080/api/products/11/category",
                    },
                },
            },
            {
                name: "Fantastic Plastic Table",
                id: 12,
                variants: [],
                slug: null,
                brand: null,
                shortDescription: "Grocery & Outdoors",
                thumbnail: "https://i.ibb.co/5F3nWv6/7.webp",
                reviewCount: 0,
                reviewScore: null,
                category: {
                    id: 16,
                },
                description: "Synergistic Aluminum Computer",
                _links: {
                    self: {
                        href: "http://localhost:8080/api/products/12",
                    },
                    product: {
                        href: "http://localhost:8080/api/products/12{?projection}",
                        templated: true,
                    },
                    brand: {
                        href: "http://localhost:8080/api/products/12/brand",
                    },
                    variants: {
                        href: "http://localhost:8080/api/products/12/variants{?projection}",
                        templated: true,
                    },
                    category: {
                        href: "http://localhost:8080/api/products/12/category",
                    },
                },
            },
            {
                name: "Sleek Wool Gloves",
                id: 13,
                variants: [],
                slug: null,
                brand: null,
                shortDescription: "Clothing",
                thumbnail: "https://i.ibb.co/zmw8xFY/top7.webp",
                reviewCount: 0,
                reviewScore: null,
                category: {
                    id: 14,
                },
                description: "Durable Cotton Car",
                _links: {
                    self: {
                        href: "http://localhost:8080/api/products/13",
                    },
                    product: {
                        href: "http://localhost:8080/api/products/13{?projection}",
                        templated: true,
                    },
                    brand: {
                        href: "http://localhost:8080/api/products/13/brand",
                    },
                    variants: {
                        href: "http://localhost:8080/api/products/13/variants{?projection}",
                        templated: true,
                    },
                    category: {
                        href: "http://localhost:8080/api/products/13/category",
                    },
                },
            },
            {
                name: "Awesome Linen Plate",
                id: 14,
                variants: [],
                slug: null,
                brand: null,
                shortDescription: "Books & Kids",
                thumbnail: "https://i.ibb.co/yPJjB3r/top6.webp",
                reviewCount: 0,
                reviewScore: null,
                category: {
                    id: 15,
                },
                description: "Small Marble Watch",
                _links: {
                    self: {
                        href: "http://localhost:8080/api/products/14",
                    },
                    product: {
                        href: "http://localhost:8080/api/products/14{?projection}",
                        templated: true,
                    },
                    brand: {
                        href: "http://localhost:8080/api/products/14/brand",
                    },
                    variants: {
                        href: "http://localhost:8080/api/products/14/variants{?projection}",
                        templated: true,
                    },
                    category: {
                        href: "http://localhost:8080/api/products/14/category",
                    },
                },
            },
            {
                name: "Heavy Duty Wool Car",
                id: 15,
                variants: [],
                slug: null,
                brand: null,
                shortDescription: "Beauty & Movies",
                thumbnail: "https://i.ibb.co/5F3nWv6/7.webp",
                reviewCount: 0,
                reviewScore: null,
                category: {
                    id: 4,
                },
                description: "Synergistic Concrete Keyboard",
                _links: {
                    self: {
                        href: "http://localhost:8080/api/products/15",
                    },
                    product: {
                        href: "http://localhost:8080/api/products/15{?projection}",
                        templated: true,
                    },
                    brand: {
                        href: "http://localhost:8080/api/products/15/brand",
                    },
                    variants: {
                        href: "http://localhost:8080/api/products/15/variants{?projection}",
                        templated: true,
                    },
                    category: {
                        href: "http://localhost:8080/api/products/15/category",
                    },
                },
            },
            {
                name: "Lightweight Rubber Watch",
                id: 16,
                variants: [],
                slug: null,
                brand: null,
                shortDescription: "Music",
                thumbnail: "https://i.ibb.co/qdfB3s6/2.webp",
                reviewCount: 0,
                reviewScore: null,
                category: {
                    id: 8,
                },
                description: "Durable Aluminum Lamp",
                _links: {
                    self: {
                        href: "http://localhost:8080/api/products/16",
                    },
                    product: {
                        href: "http://localhost:8080/api/products/16{?projection}",
                        templated: true,
                    },
                    brand: {
                        href: "http://localhost:8080/api/products/16/brand",
                    },
                    variants: {
                        href: "http://localhost:8080/api/products/16/variants{?projection}",
                        templated: true,
                    },
                    category: {
                        href: "http://localhost:8080/api/products/16/category",
                    },
                },
            },
            {
                name: "Durable Iron Bench",
                id: 17,
                variants: [],
                slug: null,
                brand: null,
                shortDescription: "Automotive",
                thumbnail: "https://i.ibb.co/zPDcCQY/top4.webp",
                reviewCount: 0,
                reviewScore: null,
                category: {
                    id: 18,
                },
                description: "Small Aluminum Wallet",
                _links: {
                    self: {
                        href: "http://localhost:8080/api/products/17",
                    },
                    product: {
                        href: "http://localhost:8080/api/products/17{?projection}",
                        templated: true,
                    },
                    brand: {
                        href: "http://localhost:8080/api/products/17/brand",
                    },
                    variants: {
                        href: "http://localhost:8080/api/products/17/variants{?projection}",
                        templated: true,
                    },
                    category: {
                        href: "http://localhost:8080/api/products/17/category",
                    },
                },
            },
            {
                name: "Incredible Wooden Bag",
                id: 18,
                variants: [],
                slug: null,
                brand: null,
                shortDescription: "Toys",
                thumbnail: "https://i.ibb.co/VL1Dnv1/4.webp",
                reviewCount: 0,
                reviewScore: null,
                category: {
                    id: 7,
                },
                description: "Awesome Linen Coat",
                _links: {
                    self: {
                        href: "http://localhost:8080/api/products/18",
                    },
                    product: {
                        href: "http://localhost:8080/api/products/18{?projection}",
                        templated: true,
                    },
                    brand: {
                        href: "http://localhost:8080/api/products/18/brand",
                    },
                    variants: {
                        href: "http://localhost:8080/api/products/18/variants{?projection}",
                        templated: true,
                    },
                    category: {
                        href: "http://localhost:8080/api/products/18/category",
                    },
                },
            },
            {
                name: "Intelligent Wool Clock",
                id: 19,
                variants: [],
                slug: null,
                brand: null,
                shortDescription: "Beauty, Electronics & Tools",
                thumbnail: "https://i.ibb.co/zPDcCQY/top4.webp",
                reviewCount: 0,
                reviewScore: null,
                category: {
                    id: 15,
                },
                description: "Aerodynamic Paper Table",
                _links: {
                    self: {
                        href: "http://localhost:8080/api/products/19",
                    },
                    product: {
                        href: "http://localhost:8080/api/products/19{?projection}",
                        templated: true,
                    },
                    brand: {
                        href: "http://localhost:8080/api/products/19/brand",
                    },
                    variants: {
                        href: "http://localhost:8080/api/products/19/variants{?projection}",
                        templated: true,
                    },
                    category: {
                        href: "http://localhost:8080/api/products/19/category",
                    },
                },
            },
            {
                name: "Ergonomic Plastic Shoes",
                id: 20,
                variants: [],
                slug: null,
                brand: null,
                shortDescription: "Outdoors",
                thumbnail: "https://i.ibb.co/sJwg0YF/top1.webp",
                reviewCount: 0,
                reviewScore: null,
                category: {
                    id: 14,
                },
                description: "Rustic Marble Car",
                _links: {
                    self: {
                        href: "http://localhost:8080/api/products/20",
                    },
                    product: {
                        href: "http://localhost:8080/api/products/20{?projection}",
                        templated: true,
                    },
                    brand: {
                        href: "http://localhost:8080/api/products/20/brand",
                    },
                    variants: {
                        href: "http://localhost:8080/api/products/20/variants{?projection}",
                        templated: true,
                    },
                    category: {
                        href: "http://localhost:8080/api/products/20/category",
                    },
                },
            },
        ],
    },
    _links: {
        first: {
            href: "http://localhost:8080/api/products?projection=full&page=0&size=20",
        },
        self: {
            href: "http://localhost:8080/api/products?projection=full",
        },
        next: {
            href: "http://localhost:8080/api/products?projection=full&page=1&size=20",
        },
        last: {
            href: "http://localhost:8080/api/products?projection=full&page=4&size=20",
        },
        profile: {
            href: "http://localhost:8080/api/profile/products",
        },
        search: {
            href: "http://localhost:8080/api/products/search",
        },
    },
    page: {
        size: 20,
        totalElements: 100,
        totalPages: 5,
        number: 0,
    },
};

export async function GET(req: NextRequest) {
    return NextResponse.json(products);
}
