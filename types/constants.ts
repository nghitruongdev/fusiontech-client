/** @format */

import { Action } from '@refinedev/core'
import { PaymentMethod, ResourceName } from 'types'

const throwIfMissing = (name: string) => {
  throw new Error(`${name} is missing from .env.local`)
  return ''
}

export const API_URL =
  process.env.NEXT_PUBLIC_RESOURCE_SERVER_URL ??
  throwIfMissing('NEXT_PUBLIC_RESOURCE_SERVER_URL')

export const NEXT_API_URL = 'http://localhost:3000/api'
//todo: const {} =  API['users']()
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
    const name: ResourceName = 'categories'
    return {
      resource: name,
      findByName: (value?: string) =>
        value ? `${name}/search/findByName?name=${value}` : '',
    }
  },
  brands: () => {
    const name: ResourceName = 'brands'
    return {
      resource: name,
      findByName: (value?: string) =>
        value ? `${name}/search/findByName?name=${value}` : '',
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
        // onlyName: 'only-name',
        nameWithVariants: 'name-with-variants',
      },
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
        !name?.length ? '' : `${resource}/search/findByNameLike?name=${name}`,
    }
  },
  specifications: () => {
    const resource: ResourceName = 'specifications'
    return {
      resource: resource,
      findDistinctNames: `${resource}/search/distinct-names`,
      findDistinctByName: (findName: string) =>
        `${resource}/search/findByName?name=${encodeURIComponent(findName)}`,
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

export const ROLES = {
  user: 'người dùng',
  admin: 'quản trị viên',
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
}
