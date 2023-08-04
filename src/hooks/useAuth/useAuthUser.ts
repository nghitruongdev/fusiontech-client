/** @format */

import { User } from '@firebase/auth'
import { produce } from 'immer'
import { useEffect } from 'react'
import { create } from 'zustand'
import { IdTokenResult } from 'firebase/auth'
import { IUser } from 'types'

type State = {
  user: User | null
  claims?:
    | Partial<IdTokenResult['claims']> & {
        id?: number
        roles?: string[]
      }
  userProfile: IUser | undefined
}

const store = create<State>()(() => ({
  user: null,
  userProfile: undefined,
}))

export const useAuthUser = () => {
  const user = store((state) => state.user)
  const claims = store((state) => state.claims)
  const userProfile = store((state) => state.userProfile)
  return {
    user,
    claims,
    userProfile,
  }
}
export const setAuthUser = (user: State['user']) => {
  store.setState(() => ({ user }))
}

export const setUserProfile = (userProfile: State['userProfile']) => {
  store.setState(() => ({ userProfile }))
}

export { store as authStore }
