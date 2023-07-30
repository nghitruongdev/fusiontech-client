'use client'
import {
  authStore,
  setAuthUser,
  useAuthUser,
} from '@/hooks/useAuth/useAuthUser'
import { firebaseAuth } from '@/providers/firebaseAuthProvider'
import { useEffect } from 'react'

const unsub = firebaseAuth.auth.onIdTokenChanged(async (user) => {
  console.debug('onAuthStateChanged', new Date().getTime())
  setAuthUser(user)
})

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthUser()

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
    console.debug('Auth Provider rendered')
    return () => {
      console.debug('Auth provider unmounted')
    }
  })
  return <>{children}</>
}
export default AuthProvider
