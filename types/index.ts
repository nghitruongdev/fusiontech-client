import { ListOption } from "@/hooks/useListOption";
import { Timestamp } from "@firebase/firestore";

export type ResourceName =
    | "categories"
    | "brands"
    | "products"
    | "variants"
    | "orders"
    | "users"
    | "shippingAddresses";
//todo: const {} =  API['users']()
export const API = {
    orders: () => {
        return {
            cart: {
                checkout: `cart/checkout`,
            },
        };
    },
    categories: () => {
        const name: ResourceName = "categories";
        return {
            resource: name,
        };
    },
    brands: () => {
        const name: ResourceName = "brands";
        return {
            resource: name,
        };
    },
    variants: () => {
        const name: ResourceName = "variants";
        return {
            resource: name,
            projection: {
                basic: "basic",
                withAttributes: "attributes",
                withProduct: "product",
                withProductName: "product-name",
            },
        };
    },
    products: () => {
        const name: ResourceName = "products";
        return {
            resource: name,
            projection: {
                full: "full",
            },
            countProductSold: (productId: string) =>
                `${name}/search/countProductSold?productId=${productId}`,
        };
    },
    users: () => {
        const name: ResourceName = "users";
        return {
            resource: name,
            defaultAddress: {
                update: (uid: string, aid: number) =>
                    `${name}/${uid}/defaultAddress/${aid}`,
            },
            findByFirebaseId: (id: string) =>
                `${name}/search/findByFirebaseId?firebaseId=${id}`,
            existsByEmail: (email: string) => {
                `${name}/search/existsByEmail?email=${email}`;
            },
            existsByPhoneNumber: (phone: string) => {
                `${name}/search/existsByPhoneNumber?phone=${phone}`;
            },
        };
    },
    shippingAddresses: () => {
        const name: ResourceName = "shippingAddresses";
        return {
            resource: name,
            findAllByUserId: `${name}/search/findAllByUserId`,
            defaultAddressByUserId: `${name}/search/findDefaultShippingAddressByUserId`,
        };
    },
};

export interface IProduct {
    id: string | undefined;
    name: string;
    slug: string;
    summary: string;
    description: string;
    thumbnail: string;
    features?: string[];
    specifications?: {
        [key: string]: string;
    };
    brand?: IBrand;
    category?: ICategory;
    reviewCount?: number;
    avgRating?: number;
    variants?: IVariant[] | { id: string; price: number }[];
    _links?: {
        self: {
            href: string;
        };
        product: {
            href: string;
            templated: true;
        };
        category: {
            href: string;
        };
        variants: {
            href: string;
            templated: true;
        };
        brand: {
            href: string;
        };
    };
}

export type IProductField = {
    id: string | undefined;
    name: string;
    slug: string;
    summary: string;
    description: string;
    thumbnail: string;
    features?: { value: string }[];
    specifications?: {
        key: string;
        value: string;
    }[];
} & {
    brand?: ListOption<string, ICategory>;
    category?: ListOption<string, ICategory>;
};

export type IVariant = {
    id: number;
    sku: string;
    images?: string[];
    price: number;
    /**
     * @deprecated
     */
    active?: boolean;
    availableQuantity?: number;
    product?: IProduct;
    attributes?: IAttribute[];
    _links: _links;
};

export type IAttribute = {
    id: number;
    name: string;
    value: string;
    _links: {
        self: {
            href: string;
        };
        variantAttribute: {
            href: string;
        };
        variant: {
            href: string;
            templated: true;
        };
    };
};

export type IBrand = {
    id: number;
    name: string;
    logo: string;
};

export interface ICategory {
    id: string | undefined;
    name: string;
}

/**
 * @deprecated
 */
export interface User {
    id: string | undefined;
}

export interface IUser {
    id?: number;
    firebaseUid: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    displayName?: string;
    email?: string;
    phoneNumber?: string;
    photoUrl?: string;
    dateOfBirth?: Date;
    gender?: boolean;
    defaultAddress?: ShippingAddress;
    _links: _links;
}

export interface ShippingAddress {
    id: string | undefined;
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
export interface ICart {
    id: string;
    uid: string | null;
    items?: ICartItem[];
    updatedAt?: Timestamp;
}
export interface ICartItem {
    id?: string;
    variantId: number;
    quantity: number;
    updatedAt?: Timestamp;
    /**
     * @deprecated This field is deprecated. This should be no longer contained.
     */
    price?: number;
}

export interface IOrder {
    id: string;
    total: number | undefined;
    note: string;
    email: string;
    status: string | IOrderStatus;
    purchasedAt?: string;
    userId: string;
    addressId: number;
    paymentId: number;
    payment?: {
        id: string;
        amount: number;
        paidAt: string;
        status: string;
        method: string;
    };
    _links?: _links;
}

export interface IOrderItem {
    id: string;
    price: number;
    quantity: number;
    variant: {
        id: number;
    };
    _links: _links;
}

export interface IOrderStatus {
    id: number;
    name: string;
    detailName: string;
    group:
        | "VERIFY"
        | "PROCESSING"
        | "ON_DELIVERY"
        | "COMPLETED"
        | "FAILED"
        | "CANCELLED";
    isChangeable: boolean;
}

export interface IOrderStatusGroup {
    id: number;
    name: string;
    detailName: string;
}

export enum PaymentStatus {
    CHUA_THANH_TOAN = "Chưa thanh toán",
    DA_THANH_TOAN = "Đã thanh toán",
}
export enum PaymentMethod {
    COD,
    CREDIT_CARD,
}

export interface IPayment {
    status: PaymentStatus;
}

export interface IInventory {
    id: string;
    createdBy: string;
    createdDate: string;
    lastModifiedBy?: string;
    lastModifiedDate?: string;
    totalQuantity?: number;
    items?: IInventoryDetail;
    _links?: _links;
}

export interface IInventoryDetail {
    id: string;
    quantity: number;
    variantId?: string;
    variant?: IVariant;
    inventory?: IInventory;
    _links?: _links;
}

export interface IProblemResponse {
    data: {
        title: string;
        detail: string;
    };
}

export type Page = {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
};
