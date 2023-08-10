/** @format */

'use client'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@components/ui/shadcn/accordion'
import Image from 'next/image'
import { ICartItem } from 'types'
import { useValidSelectedCartItems } from '../useSelectedItemStore'
import { Images } from 'types/constants'
import { formatPrice } from '@/lib/utils'
import { Badge } from '@chakra-ui/react'

const CartItemList = () => {
  const items = useValidSelectedCartItems()

  return (
    <>
      <div>
        {items.map((item) => (
          <CartItemBox
            item={item}
            key={`${item.variantId}-${Math.random()}`}
          />
        ))}
      </div>
    </>
  )
}

export default CartItemList

const CartItemBox = ({
  item: { variantId, quantity, variant },
}: {
  item: ICartItem
}) => {
  return (
    <>
      <div className='flex gap-2 px-2 py-2 min-h-[100px] rounded-md bg-gray-50 mt-3 border-[1px] border-gray-100'>
        <div className='flex items-center justify-center'>
          <Image
            className='w-32'
            width={500}
            height={500}
            alt='productImg'
            src={
              variant?.images?.[0] ??
              variant?.product?.images?.[0] ??
              Images.products
            }
          />
        </div>
        <div className='w-full flex flex-col gap-1'>
          <div className='w-full'>
            <h2 className='text-base text-zinc-900 font-[500]'>
              {variant?.product?.name}
            </h2>
            <p className='text-sm text-zinc-500'></p>
          </div>
          <p className='text-sm text-zinc-500'>SKU: {variant?.sku ?? ''}</p>
          <div className='text-sm text-zinc-500 flex items-center gap-2'>
            Giá: {formatPrice(variant?.price)}
            {variant?.product?.discount && (
              <Badge
                variant={'subtle'}
                colorScheme='green'>{`${variant?.product?.discount}%`}</Badge>
            )}
          </div>
          <p className='text-sm text-zinc-500'>Số lượng: {quantity}</p>
          {/* <p className='text-sm text-zinc-500 flex items-center gap-1'>
            Free 30-day returns
            <span className='bg-primaryBlue rounded-full text-white text-xs w-4 h-4 flex items-center justify-center'>
              <TbReload className='rotate-180' />
            </span>
          </p> */}
        </div>
      </div>
    </>
  )
}
