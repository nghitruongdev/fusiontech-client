/** @format */

'use client'
import {
  authStore,
  setAuthUser,
  setUserProfile,
  useAuthUser,
} from '@/hooks/useAuth/useAuthUser'
import { firebaseAuth } from '@/providers/firebaseAuthProvider'
import { springDataProvider } from '@/providers/rest-data-provider'
import { useCustom, useOne } from '@refinedev/core'
import { useEffect } from 'react'
import { IUser } from 'types'
import { API } from 'types/constants'

const unsub = firebaseAuth.auth.onIdTokenChanged(async (user) => {
  console.debug('onAuthStateChanged', new Date().getTime())
  setAuthUser(user)
})

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, claims: { id: userId } = {} } = useAuthUser()

  useEffect(() => {
    if (user) {
      user.getIdTokenResult().then((token) => {
        authStore.setState(({}) => ({ claims: token.claims }))
      })
      return
    }
    authStore.setState(() => ({ claims: undefined }))
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
