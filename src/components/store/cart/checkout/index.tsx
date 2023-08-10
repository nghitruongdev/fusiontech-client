/** @format */

'use client'

import { Spinner } from '@chakra-ui/react'
import OrderOverview from '@components/store/cart/checkout/OrderOverview'
import VisualWrapper from '@components/ui/VisualWrapper'
import { useCheckoutContext } from './CheckoutProvider'
import { CheckoutForm } from './(form)'
import { useSelectedCartItemStore } from '../useSelectedItemStore'
import { use, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { suspensePromise } from '@/lib/promise'
import { useAuthUser } from '@/hooks/useAuth/useAuthUser'

const Checkout = () => {
  const { isSubmitting, isLoading } = useCheckoutContext(
    (state) => state.formState,
  )
  const router = useRouter()
  const { user } = useAuthUser()
  const hasHydrated = useSelectedCartItemStore.persist?.hasHydrated()
  const itemCount = useSelectedCartItemStore((state) => state.items).length
  useEffect(() => {
    if (hasHydrated && !itemCount) {
      router.replace('/cart')
    }
  }, [hasHydrated, itemCount, router])

  useEffect(() => {
    setTimeout(() => {
      if (!user) {
        router.replace('/', {
          scroll: true,
        })
      }
    }, 300)
  }, [user, router])
  //   use(suspensePromise(hasHydrated))

  const render = () => {
    if (isSubmitting || isLoading) return <Checkout.Loading />
    return (
      <>
        <div className=' w-3/4 p-4'>
          <CheckoutForm />
        </div>
        <div className='w-2/5  p-4'>
          <OrderOverview />
        </div>
      </>
    )
  }
  return (
    <>
      <div className='min-h-[600px] flex bg-gray-50 w-4/5 mx-auto max-w-7xl'>
        {render()}
      </div>
    </>
  )
}

Checkout.Loading = function ProcessingOrderLoading() {
  return (
    <div className='pt-[200px] gap-4 w-full'>
      <div className='w-full flex justify-center items-center gap-4'>
        <h1>Đang đặt hàng</h1>
        <Spinner
          size='xl'
          thickness='3px'
          color='blue.500'
          speed={'0.45s'}
        />
      </div>
    </div>
  )
}

export default Checkout
