/** @format */

'use client'
import { Pagination } from '@components/pagination'
import { usePageable } from '@components/pagination/usePageable'
import ProductCard from '@components/store/front/product/ProductCard'
import { GetListResponse, useList } from '@refinedev/core'
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
        <div className='flex flex-row'>
          <div className=' grid grid-col 6'>
            {items.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
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

// export const SellingProducts = () => {
//   const pageable = usePageable()
//   const { current, pageSize } = pageable

//   const {
//     data: { data: products = [], page } = {} as GetListResponse<IProduct>,
//   } = useList<IProduct>({
//     resource: `${getSellingProducts(pageSize)}`,
//     pagination: {
//       current,
//     },
//     meta: {
//       resource,
//       query: {
//         projection: full,
//       },
//     },
//   })

//   return (
//     <SearchResult
//       totalPages={(page as Page)?.totalPages}
//       items={products}
//     />
//   )
// }
