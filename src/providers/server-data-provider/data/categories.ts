/** @format */

import { ICategory } from 'types'
import { serverDataProvider } from '../provider'

export const getCategoriesList = async () => {
  return serverDataProvider.getList<ICategory, 'id'>({
    resource: 'categories',
    key: 'id',
  })
}
