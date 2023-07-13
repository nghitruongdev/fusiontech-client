import { ICategory } from "types";
import { NextRequest, NextResponse } from "next/server";

const data = {
    _embedded: {
        categories: [
            {
                id: 1,
                name: "Baby, Electronics & Tools",
                slug: "0.5083464263232674B0007658JK",
                description: "Brighthurst Campus",
                image: null,
                _links: {
                    self: {
                        href: "http://localhost:8080/api/categories/1",
                    },
                    category: {
                        href: "http://localhost:8080/api/categories/1",
                    },
                    parent: {
                        href: "http://localhost:8080/api/categories/1/parent",
                    },
                    products: {
                        href: "http://localhost:8080/api/categories/1/products{?projection}",
                        templated: true,
                    },
                },
            },
            {
                id: 2,
                name: "Automotive, Jewelry & Kids",
                slug: "0.8297698204480833B000HF37YE",
                description: "Ironbarrow Campus",
                image: null,
                _links: {
                    self: {
                        href: "http://localhost:8080/api/categories/2",
                    },
                    category: {
                        href: "http://localhost:8080/api/categories/2",
                    },
                    parent: {
                        href: "http://localhost:8080/api/categories/2/parent",
                    },
                    products: {
                        href: "http://localhost:8080/api/categories/2/products{?projection}",
                        templated: true,
                    },
                },
            },
            {
                id: 3,
                name: "Grocery",
                slug: "0.96936510569349B000A3PI3G",
                description: "Iceborough Campus",
                image: null,
                _links: {
                    self: {
                        href: "http://localhost:8080/api/categories/3",
                    },
                    category: {
                        href: "http://localhost:8080/api/categories/3",
                    },
                    parent: {
                        href: "http://localhost:8080/api/categories/3/parent",
                    },
                    products: {
                        href: "http://localhost:8080/api/categories/3/products{?projection}",
                        templated: true,
                    },
                },
            },
            {
                id: 4,
                name: "Movies",
                slug: "0.03061511857569299B0000DKWL7",
                description: "Flowerlake Campus",
                image: null,
                _links: {
                    self: {
                        href: "http://localhost:8080/api/categories/4",
                    },
                    category: {
                        href: "http://localhost:8080/api/categories/4",
                    },
                    parent: {
                        href: "http://localhost:8080/api/categories/4/parent",
                    },
                    products: {
                        href: "http://localhost:8080/api/categories/4/products{?projection}",
                        templated: true,
                    },
                },
            },
            {
                id: 5,
                name: "Sports",
                slug: "0.873082626835418B0007657T6",
                description: "Ironbarrow Campus",
                image: null,
                _links: {
                    self: {
                        href: "http://localhost:8080/api/categories/5",
                    },
                    category: {
                        href: "http://localhost:8080/api/categories/5",
                    },
                    parent: {
                        href: "http://localhost:8080/api/categories/5/parent",
                    },
                    products: {
                        href: "http://localhost:8080/api/categories/5/products{?projection}",
                        templated: true,
                    },
                },
            },
            {
                id: 6,
                name: "Baby, Books & Grocery",
                slug: "0.6900866910882901B0000V3W9U",
                description: "Ostbarrow Campus",
                image: null,
                _links: {
                    self: {
                        href: "http://localhost:8080/api/categories/6",
                    },
                    category: {
                        href: "http://localhost:8080/api/categories/6",
                    },
                    parent: {
                        href: "http://localhost:8080/api/categories/6/parent",
                    },
                    products: {
                        href: "http://localhost:8080/api/categories/6/products{?projection}",
                        templated: true,
                    },
                },
            },
            {
                id: 7,
                name: "Automotive",
                slug: "0.4545092720125181B000N5FYO4",
                description: "Lakeacre Campus",
                image: null,
                _links: {
                    self: {
                        href: "http://localhost:8080/api/categories/7",
                    },
                    category: {
                        href: "http://localhost:8080/api/categories/7",
                    },
                    parent: {
                        href: "http://localhost:8080/api/categories/7/parent",
                    },
                    products: {
                        href: "http://localhost:8080/api/categories/7/products{?projection}",
                        templated: true,
                    },
                },
            },
            {
                id: 8,
                name: "Jewelry",
                slug: "0.5218908158171B0000DGJD1",
                description: "Vertapple Campus",
                image: null,
                _links: {
                    self: {
                        href: "http://localhost:8080/api/categories/8",
                    },
                    category: {
                        href: "http://localhost:8080/api/categories/8",
                    },
                    parent: {
                        href: "http://localhost:8080/api/categories/8/parent",
                    },
                    products: {
                        href: "http://localhost:8080/api/categories/8/products{?projection}",
                        templated: true,
                    },
                },
            },
            {
                id: 9,
                name: "Music",
                slug: "0.040100349601317475B0000W4I2O",
                description: "Marblewald Campus",
                image: null,
                _links: {
                    self: {
                        href: "http://localhost:8080/api/categories/9",
                    },
                    category: {
                        href: "http://localhost:8080/api/categories/9",
                    },
                    parent: {
                        href: "http://localhost:8080/api/categories/9/parent",
                    },
                    products: {
                        href: "http://localhost:8080/api/categories/9/products{?projection}",
                        templated: true,
                    },
                },
            },
            {
                id: 10,
                name: "Beauty",
                slug: "0.02473751683825265B0000DIEOI",
                description: "Falconholt Campus",
                image: null,
                _links: {
                    self: {
                        href: "http://localhost:8080/api/categories/10",
                    },
                    category: {
                        href: "http://localhost:8080/api/categories/10",
                    },
                    parent: {
                        href: "http://localhost:8080/api/categories/10/parent",
                    },
                    products: {
                        href: "http://localhost:8080/api/categories/10/products{?projection}",
                        templated: true,
                    },
                },
            },
            {
                id: 11,
                name: "Shoes",
                slug: "0.48441255683855355B000AR9G7G",
                description: "Lakeacre Campus",
                image: null,
                _links: {
                    self: {
                        href: "http://localhost:8080/api/categories/11",
                    },
                    category: {
                        href: "http://localhost:8080/api/categories/11",
                    },
                    parent: {
                        href: "http://localhost:8080/api/categories/11/parent",
                    },
                    products: {
                        href: "http://localhost:8080/api/categories/11/products{?projection}",
                        templated: true,
                    },
                },
            },
            {
                id: 12,
                name: "Jewelry & Shoes",
                slug: "0.04438971910931777B0002BXBEY",
                description: "Brookville Campus",
                image: null,
                _links: {
                    self: {
                        href: "http://localhost:8080/api/categories/12",
                    },
                    category: {
                        href: "http://localhost:8080/api/categories/12",
                    },
                    parent: {
                        href: "http://localhost:8080/api/categories/12/parent",
                    },
                    products: {
                        href: "http://localhost:8080/api/categories/12/products{?projection}",
                        templated: true,
                    },
                },
            },
            {
                id: 13,
                name: "Electronics",
                slug: "0.7008455780832048B000HU7P92",
                description: "Vertapple Campus",
                image: null,
                _links: {
                    self: {
                        href: "http://localhost:8080/api/categories/13",
                    },
                    category: {
                        href: "http://localhost:8080/api/categories/13",
                    },
                    parent: {
                        href: "http://localhost:8080/api/categories/13/parent",
                    },
                    products: {
                        href: "http://localhost:8080/api/categories/13/products{?projection}",
                        templated: true,
                    },
                },
            },
            {
                id: 14,
                name: "Toys",
                slug: "0.5417628860841893B0000DHUGW",
                description: "Iceborough Campus",
                image: null,
                _links: {
                    self: {
                        href: "http://localhost:8080/api/categories/14",
                    },
                    category: {
                        href: "http://localhost:8080/api/categories/14",
                    },
                    parent: {
                        href: "http://localhost:8080/api/categories/14/parent",
                    },
                    products: {
                        href: "http://localhost:8080/api/categories/14/products{?projection}",
                        templated: true,
                    },
                },
            },
            {
                id: 15,
                name: "Shoes & Sports",
                slug: "0.5359550428022942B000O332KS",
                description: "Vertapple Campus",
                image: null,
                _links: {
                    self: {
                        href: "http://localhost:8080/api/categories/15",
                    },
                    category: {
                        href: "http://localhost:8080/api/categories/15",
                    },
                    parent: {
                        href: "http://localhost:8080/api/categories/15/parent",
                    },
                    products: {
                        href: "http://localhost:8080/api/categories/15/products{?projection}",
                        templated: true,
                    },
                },
            },
            {
                id: 16,
                name: "Kids",
                slug: "0.9478194434467277B0000DHDW3",
                description: "Bluemeadow Campus",
                image: null,
                _links: {
                    self: {
                        href: "http://localhost:8080/api/categories/16",
                    },
                    category: {
                        href: "http://localhost:8080/api/categories/16",
                    },
                    parent: {
                        href: "http://localhost:8080/api/categories/16/parent",
                    },
                    products: {
                        href: "http://localhost:8080/api/categories/16/products{?projection}",
                        templated: true,
                    },
                },
            },
            {
                id: 17,
                name: "Sports",
                slug: "0.17068044253849113B0000DHW2M",
                description: "Falconholt Campus",
                image: null,
                _links: {
                    self: {
                        href: "http://localhost:8080/api/categories/17",
                    },
                    category: {
                        href: "http://localhost:8080/api/categories/17",
                    },
                    parent: {
                        href: "http://localhost:8080/api/categories/17/parent",
                    },
                    products: {
                        href: "http://localhost:8080/api/categories/17/products{?projection}",
                        templated: true,
                    },
                },
            },
            {
                id: 18,
                name: "Games, Grocery & Jewelry",
                slug: "0.214811808759097B00012FB6K",
                description: "Iceborough Campus",
                image: null,
                _links: {
                    self: {
                        href: "http://localhost:8080/api/categories/18",
                    },
                    category: {
                        href: "http://localhost:8080/api/categories/18",
                    },
                    parent: {
                        href: "http://localhost:8080/api/categories/18/parent",
                    },
                    products: {
                        href: "http://localhost:8080/api/categories/18/products{?projection}",
                        templated: true,
                    },
                },
            },
            {
                id: 19,
                name: "Electronics & Industrial",
                slug: "0.508766127804194B000A2O26G",
                description: "Ironbarrow Campus",
                image: null,
                _links: {
                    self: {
                        href: "http://localhost:8080/api/categories/19",
                    },
                    category: {
                        href: "http://localhost:8080/api/categories/19",
                    },
                    parent: {
                        href: "http://localhost:8080/api/categories/19/parent",
                    },
                    products: {
                        href: "http://localhost:8080/api/categories/19/products{?projection}",
                        templated: true,
                    },
                },
            },
            {
                id: 20,
                name: "Computers, Grocery & Industrial",
                slug: "0.7067408104386376B00066OELO",
                description: "Marblewald Campus",
                image: null,
                _links: {
                    self: {
                        href: "http://localhost:8080/api/categories/20",
                    },
                    category: {
                        href: "http://localhost:8080/api/categories/20",
                    },
                    parent: {
                        href: "http://localhost:8080/api/categories/20/parent",
                    },
                    products: {
                        href: "http://localhost:8080/api/categories/20/products{?projection}",
                        templated: true,
                    },
                },
            },
        ],
    },
    _links: {
        self: {
            href: "http://localhost:8080/api/categories",
        },
        profile: {
            href: "http://localhost:8080/api/profile/categories",
        },
        search: {
            href: "http://localhost:8080/api/categories/search",
        },
    },
    page: {
        size: 20,
        totalElements: 20,
        totalPages: 1,
        number: 0,
    },
};

export async function GET(req: NextRequest) {
    return NextResponse.json(data);
}
