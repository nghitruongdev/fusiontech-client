/** @format */

import { User } from '@firebase/auth'
import { create } from 'zustand'
import { IdTokenResult } from 'firebase/auth'
import { IUser } from 'types'

type State = {
  user: User | null
  metadata?: {
    isNew?: boolean
  }
  claims?:
    | Partial<IdTokenResult['claims']> & {
        id?: number
        roles?: string[]
      }
  token: string | null
  userProfile: IUser | undefined
  _hasHydrated?: boolean
}

const store = create<State>()(() => ({
  user: null,
  userProfile: undefined,
  token: null,
}))

export const useAuthUser = () => {
  const { user, userProfile, claims, token, metadata } = store(
    ({ user, userProfile, claims, token, metadata }) => ({
      user,
      userProfile,
      claims,
      token,
      metadata,
    }),
  )
  return {
    user,
    claims,
    userProfile,
    metadata,
    token,
  }
}
export const setAuthUser = (user: State['user']) => {
  store.setState(() => ({ user }))
}

export const setUserProfile = (userProfile: State['userProfile']) => {
  store.setState(() => ({ userProfile }))
}

export const setIsNewUser = (isNew: boolean) => {
  store.setState(({ metadata }) => ({ metadata: { ...metadata, isNew } }))
}

export const setUserToken = (token: State['token']) => {
  store.setState(() => ({ token }))
}

export const setAuthHydrated = () => {
  if (!store.getState()._hasHydrated) {
    store.setState(() => ({ _hasHydrated: true }))
  }
}

export { store as authStore }
export { store as useAuthStore }
