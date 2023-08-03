/** @format */

import { IProduct } from 'types'
import { serverDataProvider as provider } from '../provider'
const resource = 'products'
const key = 'id'
const projection = {
  full: 'full',
}
export const getProductsWithDetails = async () => {
  return provider.getList<IProduct, 'id'>({
    resource,
    key,
    query: {
      projection: projection.full,
    },
  })
}

export const getOneProduct = async (id: string | number) => {
  return provider.getOne<IProduct>({
    resource,
    id: id,
    query: {
      projection: projection.full,
    },
  })
}
