/** @format */

import { IBrand } from 'types'
import { serverDataProvider as provider } from '../provider'

const resource = 'brands'
const key = 'id'
export const getAllBrands = () => {
  return provider.getAll<IBrand, 'id'>({
    resource,
    key: 'id',
  })
}

export const getOneBrand = (id: string | number) => {
  return provider.getOne<IBrand>({
    resource,
    id,
  })
}
