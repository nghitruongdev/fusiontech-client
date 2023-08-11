/** @format */

'use client'

import {
  useShow,
  IResourceComponentsProps,
  useOne,
  useCustom,
  useMany,
} from '@refinedev/core'
import { NumberField, TextField, DateField } from '@refinedev/chakra-ui'
import {
  Heading,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { IOrderItem, IVariant } from 'types'
import Image from 'next/image'
import { loginImg } from '@public/assets/images'
import { Show } from '@components/crud'

export default function ShowPage() {
  return <OrderShow />
}
const OrderShow: React.FC<IResourceComponentsProps> = () => {
  const {
    order: { isLoading },
  } = useData()
  return (
    <Show isLoading={isLoading}>
      <OrderDetailSummary className='' />
      <OrderItemList className='mt-4 shadow-md rounded-md' />
    </Show>
  )
}

const OrderDetailSummary = ({ className }: { className?: string }) => {
  const {
    user,
    payment,
    order: { data, isLoading },
  } = useData()

  const record = data?.data
  return (
    <div className={`p-4 border-2 border-gray-300 rounded-md ${className}`}>
      <div className='grid grid-cols-2 gap-8'>
        <div className='col-span-2 md:col-span-1 space-y-4'>
          <h4 className='text-lg font-semibold mb-2'>Order Detail</h4>
          <div className=''>
            {/* <h5 className='text-sm font-medium mb-2'>Id</h5> */}
            <p>ID: {record?.id ?? ''}</p>
          </div>
          <div className=''>
            {/* <h5 className='text-sm font-medium mb-2'>Note</h5> */}
            <p>Ghi chú: {record?.note}</p>
          </div>
          <div className=''>
            {/* <h5 className='text-sm font-medium mb-2'>Email</h5> */}
            <p>Email: {record?.email}</p>
          </div>
          <div className=''>
            {/* <h5 className='text-sm font-medium mb-2'>Purchased At</h5> */}
            <p>Ngày mua hàng: {record?.purchasedAt}</p>
          </div>
          <div className=''>
            {/* <h5 className='text-sm font-medium mb-2'>Status</h5> */}
            <p>Trạng thái: {record?.status}</p>
          </div>
          <div className=''>
            <h5 className='text-lg font-semibold mb-2'>User</h5>
            {user.isLoading ? (
              <p>Loading...</p>
            ) : (
              <>
                {user.data?.data && (
                  <div className='space-y-4'>
                    <p>ID: {user.data.data.id}</p>
                    <p>Tên: {user.data.data.fullName}</p>
                    <p>Giới tính: {user.data.data.gender}</p>
                    <p>Số điện thoại: {user.data.data.phoneNumber}</p>
                    <p>Địa chỉ: {user.data.data.defaultAddress}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <div className='col-span-2 md:col-span-1 space-y-4'>
          <h5 className='pl-4 text-lg font-semibold mb-2'>Payment</h5>
          <div className='border-l-2 border-gray-300 pl-4 '>
            {payment.isLoading ? (
              <p>Loading...</p>
            ) : (
              <>
                {payment.data?.data && (
                  <div className='space-y-4'>
                    <p>ID: {payment.data.data.id}</p>
                    <p>Giá tiền: {payment.data.data.amount}</p>
                    <p>paidAt: {payment.data.data.paidAt}</p>
                    <p>status: {payment.data.data.status}</p>
                    <p>method: {payment.data.data.method}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const OrderItemList = ({ className }: { className?: string }) => {
  const {
    items: { data, isLoading },
    variants: { data: variantData, isLoading: isVariantLoading },
  } = useData()
  const items = data?.data
  const variants = variantData?.data

  if (isLoading) return <div className={className}>Loading table...</div>
  if (!!items?.length)
    return (
      <div className={className}>
        <TableContainer
          rounded='md'
          border='1px'
          borderColor='gray.100'>
          <Table variant='simple'>
            <TableCaption>
              Chi tiết đơn hàng {`(${items.length} sản phẩm)`}
            </TableCaption>
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Hình ảnh</Th>
                <Th>Mã sản phẩm</Th>
                <Th>Tên sản phẩm</Th>
                <Th isNumeric>Giá</Th>
                <Th isNumeric>Số lượng</Th>
                <Th isNumeric>Thành tiền</Th>
              </Tr>
            </Thead>
            <Tbody>
              {items
                .map((item) => ({
                  ...item,
                  variant: variants?.find((v) => v.id === item.variant.id),
                }))
                .map(({ id, price, quantity, variant }) => (
                  <Tr key={id}>
                    <Td isNumeric>{id}</Td>
                    <Td>
                      <div className='flex justify-center'>
                        <Image
                          src={variant?.images?.[0] ?? loginImg}
                          alt={`${variant?.images?.[0]}`}
                          loading='lazy'
                          width='50'
                          height='50'
                        />
                      </div>
                    </Td>
                    <Td>ABCXYZ-0005</Td>
                    <Td>{variant?.product?.name ?? 'Loading...'}</Td>
                    <Td isNumeric>{price}</Td>
                    <Td isNumeric>{quantity}</Td>
                    <Td isNumeric>{price * quantity} VNĐ</Td>
                  </Tr>
                ))}
            </Tbody>
            {/* <Tfoot>
                        <Tr>
                            <Th>To convert</Th>
                            <Th>into</Th>
                            <Th isNumeric>multiply by</Th>
                        </Tr>
                    </Tfoot> */}
          </Table>
        </TableContainer>
      </div>
    )
  return <>No data</>
}

const useData = () => {
  const { queryResult } = useShow()

  const record = queryResult.data?.data

  const user = useOne({
    resource: 'users',
    id: record?.userId || '',
    queryOptions: {
      enabled: !!record,
    },
  })

  const payment = useOne({
    resource: 'payments',
    id: record?.paymentId || '',
    queryOptions: {
      enabled: !!record,
    },
  })

  const items = useCustom<IOrderItem[]>({
    url: record?._links?.items.href || '',
    method: 'get',
    meta: {
      _embeddedResource: 'orderItems',
    },
    queryOptions: {
      enabled: !!record,
    },
  })

  const variantsId = items.data?.data.map(({ variant }) => variant.id) || []
  const variants = useMany<IVariant>({
    resource: 'variants',
    ids: variantsId,
    queryOptions: {
      enabled: variantsId.length > 0,
    },
    meta: {
      query: {
        projection: 'product',
      },
    },
  })
  return {
    order: queryResult,
    user,
    payment,
    items,
    variants,
  }
}
