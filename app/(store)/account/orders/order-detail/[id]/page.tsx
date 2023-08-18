/** @format */
'use client'
import React from 'react'
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi'
import {
  IVariant,
} from 'types'

import { API, API_URL } from 'types/constants'
import { useCustom, useOne, useMany } from '@refinedev/core'
import { useParams } from 'next/navigation'
import { format, parseISO } from 'date-fns'
import { useAuthUser } from '@/hooks/useAuth/useAuthUser'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
const OrderDetailPage = () => {
  // lấy id từ url
  const param = useParams()
  const id = param.id as string

  // lấy number phone user
  const { user } = useAuthUser()
  console.log(id)
  // Đoạn code để lấy thông tin đơn hàng dựa vào orderId
  const orderFull = `http://localhost:8080/api/orders/${id}?projection=full`
  const { data: orderData } = useCustom({
    url: orderFull,
    method: 'get',
    queryOptions: {
      enabled: !!orderFull,
    },
  })
  console.log(orderData)

  // format lại date của ngày order
  const purchasedAt = orderData?.data.purchasedAt
  const dateOrderFormat = purchasedAt
    ? format(parseISO(purchasedAt), 'HH:mm:ss dd/MM/yyyy')
    : ''

  //thay đổi trạng thái thành tiếng Việt
  const ORDER_STATUS = {
    VERIFY: 'Đã xác nhận',
    PREPARED: 'Đang chuẩn bị',
    ON_DELIVERY: 'Đang giao',
    COMPLETED: 'Giao thành công',
    FAILED: 'Trả hàng',
    CANCELLED: 'Đã huỷ',
    DENIED: 'Đã huỷ bởi hệ thống',
    PLACED: 'Chờ xác nhận',
  }

  const PAYMENT_METHOD = {
    CASH: 'Thanh toán khi nhận hàng',
  }

  // lấy địa chỉ default của user
  const { findAllByUserId, defaultAddressByUserId } = API['shippingAddresses']()
  const { findByFirebaseId } = API['users']()
  const { data, status } = useCustom({
    url: `${API_URL}/${defaultAddressByUserId(orderData?.data.userId)}`,
    method: 'get',
    queryOptions: {
      enabled: !!user,
    },
  })

  const defaultShippingAddress =
    data?.data.address +
    ', ' +
    data?.data.ward +
    ', ' +
    data?.data.district +
    ', ' +
    data?.data.province

  // lấy tổng tiền sản phẩm
  let subTotal = 0

  if (orderData && orderData?.data.items) {
    orderData.data.items.forEach((item: any) => {
      subTotal += item.price * item.quantity
    })
  }
  // lấy variant product theo variantId
  const { resource } = API.variants()

  // Tạo danh sách IDs cần truy vấn
  const variantIds = orderData?.data.items.map((item) => item.variant.id) || []
  console.log(variantIds)
  // const variantIds = orderData?.data.items.variant.id

  // Sử dụng useMany với danh sách IDs để lấy data từ product variant
  const { data: variantData, error: productError } = useMany<IVariant>({
    resource: resource, // Chỉ định tên resource ở đây (không thay đổi)
    ids: variantIds,
    queryOptions: {
      enabled: !!variantIds.length, // Chỉ kích hoạt khi có ít nhất một ID
    },
    meta: {
      query: {
        projection: 'product',
      },
    },
  })


  return (
    <div className='mx-auto '>
      <div className='flex items-center'>
        <Link href={'/account/orders/VERIFY'}>
          <button className='bg-white rounded-md mr-2 hover:bg-blue-700 '>
            <BiChevronLeft className='w-8 h-8 text-gray-500 hover:text-white' />
          </button>
        </Link>
        <h1 className='text-xl font-medium'>ĐƠN HÀNG: {orderData?.data.id}</h1>
      </div>

      <div className='flex mt-2'>
        <div className='w-1/2 mr-4 p-4 bg-white rounded-md'>
          <h2 className='text-base font-semibold mb-4'>Thông tin người nhận</h2>
          <div>
            <p className=''>
              <span className='text-sm font-semibold'>Tên: </span>
              <span className='text-sm'>{orderData?.data?.user.firstName}</span>
            </p>
            <p className=''>
              <span className=' text-sm font-semibold'>Địa chỉ: </span>
              <span className='text-sm'>{defaultShippingAddress}</span>
            </p>
            <p className=''>
              <span className='text-sm font-semibold'>Số điện thoại: </span>
              <span className='text-sm'>{data?.data.phone}</span>
            </p>
          </div>
        </div>

        <div className='w-1/2 p-4 bg-white rounded-md'>
          <h2 className='text-base font-semibold mb-4'>Thông tin đơn hàng</h2>
          <div>
            <p className=''>
              <span className=' text-sm font-semibold'>Ngày đặt hàng: </span>
              <span className='text-sm'>{dateOrderFormat}</span>
            </p>
            <p className=''>
              <span className='text-sm font-semibold'>
                Trạng thái đơn hàng:{' '}
              </span>
              <span className='text-sm'>
                {ORDER_STATUS[orderData?.data?.status]}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className='mt-4 p-4 bg-white rounded-md'>
        <h2 className='text-base font-semibold mb-4'>Sản phẩm</h2>
        {variantData?.data.map((variant: any) => {
          const selectedItem = orderData?.data.items.find(
            (item: any) =>  item.variant.id === variant.id,
          )

          return (
            <div
              key={variant.id}
              className='flex mt-4 items-center'>
              <div className='w-1/5 flex border rounded-md'>
                <img
                  src={variant.images}
                  alt='imageProduct'
                  className=''
                />
              </div>
              <div className='ml-4 w-3/5 space-y-1'>
                <p className='text-sm'>{variant.product?.name}</p>
                <p className='text-xs text-gray-500'>
                  SKU: {variant.sku}
                </p>
                <p className='text-xs text-gray-500'>
                  Cung cấp bởi <span className='text-blue-500'>FusionTech</span>
                </p>
              </div>
              <div className='w-1/5 text-right mt-4'>
                <p>{formatPrice(variant.price)}</p>
                <p className='text-xs text-gray-500'>X{selectedItem.quantity}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className='mt-4 p-4 bg-white rounded-md grid gap-4 '>
        <div className='flex justify-between items-center'>
          <p className='text-muted text-sm text-zinc-500'>Tổng tạm tính</p>
          <p className='font-medium text-md text-zinc-600'>
            {formatPrice(subTotal)}
          </p>
        </div>
        <div className='flex justify-between'>
          <p className='text-muted text-sm text-zinc-500'>Phí vận chuyển</p>
          <p className='font-medium text-md text-zinc-600'>Miễn phí</p>
        </div>
        <div className='flex justify-between'>
          <p className='text-muted text-sm text-zinc-500'>Mã giảm giá</p>
          <p className='text-sm'>{orderData?.data.voucher.code}</p>
          <p className='font-medium text-md text-zinc-600'>{formatPrice(orderData?.data.voucher.discount)}</p>
        </div>
        <div className='flex justify-between items-center '>
          <p className='text-muted text-sm text-zinc-500  '>Thành tiền</p>
          <p className='text-end font-bold text-red-600 text-lg'>
            {formatPrice(orderData?.data?.payment.amount)} <br />
            <span className='text-sm text-muted text-zinc-500 font-normal leading-tight'>
              (Đã bao gồm VAT)
            </span>
          </p>
        </div>
      </div>

      <div className='mt-4 p-4 bg-white rounded-md'>
        <h2 className='text-base font-semibold mb-4'>Phương thức thanh toán</h2>
        <hr />
        <div className=' mt-4 mb-4 text-sm flex justify-between'>
          <p>{PAYMENT_METHOD[orderData?.data?.payment.method]}</p>
          <p className='font-semibold'>
            {formatPrice(orderData?.data?.payment.amount)}
          </p>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailPage
