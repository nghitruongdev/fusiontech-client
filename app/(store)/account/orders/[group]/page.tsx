/** @format */

'use client'
import { API, statusColor } from 'types/constants'
import {
  IOrderStatus,
  IOrder,
  OrderStatus as OrderStatusType,
  PaymentStatusLabel,
  PaymentStatus,
  OrderStatusText,
} from 'types'
import { useCustom } from '@refinedev/core'
import { useAuthUser } from '@/hooks/useAuth/useAuthUser'
import { formatDateTime, formatPrice } from '@/lib/utils'
import { useHeaders } from '@/hooks/useHeaders'
import Link from 'next/link'
import React from 'react'
import { Badge } from '@chakra-ui/react'
import { onError } from '@/hooks/useCrudNotification'
import { NoData } from '@components/no-result/NoData'
const useGetOrderByGroup = (group: string) => {
  const { authHeader } = useHeaders()
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
      enabled: !!group && !!authHeader,
    },
    config: {
      headers: {
        ...authHeader,
      },
    },
  })
  const statusParam = statusList?.map((item) => item.name).join(',')

  const { userProfile } = useAuthUser()
  const { data: { data: orders } = {}, status } = useCustom<IOrder[]>({
    url: findOrderByUserAndStatus(userProfile?.id, statusParam),
    method: 'get',
    meta: {
      resource: 'orders',
    },
    config: {
      query: {
        projection: withPayment,
      },
      headers: {
        ...authHeader,
      },
    },
    queryOptions: {
      enabled: !!userProfile?.id && !!statusParam && !!authHeader,
    },
  })
  return { orders, status }
}

const OrderByGroup = ({ params: { group } }: { params: { group: string } }) => {
  const { orders, status } = useGetOrderByGroup(group)
  if (!orders?.length && status !== 'loading')
    return <NoData>Bạn vẫn chưa đặt đơn hàng nào :(</NoData>
  return (
    <div>
      <div className='bg-white rounded-lg overflow-y-auto'>
        <table className='text-center  w-full'>
          <thead>
            <tr>
              <th className='px-4 py-4'>Mã đơn hàng</th>
              <th className='px-4 py-4'>Tổng tiền</th>
              <th className='px-4 py-4'>Trạng thái</th>
              <th className='px-4 py-4'>Thanh Toán</th>
              <th className='px-4 py-4'>Ngày mua</th>
            </tr>
          </thead>
          <tbody>
            {orders
              ?.sort((a, b) => +b.id - +a.id)
              .map((item) => (
                <OrderRow
                  key={item.id}
                  item={item}
                />
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const OrderRow = ({
  item: { id, purchasedAt, total, status: orderStatus, payment },
}: {
  item: IOrder
}) => {
  const { getAuthHeader } = useHeaders()
  const paymentStatus =
    payment?.status && PaymentStatusLabel[payment.status as PaymentStatus]

  const { data: statusData } = useCustom<IOrderStatus[]>({
    url: 'orders/statuses',
    method: 'get',
    config: {
      headers: {
        ...getAuthHeader(),
      },
    },
    errorNotification: onError,
  })

  const status = statusData?.data?.find((st) => st.name === orderStatus)

  return (
    <tr className='border-t'>
      <td className='px-4 py-4'>
        <Link
          href={`/account/orders/order-detail/${id}`}
          className='hover:underline text-zinc-600'>
          {id}
        </Link>
      </td>

      <td className='px-4 py-4'>{formatPrice(payment?.amount)}</td>
      <td className={`px-4 py-4 `}>
        <Badge
          variant='outline'
          colorScheme={statusColor(status)}
          px='4'
          py='1'
          rounded='md'>
          {OrderStatusText[orderStatus as unknown as OrderStatusType]?.text}
        </Badge>
      </td>
      <td className='px-4 py-4'>
        <Badge
          variant='outline'
          px='4'
          py='1'
          rounded='md'
          colorScheme={`${
            paymentStatus?.color ? paymentStatus.color : 'facebook'
          }`}>
          {paymentStatus?.text}
        </Badge>
      </td>
      <td className='px-4 py-4'>{formatDateTime(purchasedAt)}</td>
    </tr>
  )
}
export default OrderByGroup
