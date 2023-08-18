/** @format */

import { useAuthUser } from './useAuth/useAuthUser'

export const useHeaders = () => {
  const { user, token } = useAuthUser()

  const getAuthHeader = () => {
    return {
      Authorization: `Bearer ${token}`,
    }
  }
  return {
    getAuthHeader,
  }
}
