/** @format */

'use client'

import { useAuthUser } from '@/hooks/useAuth/useAuthUser'
import { withStorageDOMEvents } from '@/hooks/withStorageEvent'
import { useEffect } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const AdminPage = () => {
  //   const { user } = useAuthUser()
  //   const [cartId, setCartId] = useCartStore((state) => [
  //     state.cartId,
  //     state.setCartId,
  //   ])
  //   useEffect(() => {
  //     const unsub = withStorageDOMEvents(useCartStore as any)
  //     return unsub
  //   }, [])
  return (
    // <div>
    //   Hello, testpage, cartid: {cartId}
    //   <button
    //     onClick={() => {
    //       setCartId(Math.random())
    //     }}>
    //     Set Number{' '}
    //   </button>
    //   <button
    //     onClick={() => {
    //       setCartId(null)
    //     }}>
    //     Set Null{' '}
    //   </button>
    // </div>
    <></>
  )
}
export default AdminPage

type Store = {
  cartId: number | null
}
// const useCartStore = create<{
//   cartId: Store['cartId']
//   setCartId: (id: Store['cartId']) => void
// }>()(
//   persist(
//     (set, get) => {
//       return {
//         cartId: null,
//         setCartId: (id) => {
//           set(() => ({ cartId: id }))
//         },
//       }
//     },
//     {
//       name: 'test',
//       onRehydrateStorage(state) {
//         console.log('before hydrate', state)
//       },
//       //   merge(persistedState, currentState) {
//       //     return deepmerge(persistedState, currentState)
//       //   },
//     },
//   ),
// )
