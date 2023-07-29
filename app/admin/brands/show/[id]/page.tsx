'use client'
import { useShow, IResourceComponentsProps } from '@refinedev/core'
import { NumberField, TagField, TextField } from '@refinedev/chakra-ui'
import { Heading, HStack } from '@chakra-ui/react'
import { Show } from '@components/crud'

export default function ShowPage() {
  //   return <ChakraUIShowInferencer />
  return <BrandShow />
}

export const BrandShow: React.FC<IResourceComponentsProps> = () => {
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
        Name
      </Heading>
      <TextField value={record?.name} />
    </Show>
  )
}
