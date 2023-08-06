/** @format */

import Checkout from '@components/store/cart/checkout'
import CheckoutProvider from '@components/store/cart/checkout/CheckoutProvider'

const CheckoutPage = async () => {
  const {} = {
    options: {
      required: true,
      callbackUrl: '/auth/signin',
    },
  }

  return (
    <CheckoutProvider>
      <Checkout />
    </CheckoutProvider>
  )
}

export default CheckoutPage
