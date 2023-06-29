import { StringDecoder } from "string_decoder";

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

export interface IProblemResponse {
    data: {
        title: string;
        detail: string;
    };
}
