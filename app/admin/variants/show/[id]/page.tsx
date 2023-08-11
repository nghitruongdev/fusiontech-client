/** @format */

'use client'

import { useShow, IResourceComponentsProps, useOne } from '@refinedev/core'
import { NumberField, TagField, TextField } from '@refinedev/chakra-ui'
import {
  Heading,
  HStack,
  Image,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { formatPrice } from '@/lib/utils'
import { IProduct, IVariant } from 'types'
import { PropsWithChildren, createContext, useContext, useEffect } from 'react'
import { API } from 'types/constants'
import { Show } from '@components/crud'

const page = () => {
  return (
    <ContextProvider>
      <VariantShow />
    </ContextProvider>
  )
}

export const VariantShow: React.FC<IResourceComponentsProps> = () => {
  const {
    queryResult: { isLoading },
    record,
    productData: { product, productStatus },
  } = useContextProvider()
  useEffect(() => {
    if (product) {
      console.log('product', product)
    }
  }, [product])
  const firstImage = record?.images?.[0]
  return (
    <Show isLoading={isLoading}>
      <div className='grid grid-cols-2'>
        <div className=''>
          <Heading
            as='h5'
            size='sm'
            mt={4}>
            Images
          </Heading>
          <div className=''>
            {/* If there are no images, display a placeholder */}
            {!firstImage && <>Hiển thị ảnh trống</>}
            {firstImage && (
              <Image
                sx={{ maxWidth: 300 }}
                src={firstImage}
                alt={product?.name}
              />
            )}
          </div>
          <div className='flex'>
            {record?.images?.map((item: any, idx) => (
              <Image
                sx={{ maxWidth: 50 }}
                src={item}
                key={item}
                alt={`${product?.name}-${idx}`}
              />
            ))}
          </div>
        </div>
        <div className=''>
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
            Sku
          </Heading>
          <TextField value={record?.sku} />
          <Heading
            as='h5'
            size='sm'
            mt={4}>
            Price
          </Heading>
          <NumberField value={formatPrice(record?.price)} />
          <Heading
            as='h5'
            size='sm'
            mt={4}>
            Số lượng khả dụng
          </Heading>
          <NumberField value={`${record?.availableQuantity}`} />

          <div className=''>
            <Heading
              as='h5'
              size='sm'
              mt={4}>
              Thông số kỹ thuật
            </Heading>
            {record?.specifications ? (
              <SpecificationsTable specifications={record.specifications} />
            ) : (
              <p>No attributes found.</p>
            )}
          </div>
        </div>
      </div>

      <Heading
        as='h5'
        size='sm'
        mt={4}>
        Thông tin sản phẩm
      </Heading>
      {productStatus === 'loading' && <>Product is Loading</>}
      {productStatus === 'success' && product && (
        <Table className='w-full border-collapse table-auto'>
          <Thead>
            <Tr>
              <Th className='border px-4 py-2 w-1/3'>Cột</Th>
              <Th className='border px-4 py-2 '>Giá trị</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td className='border px-4 py-2 w-1/3'>ID</Td>
              <Td className='border px-4 py-2'>{product.id}</Td>
            </Tr>
            <Tr>
              <Td className='border px-4 py-2 w-1/3'>Tên</Td>
              <Td className='border px-4 py-2'>{product.name}</Td>
            </Tr>

            <Tr>
              <Td className='border px-4 py-2 w-1/3'>Giá nhỏ nhất</Td>
              <Td className='border px-4 py-2'>{product.minPrice}</Td>
            </Tr>
            <Tr>
              <Td className='border px-4 py-2 w-1/3'>Giá lớn nhất</Td>
              <Td className='border px-4 py-2'>{product.maxPrice}</Td>
            </Tr>
            <Tr>
              <Td className='border px-4 py-2 w-1/3'>Sao đánh giá</Td>
              <Td className='border px-4 py-2'>{product.avgRating}</Td>
            </Tr>
            <Tr>
              <Td className='border px-4 py-2 w-1/3'>Số lượt đánh giá</Td>
              <Td className='border px-4 py-2'>{product.reviewCount}</Td>
            </Tr>
            <Tr>
              <Td className='border px-4 py-2 w-1/3'>Mô tả</Td>
              <Td className='border px-4 py-2'>{product.summary}</Td>
            </Tr>
            <Tr>
              <Td className='border px-4 py-2 w-1/3'>Giới thiệu</Td>
              <Td className='border px-4 py-2'>{product.description}</Td>
            </Tr>
          </Tbody>
        </Table>
      )}
    </Show>
  )
}
const SpecificationsTable = ({ specifications }) => {
  return (
    <table className='w-full border-collapse table-auto'>
      <thead>
        <tr>
          <th className='border px-4 py-2'>Name</th>
          <th className='border px-4 py-2'>Value</th>
        </tr>
      </thead>
      <tbody>
        {specifications.map((specifications) => (
          <tr key={specifications.id}>
            <td className='border px-4 py-2'>{specifications.name}</td>
            <td className='border px-4 py-2'>{specifications.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
const Context = createContext<State | null>(null)
const useContextProvider = () => {
  const ctx = useContext(Context)
  if (!ctx) throw new Error('Context Provider is missing')
  return ctx
}

type State = {
  record: IVariant | undefined
  productData: {
    product: IProduct | undefined
    productStatus: 'error' | 'loading' | 'success'
  }
} & ReturnType<typeof useShow<IVariant>>

const productResource = API['products']()
const variantResource = API['variants']()
const ContextProvider = ({ children }: PropsWithChildren) => {
  const showProps = useShow<IVariant>({
    meta: {
      query: {
        projection: variantResource.projection.withSpecs,
      },
    },
  })
  const { data: { data: record } = {} } = showProps.queryResult

  const { data: { data: product } = {}, status: productStatus } =
    useOne<IProduct>({
      resource: productResource.resource,
      id: record?.product?.id,
      queryOptions: {
        enabled: !!record?.product,
      },
    })
  return (
    <Context.Provider
      value={{
        ...showProps,
        record,
        productData: {
          product,
          productStatus,
        },
      }}>
      {children}
    </Context.Provider>
  )
}

const render = (variant: IVariant | undefined) => {
  if (!variant) {
  }
}
export default page
