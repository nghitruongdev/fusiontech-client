/** @format */

'use client'
import { Pagination } from '@components/pagination'
import { usePageable } from '@components/pagination/usePageable'
import ProductCard from '@components/store/front/product/ProductCard'
import { GetListResponse, useList, useMany } from '@refinedev/core'
import { PropsWithChildren } from 'react'
import { IProduct, Page } from 'types'
import { API } from 'types/constants'

const {
  getProductsDiscount,
  getAllProducts,
  getHotProducts,
  getProductsLastest,
  getSellingProducts,
  resource,
  projection: { full },
} = API.products()

const SearchResult = ({
  children,
  totalPages,
  items,
}: PropsWithChildren<{ totalPages: number; items?: IProduct[] }>) => {
  const pageable = usePageable()
  return (
    <div>
      {children}
      {!!items?.length && (
        <div className='bg-white'>
          <div className='flex flex-row flex-wrap'>
            {items.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                className='w-1/6 gap-4'
              />
            ))}
          </div>
        </div>
      )}
      <Pagination
        justifyContent={'center'}
        {...pageable}
        pageCount={totalPages}
        setPageSize={undefined}
      />
    </div>
  )
}

export const AllProduct = () => {
  const pageable = usePageable()
  const { current, pageSize } = pageable

  const {
    data: { data: products = [], page } = {} as GetListResponse<IProduct>,
  } = useList<IProduct>({
    resource: `${getAllProducts()}`,
    pagination: {
      pageSize,
      current,
    },
    meta: {
      resource,
      query: {
        projection: full,
      },
    },
  })

  return (
    <SearchResult
      totalPages={(page as Page)?.totalPages}
      items={products}
    />
  )
}
export const HotProduct = () => {
  const pageable = usePageable()
  const { current, pageSize } = pageable

  const {
    data: { data: products = [], page } = {} as GetListResponse<IProduct>,
  } = useList<IProduct>({
    resource: `${getHotProducts(pageSize)}`,
    pagination: {
      current,
    },
    meta: {
      resource,
      query: {
        projection: full,
      },
    },
  })

  return (
    <SearchResult
      totalPages={(page as Page)?.totalPages}
      items={products}
    />
  )
}

export const ProductLastest = () => {
  const pageable = usePageable()
  const { current, pageSize } = pageable

  const {
    data: { data: products = [], page } = {} as GetListResponse<IProduct>,
  } = useList<IProduct>({
    resource: `${getProductsLastest(pageSize)}`,
    pagination: {
      current,
    },
    meta: {
      resource,
      query: {
        projection: full,
      },
    },
  })

  return (
    <SearchResult
      totalPages={(page as Page)?.totalPages}
      items={products}
    />
  )
}

export const SellingProducts = () => {
  const pageable = usePageable()
  const { current, pageSize } = pageable

  const now = new Date()
  // Get the current year from the 'now' date
  const currentYear = now.getFullYear()

  // Create a new Date object for the start of the year
  const startDateOfYear = new Date(currentYear, 0, 1)

  // Create a new Date object for the last day of the year
  const lastDateOfYear = new Date(currentYear, 11, 31)
  const { data: { data, page } = {} as GetListResponse<{ id: number }> } =
    useList<{ id: number }>({
      resource: `${getSellingProducts(
        startDateOfYear,
        lastDateOfYear,
        pageSize,
      )}`,
      pagination: {
        current,
      },
      meta: {
        resource,
        query: {
          projection: full,
        },
      },
    })
  const ids = data?.map((item) => item.id) ?? []
  const { data: { data: products = [] } = {}, isFetching } = useMany<IProduct>({
    resource: 'products',
    ids: ids,
    meta: {
      query: {
        projection: full,
      },
    },
    queryOptions: {
      enabled: !!ids.length,
    },
  })

  return (
    <SearchResult
      totalPages={(page as Page)?.totalPages}
      items={products}
    />
  )
}
