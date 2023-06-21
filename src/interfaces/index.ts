export interface Product {
    _id: number;
    title: string;
    isNew: boolean;
    oldPrice: string;
    price: number;
    description: string;
    brand: string;
    category: string;
    image: string;
}

export interface Category {
    id: string | undefined;
    name: string;
}

export interface User {
    id: string | undefined;
    _links: _links;
}
export interface ShippingAddress {
    id: string | number | undefined;
    name: string;
    phone: string;
    address: string;
    ward: string;
    district: string;
    province: string;
    default?: boolean;
    user?: any;
    _links?: _links;
}

export interface _links {
    self: {
        href: string;
    };
    [key: string]: {
        href: string;
    };
}

export interface ICheckout {
    id?: string | undefined;
    userId: string;
    addressId: number;
    items: ICartItem[];
    email?: string;
    note?: string;
}

export interface ICartItem {
    variantId: string | number;
    quantity: number;
    price: number;
}
