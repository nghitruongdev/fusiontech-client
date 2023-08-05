/** @format */

'use client'
import Link from 'next/link'
import Image from 'next/image'
import { warningImg } from '@public/assets/images'
import { IoMdClose } from 'react-icons/io'
import { useSelectedCartItemStore } from '../useSelectedItemStore'
import { FunctionComponent, ReactNode } from 'react'
import { formatPrice } from '@/lib/utils'
import { getDiscount, getTotalAmount } from '../utils'
import { cn } from 'components/lib/utils'

function Panel() {
  return (
    <div className='flex flex-col gap-2'>
      <p className='h-[32px]'></p>
      <div className=' mr-2 py-8 px-4 rounded-md flex flex-col justify-center gap-4 border-[1px] border-zinc-400'>
        <Panel.Promotion />
        <Panel.Overview />
        <Panel.Login />
      </div>
    </div>
  )
}

Panel.Login = function Login() {
  // const isAuthenticated = useAuthClientCookie().isAuthenticated;
  const isAuthenticated = false
  const isSelected = useSelectedCartItemStore((state) => state.items).length
  return (
    <div className='mt-2'>
      <Link
        href='/cart/checkout'
        className={`${!isSelected && 'pointer-events-none select-none'}`}>
        <p
          className={`flex items-center justify-center mx-auto w-3/4 text-white h-10 font-semibold duration-300 rounded-full ${
            isSelected ? 'bg-primaryBlue hover:bg-hoverBg' : 'bg-blue-400'
          }`}>
          {isSelected ? 'Tiếp tục đến thanh toán' : 'Chọn sản phẩm'}
        </p>
      </Link>
      {isAuthenticated && (
        <p className='text-sm text-center leading-none mt-1'>
          <span>
            Bạn hãy{' '}
            <span className='leading-normal text-md font-medium underline underline-offset-2 decoration-[1px]'>
              đăng nhập
            </span>{' '}
            để có trải nghiệm mua sắm tốt nhất
          </span>
        </p>
      )}
    </div>
  )
}

Panel.Promotion = function Promotion() {
  return (
    <>
      <div className='bg-[#002d58] text-white p-2 rounded-lg flex items-center justify-between gap-4'>
        <Image
          className='w-8'
          src={warningImg}
          alt='warningImg'
        />
        <p className='text-sm'>
          Đang có sản phẩm giảm giá trong giỏ hàng của bạn. Hãy đặt mua ngay để
          nhận tối đa ưu đãi!
        </p>
        <IoMdClose
          // onClick={() => setWarningMsg(false)}
          className='text-3xl hover:text-red-400 cursor-pointer duration-200'
        />
      </div>
    </>
  )
}

const Overview = () => {
  const { items } = useSelectedCartItemStore(({ items }) => ({ items }))
  console.log('items', items)
  const total = getTotalAmount(items)
  const discount = getDiscount(items)
  return (
    <div className='grid gap-4'>
      <Overview.Price
        subTotal={total}
        discount={discount}
      />
      <Overview.Shipping />
      <Overview.Total total={total - discount} />
    </div>
  )
}

Panel.Overview = Overview

Overview.Price = function OverviewPrice({
  subTotal,
  discount,
}: {
  subTotal: number
  discount: number
}) {
  const { items } = useSelectedCartItemStore(({ items }) => ({ items }))

  return (
    <div className='w-full flex flex-col gap-4 border-b-[1px] border-b-zinc-200'>
      <div className='flex flex-col gap-1'>
        <div className='text-sm flex justify-between'>
          <p className='font-semibold'>
            Thành tiền <span>({items.length} sản phẩm)</span>
          </p>

          <p
            className={cn(
              `text-zinc-500 text-base`,
              !!discount && 'line-through',
            )}>
            {formatPrice(subTotal)}
          </p>
        </div>
        {!!discount && (
          <div className='text-sm flex justify-between mb-1'>
            <p className='font-semibold'>Bạn tiết kiệm được</p>
            <p className='text-[#2a8703] font-bold bg-green-100 px-[2px] rounded-lg inline-flex'>
              -{formatPrice(discount)}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
Overview.Shipping = function Shipping() {
  return (
    <div className='w-full flex flex-col gap-4 pb-2 border-b-[1px] border-b-zinc-200 mb-1'>
      <div className='flex flex-col gap-1'>
        <div className='text-sm flex justify-between'>
          <p className='font-semibold'>Phí vận chuyển</p>
          <p className='text-[#2a8703]'>Miễn phí</p>
        </div>
        <p className='text-xs text-muted-foreground'>
          Chính sách vận chuyển tại FusionTech
        </p>

        {/* <div className="text-sm flex justify-between">
                        <p className="text-sm font-semibold">Thuế VAT</p>
                        <p className="text-zinc-800">Đã bao gồm</p>
                    </div> */}
      </div>
    </div>
  )
}

Overview.Total = function Total({ total }: { total: number }) {
  return (
    <div className='flex items-center justify-between pb-2 border-b-[1px] border-b-zinc-200'>
      <p className='text-xl font-semibold'>Thành tiền</p>
      <p className='text-zinc-800 font-bold text-lg'>{formatPrice(total)}</p>
    </div>
  )
}

export { Panel as CartPanel }
