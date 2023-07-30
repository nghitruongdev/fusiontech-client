'use client'

import { useShow, IResourceComponentsProps } from '@refinedev/core'
import { NumberField, TagField, TextField } from '@refinedev/chakra-ui'
import { Heading, HStack } from '@chakra-ui/react'
import { Show } from '@components/crud'

export default function ShowPage() {
  return <UserShow />
}

export const UserShow: React.FC<IResourceComponentsProps> = () => {
  const { queryResult } = useShow()
  const { data, isLoading } = queryResult

  const record = data?.data

  return (
    <Show isLoading={isLoading}>
      <Heading as="h5" size="sm" mt={4}>
        Id
      </Heading>
      <NumberField value={record?.id ?? ''} />
      <Heading as="h5" size="sm" mt={4}>
        Firebase Uid
      </Heading>
      <TextField value={record?.firebaseUid} />
      <Heading as="h5" size="sm" mt={4}>
        Full Name
      </Heading>
      <TextField value={record?.fullName} />
    </Show>
  )
}
