/** @format */

/** @format */

import { formatDate } from '@/lib/utils'
import { Action } from '@refinedev/core'
import { Gender, IUser, PaymentMethod, ResourceName } from 'types'
const throwIfMissing = (name: string) => {
  throw new Error(`${name} is missing from .env.local`)
  return
}

export const API_URL =
  process.env['NEXT_PUBLIC_RESOURCE_SERVER_URL'] ??
  throwIfMissing('NEXT_PUBLIC_RESOURCE_SERVER_URL')

export const NEXT_API_URL =
  process.env['NEXT_PUBLIC_RESOURCE_SERVER_URL'] ??
  throwIfMissing('NEXT_PUBLIC_API_URL')

export const API = {
  orders: () => {
    const resource: ResourceName = 'orders'

    return {
      resource,
      projection: {
        withPayment: 'with-payment',
      },
      cart: {
        checkout: `cart/checkout`,
      },
      countOrder: () => `${resource}/count`,
      findAllStatusByGroup: (group: string | undefined) =>
        !group ? '' : `${resource}/statuses?group=${group}`,
      findOrderByUserAndStatus: (
        uid: number | string | undefined,
        status: string | undefined,
      ) =>
        !uid || !status
          ? ''
          : `${resource}/search/byUserIdAndStatusIn?uid=${uid}&st=${status}`,
    }
  },
  categories: () => {
    const resource: ResourceName = 'categories'
    return {
      resource: resource,
      findByName: (value?: string) =>
        value
          ? `${resource}/search/find-by-name?name=${encodeURIComponent(value)}`
          : '',
      findBySlug: (slug?: string) =>
        slug
          ? `${resource}/search/find-by-slug?slug=${encodeURIComponent(slug)}`
          : '',
    }
  },
  brands: () => {
    const resource: ResourceName = 'brands'
    return {
      resource: resource,
      findByName: (value?: string) =>
        value
          ? `${resource}/search/find-by-name?name=${encodeURIComponent(value)}`
          : '',
      findBySlug: (slug?: string) =>
        slug
          ? `${resource}/search/find-by-slug?slug=${encodeURIComponent(slug)}`
          : '',
    }
  },
  variants: () => {
    const resource: ResourceName = 'variants'
    return {
      resource: resource,
      projection: {
        basic: 'basic',
        withSpecs: 'specifications',
        withProduct: 'product',
        withProductBasic: 'product-name',
      },
      hasImportInventory: (id: string | number | undefined) =>
        `${resource}/search/has-import-inventory?id=${id}`,
      existsBySku: (sku: string) => `${resource}/search/existsBySku?sku=${sku}`,
      findBySku: (sku: string) => `${resource}/search/findBySku?sku=${sku}`,
      getAvailableQuantity: (id: string | number | undefined) =>
        !id ? '' : `${resource}/search/get-available-quantity?id=${id}`,
    }
  },
  products: () => {
    const resource: ResourceName = 'products'
    const variants: ResourceName = 'variants'
    return {
      resource,
      projection: {
        full: 'full',
        specifications: 'specifications',
        nameAndVariantCount: 'name-and-variant-count',
        nameWithVariants: 'name-with-variants',
      },
      hasImportInventory: (id: string | number | undefined) =>
        `${resource}/search/has-import-inventory?id=${id}`,
      getAllProducts: () => `${resource}`,
      getProductsDiscount: () => `${resource}/search/discount-products`,
      getHotProducts: (size: number) =>
        `${resource}/search/hot-products?size=${size}`,
      getProductsLastest: (size: number) =>
        `${resource}/search/latest-products?size=${size}`,
      getSellingProducts: (startDate: Date, endDate: Date, size: number = 10) =>
        `statistical/best-seller?startDate=${formatDate(
          startDate,
        )}&endDate=${formatDate(endDate)}&size=${size}`,
      getVariants: (productId: string | number | undefined) =>
        productId ? `${resource}/${productId}/${variants}` : '',
      getSpecificationsByProduct: (productId: string) =>
        `${resource}/${productId}/specifications`,
      countProductSold: (productId: string) =>
        `${resource}/search/countProductSold?productId=${productId}`,
      getFavoriteProductsByUser: (id: number) =>
        `${resource}/search/favorites?uid=${id}`,
      findTopFrequentBoughtTogether: (
        id: string | number | undefined,
        size: number = 5,
      ) =>
        id
          ? `${resource}/search/findTopFrequentBoughtTogether?id=${id}&size=${size}`
          : '',
      getAvailableQuantity: (id: string | number | undefined) =>
        id ? `${resource}/search/availableQuantityByProduct?id=${id}` : '',
      findByNameLike: (name: string | undefined) =>
        !name?.length
          ? ''
          : `${resource}/search/findByNameLike?name=${encodeURIComponent(
              name,
            )}`,
      findByName: (name: string | undefined) =>
        !name
          ? ''
          : `${resource}/search/find-by-name?name=${encodeURIComponent(name)}`,
      findBySlug: (slug: string | undefined) =>
        !slug
          ? ''
          : `${resource}/search/find-by-slug?slug=${encodeURIComponent(slug)}`,
      findProductStatus: `${resource}/search/find-all-status`,
    }
  },
  specifications: () => {
    const resource: ResourceName = 'specifications'
    return {
      resource: resource,
      findDistinctNames: `${resource}/search/distinct-names`,
      findDistinctByName: (findName: string) =>
        `${resource}/search/findByName?name=${encodeURIComponent(findName)}`,
      updateName: (oldName: string, newName: string) =>
        `${resource}/update-name?oldName=${encodeURIComponent(
          oldName,
        )}&newName=${encodeURIComponent(newName)}`,
    }
  },
  users: () => {
    const resource: ResourceName = 'users'
    return {
      resource: resource,
      projection: {
        nameAndImageOnly: 'name-image-only',
      },
      defaultAddress: {
        update: (uid: string, aid: number) =>
          `${resource}/${uid}/defaultAddress/${aid}`,
      },
      findByFirebaseId: (id: string) =>
        `${resource}/search/findByFirebaseId?firebaseId=${id}`,
      existsByEmail: (email: string) =>
        `${resource}/search/existsByEmail?email=${email}`,
      existsByPhoneNumber: (phone: string) =>
        `${resource}/search/existsByPhoneNumber?phoneNumber=${phone}`,
      findByEmail: (email: string) =>
        `${resource}/search/find-by-email?email=${email}`,
      findByPhone: (phone: string) =>
        `${resource}/search/find-by-phone?phoneNumber=${phone}`,
      findStaff: `${resource}/search/staffs`,
      countUser: () => `${resource}/count`,
    }
  },
  shippingAddresses: () => {
    const resource: ResourceName = 'shippingAddresses'
    return {
      resource: resource,
      findAllByUserId: (id: string | number | undefined) =>
        id ? `${resource}/search/findAllByUserId?uid=${id}` : '',
      defaultAddressByUserId: (uid: number | string | undefined) =>
        `${resource}/search/findDefaultShippingAddressByUserId?uid=${uid}`,
    }
  },
  statistical: () => {
    const resource: ResourceName = 'statistical'
    return {
      resource: resource,
      revenue: () => `${resource}/revenue/all`,
      bestCustomer: (size: number = 10) =>
        `${resource}/best-customer?size=${size}`,
      revenueDay: () => `${resource}/revenue/day`,
    }
  },
  address: {
    provinces: `address/provinces`,
    districts: (provinceCode: number | string | undefined) =>
      provinceCode ? `address/districts?query=${provinceCode}` : '',
    wards: (districtCode: number | string | undefined) =>
      districtCode ? `address/wards?query=${districtCode}` : '',
  },

  vouchers: () => {
    const resource: ResourceName = 'vouchers'
    return {
      resource,
      findByCode: (code: string | undefined | null) =>
        !code ? '' : `${resource}/search/by-code?code=${code}`,
      countUserUsage: (
        code: string | undefined | null,
        userId: number | string | undefined | null,
      ) =>
        !code || !userId
          ? ''
          : `${resource}/search/user-usage?code=${code}&userId=${userId}`,
      countUsage: (code: string | null | undefined) =>
        !code ? '' : `${resource}/search/usage?code=${code}`,
    }
  },
  ['inventory-details']: () => {
    const resource: ResourceName = 'inventory-details'
    return {
      resource,
    }
  },
}

