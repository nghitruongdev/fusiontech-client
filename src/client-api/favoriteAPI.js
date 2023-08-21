/** @format */

import { API_URL } from 'types/constants'
import axiosClient from './axios-client'

const favoriteApi = {
  get: (uid) => {
    const url = `${API_URL}/products/search/favorites?uid=${uid}`
    return axiosClient.get(url)
  },

  delete: (productId, uid) => {
    const url = `${API_URL}/products/${productId}/favorites?uid=${uid}`
    return axiosClient.delete(url)
  },

  getProductId: (pid) => {
    const url = `${API_URL}/products/${pid}`
    return axiosClient.get(url)
  },

  create: (productId, uid) => {
    const url = `${API_URL}/products/${productId}/favorites?uid=${uid}`
    return axiosClient.post(url)
  },
}

export default favoriteApi
