/** @format */

'use client'
import { useShow, IResourceComponentsProps } from '@refinedev/core'
import { NumberField, TextField } from '@refinedev/chakra-ui'
import { Heading } from '@chakra-ui/react'
import { Show } from '@components/crud'
import { IVoucher } from 'types'
import { formatDateTime, formatPrice } from '@/lib/utils'

export default function ShowPage() {
  return <BrandShow />
}

const BrandShow: React.FC<IResourceComponentsProps> = () => {
  const { queryResult } = useShow<IVoucher>()
  const { data, isLoading } = queryResult

  const record = data?.data

  return (
    <Show
      isLoading={isLoading}
      canDelete={record?.usage === 0}>
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <Heading
            as='h5'
            size='sm'
            mt={4}>
            Id
          </Heading>
          <NumberField value={record?.id ?? ''} />
        </div>
        <div>
          <Heading
            as='h5'
            size='sm'
            mt={4}>
            Mã voucher
          </Heading>
          <TextField value={record?.code} />
        </div>
        <div className=''>
          <Heading
            as='h5'
            size='sm'
            mt={4}>
            Giảm giá
          </Heading>
          <TextField value={`${record?.discount}%`} />
        </div>

        <div className=''>
          <Heading
            as='h5'
            size='sm'
            mt={4}>
            Giá trị đơn hàng tối thiểu
          </Heading>
          <TextField value={formatPrice(record?.minOrderAmount)} />
        </div>

        <div className=''>
          <Heading
            as='h5'
            size='sm'
            mt={4}>
            Ngày bắt đầu
          </Heading>
          <TextField value={formatDateTime(record?.startDate)} />
        </div>
        <div className=''>
          <Heading
            as='h5'
            size='sm'
            mt={4}>
            Ngày kết thúc
          </Heading>
          <TextField value={formatDateTime(record?.expirationDate)} />
        </div>
        <div className=''>
          <Heading
            as='h5'
            size='sm'
            mt={4}>
            Số tiền giảm giá tối đa
          </Heading>
          <TextField value={formatPrice(record?.maxDiscountAmount)} />
        </div>
        <div className=''>
          <Heading
            as='h5'
            size='sm'
            mt={4}>
            Số lượt sử dụng
          </Heading>
          <TextField value={record?.limitUsage} />
        </div>
        <div className=''>
          <Heading
            as='h5'
            size='sm'
            mt={4}>
            Số lượt sử dụng (mỗi người dùng)
          </Heading>
          <TextField value={record?.userLimitUsage} />
        </div>
        <div className=''>
          <Heading
            as='h5'
            size='sm'
            mt={4}>
            Mô tả
          </Heading>
          <TextField value={record?.description} />
        </div>
      </div>
    </Show>
  )
}
