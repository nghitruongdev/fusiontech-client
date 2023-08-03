'use client'
import { useShow, IResourceComponentsProps } from '@refinedev/core'
import { NumberField, TagField, TextField } from '@refinedev/chakra-ui'
import { Heading, HStack } from '@chakra-ui/react'
import { Show } from '@components/crud'
import Image from 'next/image'
import { Box } from 'lucide-react'
import { FirebaseImage } from 'types'
import { Images } from 'types/constants'

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
            <Image
              alt="/"
              width={200}
              height={200}
              src="https://firebasestorage.googleapis.com/v0/b/fusiontech-vnco4.appspot.com/o/images%2Fvariants%2FlogostuImage.png?alt=media&token=90709f04-0996-4779-ab80-f82e99c62041"
            />
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
        </div>
      </div>
    </Show>
  )
}
