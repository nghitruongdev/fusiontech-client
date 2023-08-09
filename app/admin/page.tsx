/** @format */

'use client'

import { useAuthUser } from '@/hooks/useAuth/useAuthUser'
import { withStorageDOMEvents } from '@/hooks/withStorageEvent'
import { CheckoutForm } from '@components/store/cart/checkout/(form)'
import { AddressFormProvider } from '@components/store/cart/checkout/(form)/(address)/(modal)/AddressForm'
import AddressSection from '@components/store/cart/checkout/(form)/(address)/AddressSection'
import { ChangeEvent, useEffect, useState } from 'react'
import { useCountdown, useIsFirstRender, useIsMounted } from 'usehooks-ts'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const AdminPage = () => {
  const [intervalValue, setIntervalValue] = useState<number>(1000)
  const [count, { startCountdown, stopCountdown, resetCountdown }] =
    useCountdown({
      countStart: 5,
      intervalMs: intervalValue,
    })

  const handleChangeIntervalValue = (event: ChangeEvent<HTMLInputElement>) => {
    setIntervalValue(Number(event.target.value))
  }
  return (
    <div>
      <p>Count: {count}</p>
      {count === 0 && <SuccessPage />}
      <input
        type='number'
        value={intervalValue}
        onChange={handleChangeIntervalValue}
      />
      <button onClick={startCountdown}>start</button>
      <button onClick={stopCountdown}>stop</button>
      <button onClick={resetCountdown}>reset</button>
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
