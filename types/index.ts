import { FieldValue, Timestamp } from "@firebase/firestore";

export type ResourceName = "categories" | "variants" | "orders";

// export type Projection = {
//     categories: undefined;
//     variants: "with-attributes";
//     orders: undefined;
// };
export const resources = (name: ResourceName) => name;
export const searchAPI = {
    orders: {},
    categories: undefined,
    variants: undefined,
    products: {
        countProductSold: (productId: number) =>
            `products/search/countProductSold?productId=${productId}`,
    },
};

export const projectionAPI = {
    categories: {},
    variants: {
        withAttributes: "with-attributes",
    },
    orders: {},
};

// export type Resource<T extends ResourceName | undefined> =
//     T extends ResourceName
//         ? {
//               resource: T;
//               projection?: Projection[T];
//               search?: searchAPI[T];
//           }
//         : never;

export interface IProduct {
    id: number | string;
    name: string;
    slug: string;
    shortDescription: string;
    description: string;
    thumbnail: string;
    reviewCount?: number;
    avgRating?: number;
    brand?: IBrand;
    category?: ICategory;
    brandId: number;
    categoryId: number;
    variants?: IVariant[];
    variantIds?: number[];
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

export type IVariant = {
    id: number;
    image: string;
    price: number;
    active: boolean;
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

export interface IBrand {
    id: number;
    name: string;
    logo: string;
}

export interface ICategory {
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
