/** @format */

import { ICartItem, IVoucher } from 'types'
import { getDiscount, getTotalAmount } from '../utils'

export const calculateTotalPayment = (
  cartItems: ICartItem[],
  voucher?: IVoucher | null,
) => {
  const { code, maxDiscountAmount, discount: voucherDiscount } = voucher ?? {}

  const subTotal = getTotalAmount(cartItems)
  const discount = getDiscount(cartItems)
  let vDiscount = (voucherDiscount ?? 0) * (subTotal - discount)
  if (maxDiscountAmount) {
    vDiscount = vDiscount <= maxDiscountAmount ? vDiscount : maxDiscountAmount
  }
  const shippingFee = 0

  const total = subTotal - discount - vDiscount + shippingFee
  return {
    subTotal,
    discount,
    vDiscount,
    total,
  }
}
