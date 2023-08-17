/** @format */

'use client'
import { useShow, IResourceComponentsProps } from '@refinedev/core'
import { NumberField, TextField } from '@refinedev/chakra-ui'
import { Heading } from '@chakra-ui/react'
import { Show } from '@components/crud'
import Image from 'next/image'
import { IVoucher } from 'types'

export default function ShowPage() {
  return <BrandShow />
}

const BrandShow: React.FC<IResourceComponentsProps> = () => {
  const { queryResult } = useShow<IVoucher>()
  const { data, isLoading } = queryResult

  const record = data?.data

  return (
    <Show isLoading={isLoading}>
      <div className='grid grid-cols-2 gap-4'>
        <div className='col-span-2'>
          <Heading
            as='h5'
            size='sm'
            mt={4}>
            Id
          </Heading>
          <NumberField value={record?.id ?? ''} />
          <Heading
            as='h5'
            size='sm'
            mt={4}>
            code
          </Heading>
          <TextField value={record?.code} />
          <Heading
            as='h5'
            size='sm'
            mt={4}>
            Giảm giá
          </Heading>
          <TextField value={record?.discount} />

          <Heading
            as='h5'
            size='sm'
            mt={4}>
            Giá trị đơn hàng tối thiểu
          </Heading>
          <TextField value={record?.minOrderAmount} />
          <Heading
            as='h5'
            size='sm'
            mt={4}>
            Số tiền giảm giá tối đa
          </Heading>
          <TextField value={record?.maxDiscountAmount} />
          <Heading
            as='h5'
            size='sm'
            mt={4}>
            Ngày bắt đầu
          </Heading>
          <TextField value={record?.startDate} />
          <Heading
            as='h5'
            size='sm'
            mt={4}>
            Ngày kết thúc
          </Heading>
          <TextField value={record?.expirationDate} />
          <Heading
            as='h5'
            size='sm'
            mt={4}>
            Giới hạn sử dụng
          </Heading>
          <TextField value={record?.limitUsage} />
          <Heading
            as='h5'
            size='sm'
            mt={4}>
            Giới hạn sử dụng của người dùng
          </Heading>
          <TextField value={record?.userLimitUsage} />
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
