/** @format */

import { API_URL } from 'types/constants'
import client from './axios-client'

const productApi = {
  searchByKeyword: (keyword) => {
    const url = `${API_URL}/products/search/byKeyWord?keyword=${keyword}`
    return client.get(url)
  },
  searchByCategoryId: (cid) => {
    const url = `${API_URL}/products/search/byCategoryId?cid=${cid}`
    return client.get(url)
  },
  searchByBrandId: (bid) => {
    const url = `${API_URL}/products/search/byBrandId?bid=${bid}`
    return client.get(url)
  },
}

export default productApi
