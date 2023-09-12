/** @format */

import Checkout from '@components/store/cart/checkout'
import CheckoutProvider from '@components/store/cart/checkout/CheckoutProvider'
import LoadingOverlay from '@components/ui/LoadingOverlay'
import { Suspense } from 'react'

const CheckoutPage = async () => {
  return (
    <CheckoutProvider>
      <Checkout />
    </CheckoutProvider>
  )
}

export default CheckoutPage
