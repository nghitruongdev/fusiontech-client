/** @format */

import { User } from '@firebase/auth'
import { create } from 'zustand'
import { IdTokenResult } from 'firebase/auth'
import { IUser, ROLES } from 'types'

type State = {
  user: User | null
  metadata?: {
    isNew?: boolean
  }
  roles: ROLES[]
  claims?:
    | Partial<IdTokenResult['claims']> & {
        /**
         * @deprecated
         */
        id?: number
        roles?: string[]
      }
  token: string | null
  userProfile: IUser | undefined
  _hasHydrated?: boolean
  _hasPermissionHydrated?: boolean
}

const store = create<State>()(() => ({
  user: null,
  userProfile: undefined,
  token: null,
  roles: [],
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
