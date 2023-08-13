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

export const BrandShow: React.FC<IResourceComponentsProps> = () => {
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
            discount
          </Heading>
          <TextField value={record?.discount} />
          <Heading
            as='h5'
            size='sm'
            mt={4}>
            description
          </Heading>
          <TextField value={record?.description} />
          <Heading
            as='h5'
            size='sm'
            mt={4}>
            minOrderAmount
          </Heading>
          <TextField value={record?.minOrderAmount} />
          <Heading
            as='h5'
            size='sm'
            mt={4}>
            maxDiscountAmount
          </Heading>
          <TextField value={record?.maxDiscountAmount} />
          <Heading
            as='h5'
            size='sm'
            mt={4}>
            startDate
          </Heading>
          <TextField value={record?.startDate} />
          <Heading
            as='h5'
            size='sm'
            mt={4}>
            limitUsage
          </Heading>
          <TextField value={record?.limitUsage} />
          <Heading
            as='h5'
            size='sm'
            mt={4}>
            userLimitUsage
          </Heading>
          <TextField value={record?.userLimitUsage} />
        </div>
      </div>
    </Show>
  )
}
