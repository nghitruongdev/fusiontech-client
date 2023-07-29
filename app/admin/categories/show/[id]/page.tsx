'use client'

import { useShow, IResourceComponentsProps } from '@refinedev/core'
import {
  NumberField,
  TagField,
  TextField,
  MarkdownField,
} from '@refinedev/chakra-ui'
import { Heading, HStack } from '@chakra-ui/react'
import { Show } from '@components/crud'

export default function ShowPage() {
  return <CategoryShow />
}

const CategoryShow: React.FC<IResourceComponentsProps> = () => {
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
        Image
      </Heading>
      <MarkdownField value={record?.image?.url} />
      <Heading as="h5" size="sm" mt={4}>
        Name
      </Heading>
      <TextField value={record?.name} />
      <Heading as="h5" size="sm" mt={4}>
        Slug
      </Heading>
      <TextField value={record?.slug} />
      <Heading as="h5" size="sm" mt={4}>
        Description
      </Heading>
      <TextField value={record?.description} />
      <Heading as="h5" size="sm" mt={4}>
        Category Specs
      </Heading>
      <HStack spacing="12px">
        {record?.categorySpecs?.map((item: any) => (
          <TagField value={item} key={item} />
        ))}
      </HStack>
    </Show>
  )
}
