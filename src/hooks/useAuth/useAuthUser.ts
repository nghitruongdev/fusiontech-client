import { User } from '@firebase/auth'
import { produce } from 'immer'
import { useEffect } from 'react'
import { create } from 'zustand'
import { IdTokenResult } from 'firebase/auth'

type State = {
  user: User | null
  claims?:
    | Partial<IdTokenResult['claims']> & {
        id?: number
        roles?: string[]
      }
}

const store = create<State>()(() => ({
  user: null,
}))

export const useAuthUser = () => {
  const user = store((state) => state.user)
  const claims = store((state) => state.claims)

  return {
    user,
    claims,
  }
}
export const setAuthUser = (user: State['user']) => {
  store.setState(() => ({ user }))
}

export { store as authStore }
