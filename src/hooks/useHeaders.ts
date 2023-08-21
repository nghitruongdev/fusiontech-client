/** @format */

import { useCallback, useEffect, useState } from 'react'
import { useAuthStore, useAuthUser } from './useAuth/useAuthUser'

export const useHeaders = () => {
  const { token } = useAuthUser()
  const [_isHydrated, setIsHydrated] = useState<boolean>(false)
  const [authHeader, setAuthHeader] = useState<{ Authorization: string }>()
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

  useEffect(() => {
    if (token) setAuthHeader({ Authorization: `Bearer ${token}` })
  }, [token])

  const getAuthHeader = useCallback(() => {
    return {
      Authorization: `Bearer ${token}`,
    }
  }, [token])
  return {
    getAuthHeader,
    _isHydrated,
    authHeader,
  }
}
