/** @format */

import axiosClient from './axiosClient'
import { API_URL } from 'types/constants'

const reviewApi = {
  get: (id) => {
    const url = `${API_URL}/reviews/search/findAllReviewsByProductId?pid=${id}`
    return axiosClient.get(url)
  },

  create: (reviewData) => {
    const url = `${API_URL}/reviews`
    return axiosClient.post(url, reviewData)
  },
}

export default reviewApi
