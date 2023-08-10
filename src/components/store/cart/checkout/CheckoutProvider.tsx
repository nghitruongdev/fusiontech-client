/** @format */

'use client'
import useCrudNotification from '@/hooks/useCrudNotification'
import { useCustomMutation, HttpError } from '@refinedev/core'
import { UseFormReturnType, useForm } from '@refinedev/react-hook-form'
import { useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useRef } from 'react'
import { ICartItem, ICheckout, IOrder, IVoucher } from 'types'
import { API } from 'types/constants'
import { API_URL } from 'types/constants'
import { createStore, useStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'

type State = {
  onCheckout: () => Promise<void>
}
type StoreState = State & UseFormReturnType<IOrder, HttpError, ICheckout>
// type CheckoutStore = ReturnType<typeof createCheckoutStore>

// const createCheckoutStore = (initProps: StoreState) => {
//   const defaultProps = {}
//   return createStore<StoreState>()(
//     immer((set, get) => ({
//       ...defaultProps,
//       ...initProps,
//     })),
//   )
// }

const Context = createContext<StoreState | null>(null)
type ProviderProps = React.PropsWithChildren<{}>
export const CheckoutProvider = ({ children }: ProviderProps) => {
  const router = useRouter()
  const {
    onDefaultError,
    onError,
    action: { open },
  } = useCrudNotification()
  const { mutateAsync } = useCustomMutation({
    mutationOptions: {},
  })
  const formProps = useForm<IOrder, HttpError, ICheckout>({
    refineCoreProps: {
      action: 'create',
    },
  })
  const {
    setValue,
    formState: { errors, isLoading, isSubmitting },
    refineCore: { formLoading, onFinish },
    saveButtonProps,
    register,
    getFieldState,
    setError,
    getValues,
    reset,
    handleSubmit,
  } = formProps

  const checkoutHandler = async () => {
    console.log('checkout button clicked')
    const { cart } = API['orders']()
    const url = `${API_URL}/${cart.checkout}`
    console.log('url', url)
    await handleSubmit(async (data) => {
      console.log('data', data)
      if (!data.addressId) {
        open?.(onError({ message: 'Vui lòng chọn địa chỉ nhận hàng' }))
        return
      }

      window.scrollTo({
        top: 0,
        behavior: 'smooth', // Smooth scrolling animation
      })
      return

      await new Promise((resolve) => setTimeout(resolve, 500))
      mutateAsync(
        {
          url,
          method: 'post',
          values: {
            ...data,
          },
        },
        {
          onSettled(data, error, variables, context) {
            console.log('Done submitting the order')
          },
          onSuccess(data, variables, context) {
            router.replace(`/cart/checkout/success?oid=${data?.data}`)
          },
        },
      )
      console.log('Last in handle submit')
    })()
    console.log('Outside handle submit')
  }

  //   const storeRef = useRef<StoreState>()
  //   if (!!!storeRef.current) {
  //     storeRef.current = createCheckoutStore({
  //       ...formProps,
  //       onCheckout: checkoutHandler,
  //     })
  //   }
  return (
    <>
      <Context.Provider value={{ ...formProps, onCheckout: checkoutHandler }}>
        {children}
      </Context.Provider>
    </>
  )
}

function useCheckoutContext<T>(
  selector: (state: StoreState) => T,
  equalityFn?: (left: T, right: T) => boolean,
): T {
  const store = useContext(Context)
  if (!store) throw new Error('Missing Context.Provider in the tree')
  return useStore(store, selector, equalityFn)
}

export default CheckoutProvider
export { useCheckoutContext }
