/** @format */

'use client'
import useCrudNotification from '@/hooks/useCrudNotification'
import { useCustomMutation, HttpError } from '@refinedev/core'
import { UseFormReturnType, useForm } from '@refinedev/react-hook-form'
import { useRouter } from 'next/navigation'
import {
  Suspense,
  createContext,
  use,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { ICartItem, ICheckout, IOrder, IVoucher } from 'types'
import { API } from 'types/constants'
import { API_URL } from 'types/constants'
import { createStore, useStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { calculateTotalPayment } from './utils'
import { useAuthUser } from '@/hooks/useAuth/useAuthUser'
import { suspensePromise, waitPromise } from '@/lib/promise'
import LoadingOverlay from '@components/ui/LoadingOverlay'
import useCart, { useCartStore } from '../useCart'

type State = {
  onCheckout: () => Promise<void>
  promise: Promise<any>
}
type StoreState = State & UseFormReturnType<IOrder, HttpError, ICheckout>

const Context = createContext<StoreState | null>(null)
type ProviderProps = React.PropsWithChildren<{}>
export const CheckoutProvider = ({ children }: ProviderProps) => {
  const router = useRouter()
  const {
    onError,
    action: { open },
  } = useCrudNotification()
  const { removeItem } = useCart()
  const formProps = useForm<IOrder, HttpError, ICheckout>({
    refineCoreProps: {
      action: 'create',
      errorNotification: onError,
      successNotification: false,
      resource: 'cart/checkout',
    },
  })
  const {
    handleSubmit,
    setValue,
    getFieldState,
    getValues,
    refineCore: { onFinish },
    clearErrors,
    formState: { isSubmitting, isSubmitted, errors },
  } = formProps

  const { claims: { id } = {} } = useAuthUser()
  useEffect(() => {
    console.log('isSubmitting', isSubmitting)
  }, [isSubmitting])
  useEffect(() => {
    id && setValue(`userId`, id + '')
  }, [id])
  const [promise, setPromise] = useState<Promise<any>>(Promise.resolve())

  const checkoutHandler = async () => {
    const { cart } = API['orders']()
    const url = `${API_URL}/${cart.checkout}`

    if (errors?.voucher) {
      open?.({
        type: 'error',
        message: 'Voucher không hợp lệ hoặc đã hết lượt sử dụng. ',
      })
      return
    }
    const submitHandler = handleSubmit(async (data) => {
      console.log('data', data)
      if (!data.addressId) {
        open?.(onError({ message: 'Vui lòng chọn địa chỉ nhận hàng' }))
        return
      }
      const { items: cartItems, voucher } = data
      const { total: amount } = calculateTotalPayment(cartItems, voucher)
      window.scrollTo({
        top: 0,
        behavior: 'smooth', // Smooth scrolling animation
      })

      const items = cartItems.map(
        ({ variantId, variant: { price } = {}, quantity }) => ({
          variantId,
          quantity,
          price,
        }),
      )
      await waitPromise(2000)
      try {
        const result = await onFinish({
          ...data,
          items,
          payment: {
            ...data.payment,
            amount,
          },
        })
        console.warn('Have not cleared items in cart')
        cartItems.forEach((item) => !!item.id && removeItem(item.id))
        setTimeout(() => {
          router.replace(`/cart/checkout/success?oid=${result?.data}`)
        }, 300)
      } catch (err) {
        console.log('inside inner try catch')
        console.log('error', err)
      }
    })
    try {
      await submitHandler()
    } catch (error) {
      console.error('error inside try-catch', error)
    }
    console.log('Outside handle submit')
  }
  const isProcessing = isSubmitting
  return (
    <Context.Provider
      value={{
        ...formProps,
        onCheckout: checkoutHandler,
        promise,
      }}>
      {isProcessing && <LoadingOverlay />}
      {children}
    </Context.Provider>
  )
}

const useCheckoutContext = () => {
  const ctx = useContext(Context)
  if (!ctx) throw new Error('Checkout Context is missing')
  return ctx
}

export default CheckoutProvider
export { useCheckoutContext }
