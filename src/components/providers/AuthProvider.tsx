/** @format */

'use client'
import {
  authStore,
  setAuthHydrated,
  setAuthUser,
  setUserProfile,
  useAuthStore,
  useAuthUser,
} from '@/hooks/useAuth/useAuthUser'
import { waitPromise } from '@/lib/promise'
import { firebaseAuth } from '@/providers/firebaseAuthProvider'
import { springDataProvider } from '@/providers/rest-data-provider'
import { User } from 'firebase/auth'
import { useEffect } from 'react'
import { IUser } from 'types'
import { API } from 'types/constants'

const unsub = firebaseAuth.auth.onIdTokenChanged(async (user) => {
  console.debug('onAuthStateChanged', new Date().toLocaleTimeString())
  setAuthHydrated()
  console.debug('auth has hydrated')

  setAuthUser(user)
})

const updateToken = (user: User | null, refresh: boolean = false) => {
  if (user) {
    user.getIdTokenResult(refresh).then(({ token, claims }) => {
      authStore.setState(({}) => ({
        claims,
        token,
        _hasPermissionHydrated: true,
      }))
    })
    return
  }
  authStore.setState(() => ({ claims: undefined, token: null }))
}
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, claims: { id: userId } = {}, token } = useAuthUser()

  useEffect(() => {
    updateToken(user, true)
    console.log('user?.token', token)
    const interval = setInterval(() => {
      updateToken(user)
    }, 1000 * 60 * 15)
    return () => {
      clearInterval(interval)
    }
  }, [user, token])

  useEffect(() => {
    if (!userId) return
    const fetchUser = async () => {
      const userProfile = await springDataProvider.getOne<IUser>({
        resource: API['users']().resource,
        id: userId ?? '',
      })
      setUserProfile(userProfile.data)
    }
    fetchUser()
  }, [userId])

  useEffect(() => {
    console.debug('Auth Provider rendered')
    return () => {
      console.debug('Auth provider unmounted')
    }
  })
  return <>{children}</>
}
export default AuthProvider
