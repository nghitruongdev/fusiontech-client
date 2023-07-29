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
    }
  },
  brands: () => {
    const name: ResourceName = 'brands'
    return {
      resource: name,
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
      existsByEmail: (email: string) => {
        ;`${name}/search/existsByEmail?email=${email}`
      },
      existsByPhoneNumber: (phone: string) => {
        ;`${name}/search/existsByPhoneNumber?phone=${phone}`
      },
    }
  },
  shippingAddresses: () => {
    const name: ResourceName = 'shippingAddresses'
    return {
      resource: name,
      findAllByUserId: `${name}/search/findAllByUserId`,
      defaultAddressByUserId: `${name}/search/findDefaultShippingAddressByUserId`,
    }
  },
}

type Lang = 'vi' | 'en'
type ButtonType = Action | 'refresh' | 'delete' | 'save'
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
}
