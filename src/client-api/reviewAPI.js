/** @format */

import axiosClient from './axios-client'
import { API_URL } from 'types/constants'

const reviewApi = {
  get: (id) => {
    const url = `${API_URL}/reviews/search/findAllReviewsByProductId?pid=${id}`
    return axiosClient.get(url)
  },

  create: (reviewData, headers) => {
    const url = `${API_URL}/reviews`
    return axiosClient.post(url, reviewData, {
      headers,
    })
  },
}

export default reviewApi
