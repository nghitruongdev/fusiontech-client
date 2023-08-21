/** @format */

'use client'

import OrderOverview from '@components/store/cart/checkout/OrderOverview'
import { useCheckoutContext } from './CheckoutProvider'
import { CheckoutForm } from './(form)'
import {
  useSelectedCartItemStore,
  useValidSelectedCartItems,
} from '../useSelectedItemStore'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthUser } from '@/hooks/useAuth/useAuthUser'
import AuthenticatedPage from 'app/(others)/authenticated'
import { waitPromise } from '@/lib/promise'

const Checkout = () => {
  const {
    promise,
    formState: { isSubmitting, isLoading, isSubmitted, isSubmitSuccessful },
  } = useCheckoutContext()
  const router = useRouter()
  const { user } = useAuthUser()
  const hasHydrated = useSelectedCartItemStore.persist?.hasHydrated()
  const itemCount = useValidSelectedCartItems().length
  useEffect(() => {
    const checkItems = async () => {
      if (hasHydrated && !itemCount) {
        console.log('hasHydrated, !itemCount', hasHydrated, !itemCount)
        router.replace('/cart')
      }
    }
    const timeout = setTimeout(checkItems, 500)
    return clearTimeout.bind(null, timeout)
  }, [hasHydrated, itemCount, router])

  useEffect(() => {
    router.prefetch(`cart/checkout/success`)
  }, [router])
  const render = () => {
    return (
      <AuthenticatedPage>
        <div className=' w-3/4 p-4'>
          <CheckoutForm />
        </div>
        <div className='w-2/5  p-4'>
          <OrderOverview />
        </div>
      </AuthenticatedPage>
    )
  }
  return (
    <div className='min-h-[600px] flex bg-gray-50 w-4/5 mx-auto max-w-7xl'>
      {render()}
    </div>
  )
}

export default Checkout
