/** @format */

import axiosClient from './axiosClient'
import { API_URL } from 'types/constants'

const productApi = {
  searchByKeyword: (keyword) => {
    const url = `${API_URL}/products/search/byKeyWord?keyword=${keyword}`
    return axiosClient.get(url)
  },
}

export default productApi
