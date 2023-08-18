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
  await waitPromise(5000)
  console.log('Done sleeping after 5s')
  setAuthHydrated()
  setAuthUser(user)
})

const updateToken = (user: User | null, refresh: boolean = false) => {
  if (user) {
    user.getIdTokenResult(refresh).then(({ token, claims }) => {
      authStore.setState(({}) => ({ claims, token }))
    })
    return
  }
  authStore.setState(() => ({ claims: undefined, token: null }))
}
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, claims: { id: userId } = {} } = useAuthUser()

  useEffect(() => {
    updateToken(user, true)
    const interval = setInterval(() => {
      updateToken(user)
    }, 1000 * 60 * 15)
    return () => {
      clearInterval(interval)
    }
  }, [user])

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
