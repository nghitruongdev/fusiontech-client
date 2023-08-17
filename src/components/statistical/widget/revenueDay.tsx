/** @format */
'use client'
import { useEffect, useState } from 'react'

import { Box, Link, Text, Tooltip, Icon } from '@chakra-ui/react'
import { API } from 'types/constants'

import { DollarSign } from 'lucide-react'
import { IUser } from 'types'
import { useCustom } from '@refinedev/core'
import { formatPrice } from '@/lib/utils'

export interface RevenueDay {
  totalRevenue: number
  totalSales: number
  averagePrice: number
  currentDay: Date
}
const RevenueDayWidget = () => {
  const { revenueDay, resource } = API.statistical()

  const { data: { data } = {} } = useCustom<RevenueDay[]>({
    url: revenueDay(),
    method: 'get',
    meta: { resource },
  })

  const totalRevenue = data && data.length > 0 ? data[0].totalRevenue : 0
  return (
    <div className='p-2 shadow-md rounded-lg bg-white w-[280px] '>
      <Text className='font-bold text-slate-500 text-base uppercase'>
        Doanh thu trong ngày
      </Text>

      <Text className='font-semibold text-green-600 text-xl my-1'>
        {formatPrice(totalRevenue)}
      </Text>

      <div className='flex justify-between items-center '>
        <Text
          fontSize='12px'
          color='gray.600'
          className='mt-2 underline underline-offset-2'>
          Xem tất cả đơn hàng
        </Text>
        <DollarSign
          size={22}
          className='text-white  bg-yellow rounded-lg p-1'
        />
      </div>
    </div>
  )
}

export default RevenueDayWidget
