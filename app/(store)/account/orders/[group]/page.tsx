/** @format */

'use client'
import { API, API_URL } from 'types/constants'
import {
  IOrderStatus,
  IOrder,
  OrderStatusText,
  OrderStatus,
  PaymentStatusLabel,
  PaymentStatus,
} from 'types'
import { springDataProvider } from '@/providers/rest-data-provider'
import { useCustom } from '@refinedev/core'
import { useAuthUser } from '@/hooks/useAuth/useAuthUser'
import { formatDateTime, formatPrice } from '@/lib/utils'
import { useHeaders } from '@/hooks/useHeaders'
import Link from 'next/link'
import React, { useState } from 'react'
const getOrderByGroup = (group: string) => {
  const { getAuthHeader } = useHeaders()
  const {
    resource,
    findAllStatusByGroup,
    findOrderByUserAndStatus,
    projection: { withPayment },
  } = API['orders']()

  const { data: { data: statusList } = {} } = useCustom<IOrderStatus[]>({
    url: findAllStatusByGroup(group),
    method: 'get',
    queryOptions: {
      enabled: !!group,
    },
    meta: {
      headers: {
        ...getAuthHeader(),
      },
    },
  })
  const statusParam = statusList?.map((item) => item.name).join(',')

  const { claims: { id } = {} } = useAuthUser()
  const { data: { data } = {} } = useCustom<IOrder[]>({
    url: findOrderByUserAndStatus(id, statusParam),
    method: 'get',
    meta: {
      resource: 'orders',
      headers: {
        ...getAuthHeader(),
      },
    },
    config: {
      query: {
        projection: withPayment,
      },
    },
    queryOptions: {
      enabled: !!id && !!statusParam,
    },
  })
  console.log(data)
  return data
}

const OrderByGroup = ({ params: { group } }: { params: { group: string } }) => {
  //   const orders = ((await getOrderByGroup(group)) ?? []) as IOrder[]
  const orders = getOrderByGroup(group)
  console.log(orders)
  return (
    <div>
      <div className='bg-white rounded-lg overflow-y-auto'>
        <table className='text-center  w-full'>
          <thead>
            <tr>
              <th className='px-4 py-4'>Mã đơn hàng</th>
              <th className='px-4 py-4'>Ngày mua</th>
              <th className='px-4 py-4'>Tổng tiền</th>
              <th className='px-4 py-4'>Trạng thái</th>
              <th className='px-4 py-4'>Thanh Toán</th>
            </tr>
          </thead>
          <tbody>
            {orders
              ?.sort((a, b) => +b.id - +a.id)
              .map(({ id, purchasedAt, total, status, payment }) => (
                <tr
                  key={id}
                  className='border-t'>
                  <Link href={`/account/orders/order-detail/${id}`}>
                    <td className='px-4 py-4 text-blue-500'>{id}</td>
                  </Link>
                  <td className='px-4 py-4'>{formatDateTime(purchasedAt)}</td>
                  <td className='px-4 py-4'>{formatPrice(payment?.amount)}</td>
                  <td className={`px-4 py-4 text-blue-500`}>
                    {OrderStatusText[status as OrderStatus].text}
                  </td>
                  <td className='px-4 py-4 text-blue-500'>
                    {PaymentStatusLabel[payment?.status as PaymentStatus].text}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
export default OrderByGroup
