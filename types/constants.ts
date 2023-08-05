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

//todo: const {} =  API['users']()
export const API = {
  orders: () => {
    return {
      cart: {
        checkout: `cart/checkout`,
      },
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
    const name: ResourceName = 'variants'
    return {
      resource: name,
      projection: {
        basic: 'basic',
        withSpecs: 'specifications',
        withProduct: 'product',
        withProductBasic: 'product-name',
      },
      existsBySku: (sku: string) => `${name}/search/existsBySku?sku=${sku}`,
      findBySku: (sku: string) => `${name}/search/findBySku?sku=${sku}`,
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
      defaultAddress: {
        update: (uid: string, aid: number) =>
          `${resource}/${uid}/defaultAddress/${aid}`,
      },
      findByFirebaseId: (id: string) =>
        `${resource}/search/findByFirebaseId?firebaseId=${id}`,
      existsByEmail: (email: string) =>
        `${resource}/search/existsByEmail?email=${email}`,
      existsByPhoneNumber: (phone: string) =>
        `${resource}/search/existsByPhoneNumber?phone=${phone}`,
    }
  },
  shippingAddresses: () => {
    const resource: ResourceName = 'shippingAddresses'
    return {
      resource: resource,
      findAllByUserId: (id: string | number | undefined) =>
        id ? `${resource}/search/findAllByUserId?uid=${id}` : '',
      defaultAddressByUserId: `${resource}/search/findDefaultShippingAddressByUserId`,
    }
  },
}

export const ROLES = {
  user: 'người dùng',
  admin: 'quản trị viên',
}

export const PaymentMethodLabel: { [key in PaymentMethod]: string } = {
  COD: 'Trả sau (COD)',
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
}
