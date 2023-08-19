/** @format */

'use client'

import { useAuthUser } from '@/hooks/useAuth/useAuthUser'
import { withStorageDOMEvents } from '@/hooks/withStorageEvent'
import { firebaseAuth } from '@/providers/firebaseAuthProvider'
import { Button } from '@chakra-ui/react'
import { CheckoutForm } from '@components/store/cart/checkout/(form)'
import { AddressFormProvider } from '@components/store/cart/checkout/(form)/(address)/(modal)/AddressForm'
import AddressSection from '@components/store/cart/checkout/(form)/(address)/AddressSection'
import { usePermissions } from '@refinedev/core'
import { ChangeEvent, useEffect, useState } from 'react'
import { ROLES } from 'types'
import { useCountdown, useIsFirstRender, useIsMounted } from 'usehooks-ts'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const AdminPage = () => {
  const [intervalValue, setIntervalValue] = useState<number>(1000)

  const { user, claims } = useAuthUser()
  const handleChangeIntervalValue = (event: ChangeEvent<HTMLInputElement>) => {
    setIntervalValue(Number(event.target.value))
  }

  const { data: roles } = usePermissions<ROLES[]>({
    options: {
      retry: 4,
    },
  })
  return (
    <div>
      {/* <Button
        onClick={() => {
          console.log('new Date().getTime()', new Date().getTime())
          setInterval(() => {
            console.log('Interval running now', new Date().getTime())
          }, 5000)
        }}>
        Log user
      </Button> */}
      {JSON.stringify(roles)}
    </div>
  )
}
export default AdminPage

type Store = {
  cartId: number | null
}

const SuccessPage = () => {
  const isFirstRendered = useIsMounted()
  useEffect(() => {
    console.log('isFirstRendered', isFirstRendered())
  }, [isFirstRendered])
  return <>Hello there {}</>
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
