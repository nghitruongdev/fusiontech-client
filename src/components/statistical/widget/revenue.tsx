/** @format */
'use client'
import { useEffect, useState } from 'react'

import { Box, Link, Text, Tooltip, Icon } from '@chakra-ui/react'
import { API } from 'types/constants'
import { useCustom } from '@refinedev/core'
import { CircleDollarSign, ShoppingCart } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface RevenueData {
  totalSales: number
  totalRevenue: number
  averagePrice: number
}

const RevenueWidget = () => {
  const { revenue, resource } = API.statistical()

  const { data } = useCustom<RevenueData[]>({
    url: revenue(),
    method: 'get',
    meta: { resource },
  })

  const revenueData = data?.data?.[0] ?? null // Access the first element or null if data is empty

  return (
    <div className='p-2 shadow-md rounded-lg bg-white w-[280px] '>
      <Text className='font-bold text-slate-500 text-base uppercase'>
        tổng doanh thu
      </Text>

      {revenueData ? (
        <>
          <Text className='font-semibold text-green-600 text-xl my-1'>
            {formatPrice(revenueData.totalRevenue)}
          </Text>
        </>
      ) : (
        <Text className='text-red-500'>No revenue data available.</Text>
      )}

      <div className='flex justify-between items-center '>
        <Text
          fontSize='12px'
          color='gray.600'
          className='mt-2 underline underline-offset-2'>
          Xem tất cả đơn hàng
        </Text>
        <CircleDollarSign
          size={22}
          className='text-green-600 bg-green-300 rounded-lg p-1'
        />
      </div>
    </div>
  )
}

export default RevenueWidget
