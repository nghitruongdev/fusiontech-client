/** @format */

'use client'
import { waitPromise } from '@/lib/promise'
import { Pagination } from '@components/pagination'
import PaginationWithPageable from '@components/pagination/pagination-pageable'
import { usePageable } from '@components/pagination/usePageable'
import ProductCard from '@components/store/front/product/ProductCard'
import { GetListResponse, useList, useMany } from '@refinedev/core'
import Image from 'next/image'
import { PropsWithChildren, use, useEffect, useState } from 'react'
import { IProduct, Page } from 'types'
import { API } from 'types/constants'

const {
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

  const [promise, setPromise] = useState<Promise<unknown>>(waitPromise(300))
  use(promise)

  if (!items?.length)
    return (
      <div className='flex flex-col items-center justify-center gap-4 w-full h-[450px] bg-white'>
        <Image
          alt='no-result-found'
          src='https://firebasestorage.googleapis.com/v0/b/fusiontech-vnco4.appspot.com/o/images%2Fno-result-found.png?alt=media&token=27af6304-ba76-445f-a2b0-59aa52815296'
          width={'300'}
          height={'300'}
        />
        <p className='text-3xl text-zinc-600 font-semibold'>
          {'Không có kết quả :('}
        </p>
      </div>
    )

  return (
    <div>
      {children}
      <div className='bg-white'>
        <div className='grid grid-cols-5 gap-4'>
          {items?.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              className=''
            />
          ))}
        </div>
      </div>
      <PaginationWithPageable
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
    resource: getAllProducts(),
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
