/** @format */
'use client'
import React from 'react'
import { BiChevronLeft } from 'react-icons/bi'
import {
  IOrder,
  IVariant,
  IVoucher,
  OrderStatusText,
  OrderStatus as OrderStatusType,
  PaymentStatusLabel,
  IOrderStatus,
} from 'types'
import { API, API_URL, statusColor } from 'types/constants'
import { useCustom, useMany, useUpdate } from '@refinedev/core'
import { useParams, useRouter } from 'next/navigation'
import { useAuthUser } from '@/hooks/useAuth/useAuthUser'
import Link from 'next/link'
import { formatDateTime, formatPrice } from '@/lib/utils'
import { Badge, Button, Image } from '@chakra-ui/react'
import { useDialog } from '@components/ui/DialogProvider'
import { onError, onSuccess } from '@/hooks/useCrudNotification'
import { useHeaders } from '@/hooks/useHeaders'

const OrderDetailPage = () => {
  // lấy id từ url
  const param = useParams()
  const id = param.id as string

  // lấy number phone user
  const { user } = useAuthUser()
  // Đoạn code để lấy thông tin đơn hàng dựa vào orderId
  const orderFull = `${API_URL}/orders/${id}?projection=full`
  const { data: { data: order } = {}, refetch: refetchOrder } =
    useCustom<IOrder>({
      url: orderFull,
      method: 'get',
      queryOptions: {
        enabled: !!orderFull,
      },
    })
  //   console.log(orderData)

  // format lại date của ngày order
  const purchasedAt = order?.purchasedAt
  const dateOrderFormat = formatDateTime(purchasedAt)
  //thay đổi trạng thái thành tiếng Việt
  //   const ORDER_STATUS = {
  //     VERIFY: 'Đã xác nhận',
  //     PREPARED: 'Đang chuẩn bị',
  //     ON_DELIVERY: 'Đang giao',
  //     COMPLETED: 'Giao thành công',
  //     FAILED: 'Trả hàng',
  //     CANCELLED: 'Đã huỷ',
  //     DENIED: 'Đã huỷ bởi hệ thống',
  //     PLACED: 'Chờ xác nhận',
  //   }

  const cancellableStatuses = ['VERIFIED', 'PLACED', 'PREPARED', 'PREPARED']
  const PAYMENT_METHOD = {
    CASH: 'Thanh toán khi nhận hàng',
  }

  // lấy địa chỉ default của user
  const { findAllByUserId, defaultAddressByUserId } = API['shippingAddresses']()
  const { findByFirebaseId } = API['users']()
  const { data, status } = useCustom({
    url: `${API_URL}/${defaultAddressByUserId(order?.userId)}`,
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

  const discountPrice = (price: number, discount?: number) =>
    ((100 - (discount ?? 0)) / 100) * price
  // lấy tổng tiền sản phẩm
  let subTotal = 0

  if (order?.items) {
    order.items.forEach(({ discount, price, quantity }) => {
      subTotal += discountPrice(price, discount) * quantity
    })
  }

  // tính tổng tiền sau khi discount (total = subtotal - (subtotal * discount%))
  let total = 0
  if (order?.items) {
    total = subTotal
    if (order?.voucher) {
      const discountPercent = (order.voucher as IVoucher)?.discount / 100
      const discountAmount = subTotal * discountPercent
      total = subTotal - discountAmount
    }
  }
  // lấy variant product theo variantId
  const { resource } = API.variants()

  // Tạo danh sách IDs cần truy vấn
  const variantIds = order?.items?.map((item) => item.variant.id) || []
  console.log(variantIds)
  // const variantIds = order?.items.variant.id

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

  const paymentStatus =
    PaymentStatusLabel[
      order?.payment?.status as keyof typeof PaymentStatusLabel
    ]
  return (
    <div className='mx-auto '>
      <div className='flex items-center'>
        <Link href={'/account/orders/VERIFY'}>
          <button className='bg-white rounded-md mr-2 hover:bg-blue-700 '>
            <BiChevronLeft className='w-8 h-8 text-gray-500 hover:text-white' />
          </button>
        </Link>
        <h1 className='text-2xl font-semibold'>Chi tiết đơn hàng</h1>
      </div>

      <div className='flex mt-4'>
        <div className='w-1/2 mr-4 p-4 bg-white rounded-md'>
          <h2 className='text-base font-semibold mb-4'>Thông tin người nhận</h2>
          <div className='grid gap-2'>
            <p className=''>
              <span className='text-sm font-semibold'>Tên: </span>
              <span className='text-sm'>{order?.user?.firstName}</span>
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
          <h2 className='text-base font-semibold mb-4 '>Thông tin đơn hàng</h2>
          <div className='grid gap-2'>
            <p className=''>
              <span className=' text-sm font-semibold'>Mã đơn hàng: </span>
              <span className='text-sm'>{order?.id}</span>
            </p>
            <p className=''>
              <span className=' text-sm font-semibold'>Ngày đặt hàng: </span>
              <span className='text-sm'>{dateOrderFormat}</span>
            </p>
            <p className=''>
              <span className='text-sm font-semibold'>
                Trạng thái đơn hàng:{' '}
              </span>
              <Badge
                variant='outline'
                colorScheme={statusColor({
                  name: order?.status as string,
                } as IOrderStatus)}
                px='4'
                py='1'
                rounded='md'>
                {OrderStatusText[order?.status as string as OrderStatusType]
                  ?.text ?? ''}
              </Badge>
            </p>
          </div>
        </div>
      </div>

      <div className='mt-4 p-4 bg-white rounded-md'>
        <h2 className='text-base font-semibold mb-4'>Sản phẩm</h2>
        {variantData?.data.map((variant: IVariant) => {
          const selectedItem = order?.items?.find(
            (item) => item.variant.id === variant.id,
          )

          return (
            <div
              key={variant.id}
              className='flex mt-4 items-center'>
              <div className='w-1/5 flex border rounded-md'>
                <Image
                  src={variant.images?.[0]}
                  width='200'
                  height='200'
                  alt='imageProduct'
                  className=''
                />
              </div>
              <div className='ml-4 w-3/5 space-y-1'>
                <p className='text-sm'>{variant.product?.name}</p>
                <p className='text-xs text-gray-500'>SKU: {variant.sku}</p>
                {/* <p className='text-xs text-gray-500'>
                  Cung cấp bởi <span className='text-blue-500'>FusionTech</span>
                </p> */}
              </div>
              {selectedItem && (
                <div className='w-1/5 text-right mt-4'>
                  <p>
                    {formatPrice(
                      discountPrice(selectedItem.price, selectedItem.discount),
                    )}
                  </p>
                  {selectedItem.discount && (
                    <p className=' line-through'>
                      {formatPrice(selectedItem.price)}
                    </p>
                  )}
                  <p className='text-xs text-gray-500'>
                    X{selectedItem?.quantity}
                  </p>
                </div>
              )}
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
        {order?.voucher && (
          <div className='flex justify-between'>
            <div className=''>
              <p className='text-muted text-sm text-zinc-500'>Mã giảm giá:</p>
              <Badge
                className='text-sm ml-1'
                variant='secondary'>
                {(order?.voucher as IVoucher)?.code}
              </Badge>
            </div>
            <p className='font-medium text-md text-zinc-600'>
              {(order?.voucher as IVoucher)?.discount ?? 0}%
            </p>
          </div>
        )}

        <div className='flex justify-between items-center '>
          <p className='text-muted text-sm text-zinc-500  '>Thành tiền</p>
          <p className='text-end font-bold text-red-600 text-lg'>
            {formatPrice(total)} <br />
            <span className='text-sm text-muted text-zinc-500 font-normal leading-tight'>
              (Đã bao gồm VAT)
            </span>
          </p>
        </div>
      </div>
      {order?.payment?.method && (
        <div className='mt-4 p-4 bg-white rounded-md'>
          <h2 className='text-base font-semibold mb-4'>Thanh toán</h2>
          <hr />
          <div className=' mt-4 mb-4 text-sm flex justify-between'>
            <p>Phương thức thanh toán</p>
            <p>
              {
                PAYMENT_METHOD[
                  order.payment.method as keyof typeof PAYMENT_METHOD
                ]
              }
            </p>
          </div>
          <div className=' mt-4 mb-4 text-sm flex justify-between'>
            <p>Số tiền thanh toán</p>
            <p className='font-semibold'>{formatPrice(order.payment.amount)}</p>
          </div>
          <div className=' mt-4 mb-4 text-sm flex justify-between'>
            <p>Trạng thái thanh toán</p>
            <p>
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
            </p>
          </div>
        </div>
      )}
      {cancellableStatuses.includes(order?.status as string) && order?.id && (
        <div className='flex justify-end mt-4'>
          <CancelOrderButton
            id={order.id}
            onSuccess={refetchOrder}
          />
        </div>
      )}
    </div>
  )
}

const CancelOrderButton = ({
  id,
  onSuccess: onSucessFn,
}: {
  id: string | number
  onSuccess: () => void
}) => {
  const { confirm } = useDialog()
  const { mutateAsync, status } = useUpdate()
  const { getAuthHeader } = useHeaders()
  const { resource } = API.orders()
  const router = useRouter()
  const handleCancel = async () => {
    const result = await confirm({
      message: 'Bạn có chắc chắn muốn huỷ đơn hàng?',
      header: 'Xác nhận huỷ đơn hàng',
    })
    if (!result.status) {
      console.log('No longer want to cancel order')
      return
    }
    mutateAsync(
      {
        resource,
        id,
        values: {
          status: 'CANCELLED',
        },
        errorNotification: onError,

        successNotification: (...params) =>
          onSuccess('edit', ...params, 'Huỷ đơn hàng thành công'),
        meta: {
          headers: {
            ...getAuthHeader(),
          },
        },
      },
      {
        onSuccess() {
          onSucessFn()
        },
      },
    )
  }
  return (
    <Button
      onClick={handleCancel}
      colorScheme='red'
      isLoading={status === 'loading'}
      isDisabled={status === 'loading'}>
      Huỷ đơn hàng
    </Button>
  )
}
export default OrderDetailPage
