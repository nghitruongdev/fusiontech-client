/** @format */

import axiosClient from './axios-client'
import { API_URL } from 'types/constants'

const userApi = {
  checkExistsByEmail: (email) => {
    const url = `${API_URL}/users/search/existsByEmail?email=${email}`
    return axiosClient.get(url)
  },

  checkExistsByPhone: (phone) => {
    const url = `${API_URL}/users/search/existsByPhoneNumber?phoneNumber=${phone}`
    return axiosClient.get(url)
  },
  updateUser: (id, userData) => {
    const url = `${API_URL}/api/users/updateUser/${id}`
    return axiosClient.put(url, userData)
  },
  createShippingAddress: (uid, shippingAdressData) => {
    const url = `${API_URL}/shippingAddresses/create/${uid}`
    return axiosClient.post(url, shippingAdressData)
  },
}

export default userApi
