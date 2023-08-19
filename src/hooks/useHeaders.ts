/** @format */

import { useAuthUser } from './useAuth/useAuthUser'

export const useHeaders = () => {
  const { token } = useAuthUser()

  const getAuthHeader = () => {
    return {
      Authorization: `Bearer ${token}`,
    }
  }
  return {
    getAuthHeader,
  }
}
