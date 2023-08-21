/** @format */

'use client'
import { ReactNode } from 'react'
import CartItemList from './CartItemList'
import { CartPanel } from './panel'

type Props = {
  children: ReactNode
}

const Cart = () => {
  return (
    <div className='w-full py-10 bg-white text-zinc-'>
      <div className='w-[90%] flex gap-10 mx-auto'>
        <div className='w-2/3'>
          <CartItemList />
        </div>

        <div className='w-1/3 min-h-[500px]'>
          <CartPanel />
        </div>
      </div>
    </div>
  )
}

export default Cart
