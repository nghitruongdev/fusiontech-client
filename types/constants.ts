/** @format */

import { Action } from '@refinedev/core'
import { ResourceName } from 'types'

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
        withProductName: 'product-name',
      },
      existsBySku: (sku: string) => `${name}/search/existsBySku?sku=${sku}`,
      findBySku: (sku: string) => `${name}/search/findBySku?sku=${sku}`,
    }
  },
  products: () => {
    const name: ResourceName = 'products'
    return {
      resource: name,
      projection: {
        full: 'full',
        specifications: 'specifications',
      },
      getSpecificationsByProduct: (productId: string) =>
        `${name}/${productId}/specifications`,
      countProductSold: (productId: string) =>
        `${name}/search/countProductSold?productId=${productId}`,
      getFavoriteProductsByUser: (id: number) =>
        `${name}/search/favorites?uid=${id}`,
      /**
       * @deprecated
       * @param productId
       * @returns
       */
      distinctAttributesByProduct: (productId: string | number | undefined) => {
        throw new Error('Deprecated')
        return `${name}/search/distinct-attributes-name-with-all-values?pid=${productId}`
      },
    }
  },
  specifications: () => {
    const name: ResourceName = 'specifications'
    return {
      resource: name,
      findDistinctNames: `${name}/search/distinct-names`,
      findDistinctByName: (findName: string) =>
        `${name}/search/findByName?name=${findName}`,
    }
  },
  users: () => {
    const name: ResourceName = 'users'
    return {
      resource: name,
      defaultAddress: {
        update: (uid: string, aid: number) =>
          `${name}/${uid}/defaultAddress/${aid}`,
      },
      findByFirebaseId: (id: string) =>
        `${name}/search/findByFirebaseId?firebaseId=${id}`,
      existsByEmail: (email: string) =>
        `${name}/search/existsByEmail?email=${email}`,
      existsByPhoneNumber: (phone: string) =>
        `${name}/search/existsByPhoneNumber?phone=${phone}`,
    }
  },
  shippingAddresses: () => {
    const name: ResourceName = 'shippingAddresses'
    return {
      resource: name,
      findAllByUserId: (id: string | number | undefined) =>
        id ? `${name}/search/findAllByUserId?uid=${id}` : '',
      defaultAddressByUserId: `${name}/search/findDefaultShippingAddressByUserId`,
    }
  },
}

export const ROLES = {
  user: 'người dùng',
  admin: 'quản trị viên',
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
