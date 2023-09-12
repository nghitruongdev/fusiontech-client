/** @format */

import { HttpError } from '@refinedev/core'
import axios from 'axios'
import { AppError } from 'types/error'

const axiosInstance = axios.create()

axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const customError: AppError = {
      ...error,
      message: error.response?.data?.message,
      statusCode: error.response?.status,
    }

    return Promise.reject(customError)
  },
)

export { axiosInstance }
