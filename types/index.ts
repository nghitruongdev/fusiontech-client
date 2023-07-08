import { FieldValue, Timestamp } from "@firebase/firestore";

export interface IProduct {
    _id: number;
    name: string;
    isNew: boolean;
    oldPrice: string;
    price: number;
    description: string;
    brand: string;
    category: string;
    image: string;
    title?: string;
}

export interface IVariant {
    id: number;
    image: string;
    price: number;
    active: boolean;
    availableQuantity?: number;
    product?: IProduct;
    _links: _links;
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
