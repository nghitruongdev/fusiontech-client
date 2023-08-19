/** @format */
'use client'
import { useEffect, useState } from 'react'

import { Box, Link, Text, Tooltip, Icon } from '@chakra-ui/react'
import { API } from 'types/constants'
import { useCustom } from '@refinedev/core'
import { ShoppingCart } from 'lucide-react'
import { useHeaders } from '@/hooks/useHeaders'

const OrderWidget = () => {
  const { countOrder, resource } = API.orders()
  const { getAuthHeader } = useHeaders()

  const { data: { data } = {} } = useCustom({
    url: countOrder(),
    method: 'get',
    meta: {
      resource,
    },
    config: {
      headers: {
        ...getAuthHeader(),
      },
    },
  })
  const orderCount = (data as unknown as number) ?? 0

  return (
    <div className='p-2 shadow-md rounded-lg bg-white w-[280px] '>
      <Text className='font-bold text-slate-500 text-base uppercase'>
        đơn hàng
      </Text>

      <Text className='font-semibold text-green-600 text-xl my-1'>
        {orderCount}
      </Text>

      <div className='flex justify-between items-center '>
        <Text
          fontSize='12px'
          color='gray.600'
          className='mt-2 underline underline-offset-2'>
          Xem tất cả đơn hàng
        </Text>
        <ShoppingCart
          size={22}
          className='text-orange-800  bg-orange-300 rounded-lg p-1'
        />
      </div>
    </div>
  )
}

export default OrderWidget
