/** @format */

import { Timestamp } from '@firebase/firestore'

export type ResourceName =
  | 'categories'
  | 'brands'
  | 'products'
  | 'variants'
  | 'orders'
  | 'users'
  | 'shippingAddresses'
  | 'specifications'

export type FirebaseImage = string

export type UploadUrl = {
  name: string | undefined
  url: string
  file?: File | null
}

export type IProduct = {
  id: string | undefined
  name: string
  slug: string
  summary: string
  description: string
  status?: 'NGUNG_KINH_DOANH' | 'MOI_RA_MAT'
  active?: boolean
  minPrice?: number
  maxPrice?: number
  discount?: number
  features?: string[]
  brand?: IBrand
  category?: ICategory
  reviewCount?: number
  avgRating?: number
  variants?: IVariant[] | { id: string; price: number }[]
  _links?: {
    self: {
      href: string
    }
    product: {
      href: string
      templated: true
    }
    category: {
      href: string
    }
    variants: {
      href: string
      templated: true
    }
    brand: {
      href: string
    }
  }
} & {
  images?: FirebaseImage[]
  specifications?: {
    name: string
    values: ISpecification[]
  }[]
}

export type IProductField = {
  id: string | undefined
  name: string
  slug: string
  summary: string
  description: string
  features?: { value: string }[]
} & {
  files: File[]
  images?: (FirebaseImage | null)[]
  specificationGroup?: Option<string>[]
  specifications?: (
    | {
        label: string
        options: Option<ISpecification>[]
      }
    | undefined
  )[]
  brand?: Option<IBrand>
  category?: Option<ICategory>
}

export type ISpecification = {
  id?: number
  name: string
  value: string
}

export type IVariant = {
  id: number
  sku: string
  images?: FirebaseImage[]
  price: number
  active?: boolean
  availableQuantity?: number
  product?: IProduct
  specifications?: ISpecification[]
  _links: _links
}

export type IVariantField = {
  id: number
  sku: string
  images?: (FirebaseImage | null)[]
  price: number
  product: {
    label: string
    value: {
      id: string
      name: string
    }
  }
  specificationGroup?: Option<string>[]
  specifications?: {
    label: string
    options: Option<ISpecification | undefined>[]
  }[]
} & {
  files: File[]
}
/**
 * @deprecated
 */
export type IAttribute = {
  id: number
  name: string
  value: string
  _links: {
    self: {
      href: string
    }
    variantAttribute: {
      href: string
    }
    variant: {
      href: string
      templated: true
    }
  }
}

type IReview = {
  id: number
  comment: string | null
  createdAt: Date | null
  rating: '1' | '2' | '3' | '4' | '5' | null
  productId: number | null
  USER_ID: number | null
}

export type IBrand = {
  id?: number
  name: string
  image?: FirebaseImage | null
  slug: string
}

export type IBrandField = IBrand & {
  file?: File | null
}

export interface ICategory {
  id?: number
  name: string
  slug: string
  description?: string
  image?: FirebaseImage | null
  specifications?: string[]
}

export interface ICategoryField extends ICategory {
  formSpecifications?: Option<string>[]
  file?: File | null
}

export type IAddress = {
  name: string
  code: number
  codename: string
  division_type: string
  short_codename: string
}
export interface IUser {
  id?: number
  firebaseUid: string
  firstName?: string
  lastName?: string
  fullName?: string
  displayName?: string
  email?: string
  phoneNumber?: string
  photoUrl?: string
  image?: FirebaseImage | null
  dateOfBirth?: Date
  gender?: 'MALE' | 'FEMALE' | 'OTHER'
  roles?: string[]
  defaultAddress?: ShippingAddress
  isDisabled?: boolean
  isStaff?: boolean
  _links?: _links
}

export interface IUserForm extends IUser {
  formGender?: Option<string>
  formRoles?: Option<string>
  imageFile?: File | null
}

export interface ShippingAddress {
  id: string | undefined
  name: string
  phone: string
  address: string
  ward: string
  district: string
  province: string
  default?: boolean
  type?: 'Văn phòng' | 'Nhà riêng'
  user?: any
  provinceOption?: Option<IAddress> | null
  districtOption?: Option<IAddress> | null
  wardOption?: Option<IAddress> | null
  _links?: _links
}

export interface _links {
  self: {
    href: string
  }
  [key: string]: {
    href: string
  }
}

export interface ICheckout {
  id?: string | undefined
  userId: string
  addressId: number
  items: ICartItem[]
  email?: string
  note?: string
  payment: IPayment
}
export interface ICart {
  id: string
  uid: string | null
  items?: ICartItem[]
  updatedAt?: Timestamp
}
export interface ICartItem {
  id?: string
  variantId: number
  quantity: number
  updatedAt?: Timestamp
  variant?: IVariant
}

export interface IOrder {
  id: string
  total: number | undefined
  note: string
  email: string
  status: string | IOrderStatus
  purchasedAt?: string
  userId: string
  addressId: number
  paymentId: number
  voucherId?: number
  voucher?: {
    id: number
  }
  payment?: IPayment
  _links?: _links
}

export interface IVoucher {
  id: number
  code: string | null
  description?: string | null
  minOrderAmount?: number | null
  maxDiscountAmount?: number | null
  startDate?: string | null
  expirationDate?: string | null
  limitUsage?: number | null
  userLimitUsage?: number | null
}

export enum PaymentStatus {
  CHUA_THANH_TOAN = 'Chưa thanh toán',
  DA_THANH_TOAN = 'Đã thanh toán',
}

export type PaymentMethodLabel = 'CHUA_THANH_TOAN' | 'DA_THANH_TOAN'
export enum PaymentMethod {
  COD = 'COD',
  CREDIT_CARD = 'CREDIT_CARD',
}

export interface IPayment {
  id: string
  amount: number
  paidAt: string
  status: PaymentStatus
  method: PaymentMethod
}

export interface IOrderItem {
  id: string
  price: number
  quantity: number
  variant: {
    id: number
  }
  _links: _links
}

export interface IOrderStatus {
  id: number
  name: string
  detailName: string
  group:
    | 'VERIFY'
    | 'PROCESSING'
    | 'ON_DELIVERY'
    | 'COMPLETED'
    | 'FAILED'
    | 'CANCELLED'
  isChangeable: boolean
}

export interface IOrderStatusGroup {
  id: number
  name: string
  detailName: string
}

export interface IInventory {
  id: string
  createdBy: string
  createdDate: string
  lastModifiedBy?: string
  lastModifiedDate?: string
  totalQuantity?: number
  items?: IInventoryDetail
  _links?: _links
}

export interface IInventoryDetail {
  id: string
  quantity: number
  variantId?: string
  variant?: IVariant
  inventory?: IInventory
  _links?: _links
}

export interface IProblemResponse {
  data: {
    title: string
    detail: string
  }
}

export type Page = {
  size: number
  totalElements: number
  totalPages: number
  number: number
}

export type Option<T> = {
  label: string
  value: T
  __isNew__?: boolean
  __isFixed__?: boolean
}

export type GroupOption<T> = {
  label: string
  options: Option<T>[]
}