export const RESOURCE_LABEL: { [key in ResourceName]: string } = {
  'inventory-details': 'Chi tiết kho',
  categories: 'Danh mục',
  brands: 'Thương hiệu',
  products: 'Sản phẩm',
  variants: 'Biến thể sản phẩm',
  orders: 'Đơn hàng',
  users: 'Người dùng',
  shippingAddresses: 'Địa chỉ',
  specifications: 'Thông số',
  vouchers: 'Voucher',
  statistical: 'Thống kê',
}
export const ROLES = {
  user: 'người dùng',
  admin: 'quản trị viên',
}

export const GenderLabel: { [key in Gender]: string } = {
  MALE: 'Nam',
  FEMALE: 'Nữ',
  OTHER: 'Khác',
}

export const PaymentMethodLabel: { [key in PaymentMethod]: string } = {
  CASH: 'Trả sau (COD)',
  CREDIT_CARD: 'Thẻ Visa/ Master Card',
}

type Lang = 'vi' | 'en'
type ButtonType = Action | 'refresh' | 'delete' | 'save' | 'logout' | 'cancel'
export const ButtonText = (key: ButtonType, lang: Lang = 'vi') => {
  switch (lang) {
    case 'vi':
      return ButtonTextVi[key]
    case 'en':
      return key as string
  }
}

