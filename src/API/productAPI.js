/** @format */

import { API_URL } from 'types/constants'

const productApi = {
  searchByKeyword: (keyword) => {
    const url = `${API_URL}/products/search/byKeyWord?keyword=${keyword}`
    return axiosClient.get(url)
  },
  searchByCategoryId: (cid) => {
    const url = `${API_URL}/products/search/byCategoryId?cid=${cid}`
    return axiosClient.get(url)
  },
}

export default productApi
