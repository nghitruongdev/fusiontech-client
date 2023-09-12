/** @format */

'use client'
import useCrudNotification from '@/hooks/useCrudNotification'
import { HttpError } from '@refinedev/core'
import { UseFormReturnType, useForm } from '@refinedev/react-hook-form'
import { useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'
import { ICheckout, IOrder } from 'types'
import { API } from 'types/constants'
import { calculateTotalPayment } from './utils'
import { useAuthUser } from '@/hooks/useAuth/useAuthUser'
import { waitPromise } from '@/lib/promise'
import LoadingOverlay from '@components/ui/LoadingOverlay'
import useCart from '../useCart'
import { useHeaders } from '@/hooks/useHeaders'
import { useBoolean } from '@chakra-ui/react'

type State = {
  onCheckout: () => Promise<void>
  promise: Promise<any>
}
type StoreState = State & UseFormReturnType<IOrder, HttpError, ICheckout>

const Context = createContext<StoreState | null>(null)
type ProviderProps = React.PropsWithChildren<{}>
export const CheckoutProvider = ({ children }: ProviderProps) => {
  const [isRedirecting, { on: redirectOn }] = useBoolean()
  const router = useRouter()
  const { getAuthHeader } = useHeaders()
  const { removeItem } = useCart()
  const {
    onError,
    action: { open },
  } = useCrudNotification()
  const formProps = useForm<IOrder, HttpError, ICheckout>({
    refineCoreProps: {
      action: 'create',
      errorNotification: onError,
      successNotification: false,
      resource: 'cart/checkout',
      meta: {
        headers: {
          ...getAuthHeader(),
        },
      },
    },
  })

  const {
    handleSubmit,
    setValue,
    refineCore: { onFinish },
    formState: { isSubmitting, errors },
  } = formProps

  const { userProfile } = useAuthUser()

  //update userId form
  useEffect(() => {
    const id = userProfile?.id
    !!id && setValue(`userId`, id + '')
  }, [setValue, userProfile?.id])

  const [promise, setPromise] = useState<Promise<any>>(Promise.resolve())

  const checkoutHandler = async () => {
    const { cart } = API['orders']()

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
        open?.({
          type: 'error',
          message: 'Vui lòng chọn địa chỉ nhận hàng',
        })
        return
      }
      const { items: cartItems, voucher } = data
      const { total: amount } = calculateTotalPayment(cartItems, voucher)
      window.scrollTo({
        top: 0,
        behavior: 'smooth', // Smooth scrolling animation
      })

      console.log('cartItems', cartItems)
      const items = cartItems.map(
        ({ variantId, variant: { price, product } = {}, quantity }) => ({
          variantId,
          quantity,
          price,
          ...(product?.discount && { discount: product?.discount }),
        }),
      )
      const submitValue = {
        ...data,
        items,
        payment: {
          ...data.payment,
          amount,
        },
      }
      console.log('checkoutValue', submitValue)
      await waitPromise(200)
      try {
        const result = await onFinish(submitValue)
        redirectOn()
        router.push(`/cart/checkout/success?oid=${result?.data}`)
        cartItems.forEach((item) => !!item.id && removeItem(item.id))
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
  const isProcessing = isSubmitting || isRedirecting
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
