/** @format */

'use client'

import { useShow, IResourceComponentsProps } from '@refinedev/core'
import { NumberField, TextField } from '@refinedev/chakra-ui'
import { Heading } from '@chakra-ui/react'
import { Show } from '@components/crud'
import Image from 'next/image'
import { IUser } from 'types'

export default function ShowPage() {
  return <UserShow />
}
const UserShow: React.FC<IResourceComponentsProps> = () => {
  const { queryResult } = useShow<IUser>()
  const { data, isLoading } = queryResult

  const record = data?.data

  return (
    <Show isLoading={isLoading}>
      <div className='grid grid-cols-3 gap-4'>
        <div className='flex flex-row justify-center items-center'>
          <Image
            src={
              record?.image ??
              'https://firebasestorage.googleapis.com/v0/b/fusiontech-vnco4.appspot.com/o/images%2Fvariants%2FlogostuImage.png?alt=media&token=90709f04-0996-4779-ab80-f82e99c62041'
            }
            alt={record?.fullName ?? ''}
            width={200}
            height={200}
            style={{ width: '200px', height: '200px', objectFit: 'contain' }}
            className='shadow-lg rounded-lg'
          />
        </div>
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
            Firebase Uid
          </Heading>
          <TextField value={record?.firebaseUid} />
          <Heading
            as='h5'
            size='sm'
            mt={4}>
            Tên đầy đủ
          </Heading>
          <TextField value={record?.fullName} />
          <Heading
            as='h5'
            size='sm'
            mt={4}>
            Email
          </Heading>
          <TextField value={record?.email} />
          <Heading
            as='h5'
            size='sm'
            mt={4}>
            Số điện thoại
          </Heading>
          <TextField value={record?.phoneNumber} />
          <Heading
            as='h5'
            size='sm'
            mt={4}>
            Giới tính
          </Heading>
          <TextField value={record?.gender} />
        </div>
      </div>
    </Show>
  )
}
