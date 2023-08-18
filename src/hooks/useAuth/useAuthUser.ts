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
}

const store = create<State>()(() => ({
  user: null,
  userProfile: undefined,
  token: null,
}))

export const useAuthUser = () => {
  const user = store((state) => state.user)
  const claims = store((state) => state.claims)
  const userProfile = store((state) => state.userProfile)
  const metadata = store((state) => state.metadata)
  const token = store((state) => state.token)
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

export { store as authStore }
