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
import { PaginationProps } from 'src/components/pagination/index'
import { NoResultFound } from '@components/no-result'

const {
  getAllProductActive,
  getHotProducts,
  getProductsLastest,
  getSellingProducts,
  resource,
  projection: { full },
} = API.products()

const SearchResult = ({
  children,
  items,
  ...props
}: PropsWithChildren<PaginationProps & { items?: IProduct[] }>) => {
  const [promise, setPromise] = useState<Promise<unknown>>(waitPromise(150))
  use(promise)
  const { current, pageSize } = props
  useEffect(() => {
    setPromise(waitPromise(150))
  }, [current, pageSize])

  if (!items?.length) return <NoResultFound />

  return (
    <div>
      {children}
      <div className='bg-white'>
        <div className='grid grid-cols-5 gap-4'>
          {items?.map((item) => (
            <ProductCard.Provider
              key={item.id}
              product={item}>
              <ProductCard.ProductContainer>
                <ProductCard.Discount />
                <ProductCard.Image />
                <div className='px-2 flex flex-col'>
                  <ProductCard.Brand />
                  <ProductCard.Name />
                  <ProductCard.Price />
                  <ProductCard.Summary />
                  <ProductCard.AvgRating />
                </div>
              </ProductCard.ProductContainer>
            </ProductCard.Provider>
          ))}
        </div>
      </div>
      <PaginationWithPageable {...props} />
    </div>
  )
}

export const AllProduct = () => {
  const pageable = usePageable()
  const { current, pageSize } = pageable

  const {
    data: { data: products = [], page } = {} as GetListResponse<IProduct>,
  } = useList<IProduct>({
    resource: getAllProductActive,
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
    queryOptions: {
      suspense: true,
    },
  })

  return (
    <SearchResult
      {...pageable}
      pageCount={(page as Page).totalPages}
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
    queryOptions: {
      suspense: true,
    },
  })

  return (
    <SearchResult
      {...pageable}
      pageCount={(page as Page)?.totalPages}
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
    queryOptions: {
      suspense: true,
    },
  })

  return (
    <SearchResult
      {...pageable}
      pageCount={(page as Page)?.totalPages}
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
      queryOptions: {
        suspense: true,
      },
    })
  const ids = data?.map((item) => item.id) ?? []
  const { data: { data: products = [] } = {} } = useMany<IProduct>({
    resource: 'products',
    ids: ids,
    meta: {
      query: {
        projection: full,
      },
    },
    queryOptions: {
      enabled: !!ids.length,
      suspense: true,
    },
  })

  return (
    <SearchResult
      {...pageable}
      pageCount={(page as Page)?.totalPages}
      items={products}
    />
  )
}
