/** @format */

import { useEffect, useState } from 'react'
import { useAuthStore, useAuthUser } from './useAuth/useAuthUser'

export const useHeaders = () => {
  const { token } = useAuthUser()
  const [_isHydrated, setIsHydrated] = useState<boolean>(false)

  const { _hasHydrated, _hasPermissionHydrated } = useAuthStore(
    ({ _hasHydrated, _hasPermissionHydrated }) => ({
      _hasHydrated,
      _hasPermissionHydrated,
    }),
  )

  useEffect(() => {
    _hasHydrated &&
      _hasPermissionHydrated &&
      !_isHydrated &&
      setIsHydrated(true)
  }, [_hasHydrated, _hasPermissionHydrated, _isHydrated])
  const getAuthHeader = () => {
    return {
      Authorization: `Bearer ${token}`,
    }
  }
  return {
    getAuthHeader,
    _isHydrated,
  }
}