const ButtonTextVi: { [key in ButtonType]: string } = {
  create: 'Thêm',
  edit: 'Chỉnh sửa',
  list: 'Danh sách',
  show: 'Xem',
  clone: 'Nhân bản',
  refresh: 'Tải lại',
  delete: 'Xoá',
  save: 'Lưu',
  logout: 'Đăng xuất',
  cancel: 'Quay lại',
}

export const ActionText = {
  create: 'Thêm mới',
  edit: 'Cập nhật',
  delete: 'Xoá',
}
export const NEXT_PATH = {
  login: '/auth/login',
}

export const Images: { [key in ResourceName]: string } = {
  products:
    'https://firebasestorage.googleapis.com/v0/b/fusiontech-vnco4.appspot.com/o/images%2Fvariants%2FlogostuImage.png?alt=media&token=90709f04-0996-4779-ab80-f82e99c62041',
  categories:
    'https://firebasestorage.googleapis.com/v0/b/fusiontech-vnco4.appspot.com/o/images%2Fvariants%2FlogostuImage.png?alt=media&token=90709f04-0996-4779-ab80-f82e99c62041',
  brands:
    'https://firebasestorage.googleapis.com/v0/b/fusiontech-vnco4.appspot.com/o/images%2Fvariants%2FlogostuImage.png?alt=media&token=90709f04-0996-4779-ab80-f82e99c62041',
  variants:
    'https://firebasestorage.googleapis.com/v0/b/fusiontech-vnco4.appspot.com/o/images%2Fvariants%2FlogostuImage.png?alt=media&token=90709f04-0996-4779-ab80-f82e99c62041',
  orders:
    'https://firebasestorage.googleapis.com/v0/b/fusiontech-vnco4.appspot.com/o/images%2Fvariants%2FlogostuImage.png?alt=media&token=90709f04-0996-4779-ab80-f82e99c62041',
  users:
    'https://firebasestorage.googleapis.com/v0/b/fusiontech-vnco4.appspot.com/o/images%2Fvariants%2FlogostuImage.png?alt=media&token=90709f04-0996-4779-ab80-f82e99c62041',
  shippingAddresses:
    'https://firebasestorage.googleapis.com/v0/b/fusiontech-vnco4.appspot.com/o/images%2Fvariants%2FlogostuImage.png?alt=media&token=90709f04-0996-4779-ab80-f82e99c62041',
  specifications:
    'https://firebasestorage.googleapis.com/v0/b/fusiontech-vnco4.appspot.com/o/images%2Fvariants%2FlogostuImage.png?alt=media&token=90709f04-0996-4779-ab80-f82e99c62041',
  vouchers: '',
  'inventory-details': '',
  statistical:
    'https://firebasestorage.googleapis.com/v0/b/fusiontech-vnco4.appspot.com/o/images%2Fvariants%2FlogostuImage.png?alt=media&token=90709f04-0996-4779-ab80-f82e99c62041',
}
