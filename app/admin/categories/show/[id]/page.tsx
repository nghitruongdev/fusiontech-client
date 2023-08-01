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
import Image from 'next/image'
import { Box } from 'lucide-react'

export default function ShowPage() {
  return <CategoryShow />
}

const CategoryShow: React.FC<IResourceComponentsProps> = () => {
  const { queryResult } = useShow()
  const { data, isLoading } = queryResult

  const record = data?.data

  return (
    <Show isLoading={isLoading}>
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-row justify-center items-center">
          {record?.image?.url ? (
            <Image
              src={record.image.url}
              alt={record.name}
              width={200}
              height={200}
              style={{ width: '200px', height: '200px', objectFit: 'contain' }}
              className="shadow-lg rounded-lg"
            />
          ) : (
            <Box>No image available</Box>
          )}
        </div>
        <div className="col-span-2">
          <Heading as="h5" size="sm" mt={4}>
            Id
          </Heading>
          <NumberField value={record?.id ?? ''} />
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
        </div>
      </div>
    </Show>
  )
}
