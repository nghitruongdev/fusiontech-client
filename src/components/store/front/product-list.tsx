/**
 * eslint-disable react/display-name
 *
 * @format
 */

'use client'
import { IProduct } from 'types'
import Link from 'next/link'
import { useCustom, useMany } from '@refinedev/core'
import Slider from 'react-slick'
import { PropsWithChildren, Suspense, use, useEffect, useRef } from 'react'
import SliderButton from '@components/ui/SliderButton'
import { ChevronRight } from 'lucide-react'

import { API } from 'types/constants'
import ProductCard from './product/ProductCard'
import { useIntersectionObserver } from 'usehooks-ts'
import { Skeleton } from '@components/ui/Skeleton'
import { cn } from 'components/lib/utils'
import { useVisibleObserver } from '@/hooks/useVisibleObserver'

const {
  getAllProductActive,
  getHotProducts,
  getProductsLastest,
  getProductsDiscount,
  getSellingProducts,
  resource,
  projection: { full },
} = API.products()

const sliderSettings = {
  infinite: true,
  speed: 500,
  slidesToShow: 6,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  cssEase: 'linear',
  swipeToSlide: true,
  // arrows: false,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 6,
        slidesToScroll: 3,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 4,
      },
    },
    {
      breakpoint: 640,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
      },
    },
  ],
}

const Loading = ({
  cols = 5,
  rows = 1,
  className,
}: {
  cols?: number
  rows?: number
  className?: string
}) => {
  return (
    <div className={cn(`grid gap-4`, className)}>
      {Array.from({ length: rows }).map((row, idx) => (
        <div
          key={idx}
          className={`grid grid-cols-${cols}`}>
          {Array.from({ length: cols }).map((col, colIdx) => (
            <div
              key={colIdx}
              className={`flex flex-col gap-2 p-4`}>
              <Skeleton className='w-full h-[150px]' />
              <Skeleton className='w-2/5 h-4 rounded-none' />
              <Skeleton className='w-full h-4 rounded-none' />
              <Skeleton className='w-full h-4 rounded-none' />
              <Skeleton className='w-full h-4 rounded-none' />
              <Skeleton className='w-full h-16 rounded-none' />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

const ProductListSuspense = ({ children }: PropsWithChildren) => {
  return (
    <Suspense
      fallback={
        <Loading
          cols={5}
          className={'mt-5'}
        />
      }>
      {children}
    </Suspense>
  )
}

const DiscountList = () => {
  const { ref, isVisible } = useVisibleObserver<HTMLDivElement>()
  const { data: { data: products = [] } = {} } = useCustom<IProduct[]>({
    url: `${getProductsDiscount()}?projection=${full}`,
    method: 'get',
    meta: { resource },
    queryOptions: {
      enabled: !!isVisible,
      suspense: true,
    },
  })
  const sliderRef = useRef<Slider | null>(null)
  const backgroundImageURL =
    'https://videohive.img.customer.envatousercontent.com/files/a520307e-8e7a-4b9c-9cb5-60cb91405691/inline_image_preview.jpg?auto=compress%2Cformat&fit=crop&crop=top&max-h=8000&max-w=590&s=8faba409bcd263eeb170d860015ee274'
  return (
    <>
      <div
        ref={ref}
        id='discount'
        className={`grid grid-cols-6 rounded-lg bg-cover bg-bottom`}
        style={{ backgroundImage: `url(${backgroundImageURL})` }}>
        <div className='col-span-6'>
          {/* <p className='text-white font-semibold uppercase'>Giảm giá sốc</p> */}
          <div className='relative p-1 my-2 md:my-4'>
            <SliderButton sliderRef={sliderRef} />
            <Slider
              {...sliderSettings}
              ref={(slider) => (sliderRef.current = slider)}>
              {products.map((item) => (
                <ProductCard.Provider
                  key={item.id}
                  product={item}>
                  <ProductCard.LinkContainer>
                    <ProductCard.Discount />
                    <ProductCard.Image />
                    <div className='px-2 flex flex-col'>
                      <ProductCard.Brand />
                      <ProductCard.Name />
                      <ProductCard.Price />
                      <ProductCard.AvgRating />
                    </div>
                  </ProductCard.LinkContainer>
                </ProductCard.Provider>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </>
  )
}

const AllProducts = () => {
  const { ref, isVisible } = useVisibleObserver<HTMLDivElement>()
  const { data: { data: products = [] } = {} } = useCustom<IProduct[]>({
    url: `${getAllProductActive}?projection=${full}`,
    method: 'get',
    meta: { resource },
    queryOptions: {
      enabled: isVisible,
      suspense: true,
    },
  })

  return (
    <div
      ref={ref}
      className='bg-white rounded-lg '
      id='others'>
      <div className='flex  justify-between items-center px-3 pt-3 md:my-4 lg:mt-10  '>
        <h5 className='font-bold  text-xl uppercase '>FusionTech</h5>
        <Link href={'/search/san-pham/tat-ca'}>
          <div className=' flex flex-row items-center '>
            <p className='text-base font-semibold text-zinc-500'>Xem tất cả </p>
            <ChevronRight
              size={16}
              strokeWidth={1}
            />
          </div>
        </Link>
      </div>
      <hr />
      <div
        aria-label='product-list'
        className='flex flex-row overflow-auto max-h-[800px] gap-2 pl-2 pt-2 pb-1'>
        {/* <div className='grid grid-cols-5 gap-3'> */}
        {products.map((item) => (
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
  )
}

const Newest = () => {
  const { ref, isVisible } = useVisibleObserver<HTMLDivElement>()
  const { data: { data: products = [] } = {} } = useCustom<IProduct[]>({
    url: `${getProductsLastest(10)}&projection=${full}`,
    method: 'get',
    meta: { resource },
    queryOptions: {
      enabled: isVisible,
    },
  })
  return (
    <div
      ref={ref}
      className='bg-white rounded-lg '
      id='newest'>
      <div className='flex  justify-between items-center px-3 pt-3 md:my-4 lg:mt-10  '>
        <h5 className='font-bold  text-xl uppercase '>Sản phẩm mới nhất</h5>
        <Link href={'/search/san-pham/san-pham-moi-nhat'}>
          <div className=' flex flex-row items-center '>
            <p className='text-base font-semibold text-zinc-500'>Xem tất cả </p>
            <ChevronRight
              size={16}
              strokeWidth={1}
            />
          </div>
        </Link>
      </div>
      <hr />
      <div
        aria-label='product-list'
        className='flex flex-row overflow-auto max-h-[800px] gap-2 pl-2 pt-2 pb-1'>
        {/* <div className='grid grid-cols-5 gap-3'> */}
        {products.map((item) => (
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
  )
}

const HotProduct = () => {
  const { isVisible, ref } = useVisibleObserver<HTMLDivElement>()
  const { data: { data: products = [] } = {} } = useCustom<IProduct[]>({
    url: `${getHotProducts(10)}&projection=${full}`,
    method: 'get',
    meta: { resource },
    queryOptions: {
      enabled: isVisible,
      suspense: true,
    },
  })
  return (
    <div
      ref={ref}
      className='bg-white rounded-lg '
      id='top-hot'>
      <div className='flex  justify-between items-center px-3 pt-3 md:my-4 lg:mt-10  '>
        <h5 className='font-bold  text-xl uppercase '>Sản phẩm 🔥</h5>
        <Link href={'/search/san-pham/san-pham-hot'}>
          <div className=' flex flex-row items-center '>
            <p className='text-base font-semibold text-zinc-500'>Xem tất cả </p>
            <ChevronRight
              size={16}
              strokeWidth={1}
            />
          </div>
        </Link>
      </div>
      <hr />

      <div
        aria-label='product-list'
        className='flex flex-row overflow-auto max-h-[800px] gap-2 pl-2 pt-2 pb-1'>
        {/* <div className='grid grid-cols-5 gap-3'> */}
        {products.map((item) => (
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
  )
}

const SellingProducts = () => {
  const { ref, isVisible } = useVisibleObserver<HTMLDivElement>()
  const startDate = new Date('2022-08-30')
  const endDate = new Date('2024-08-30')

  const { data: { data } = {} } = useCustom<{ id: number }[]>({
    // url: `http://100.82.6.136:8080/api/statistical/best-seller?startDate=${startDate}&endDate=${endDate}&size=${size}`,
    url: `${getSellingProducts(startDate, endDate)}`,
    method: 'get',
    meta: { resource },
    queryOptions: {
      enabled: isVisible,
      suspense: true,
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
      enabled: !!ids.length && isVisible,
      suspense: true,
    },
  })

  return (
    <div
      ref={ref}
      className='bg-white rounded-lg '
      id='top-sell'>
      <div className='flex  justify-between items-center px-3 pt-3 md:my-4 lg:mt-10  '>
        <h5 className='font-bold  text-xl uppercase '>top sản phẩm bán chạy</h5>
        <Link href={'/search/san-pham/san-pham-ban-chay-nhat'}>
          <div className=' flex flex-row items-center '>
            <p className='text-base font-semibold text-zinc-500'>Xem tất cả </p>
            <ChevronRight
              size={16}
              strokeWidth={1}
            />
          </div>
        </Link>
      </div>
      <hr />
      <div
        aria-label='product-list'
        className='flex flex-row overflow-auto max-h-[800px] gap-2 pl-2 pt-2 pb-1'>
        {/* <div className='grid grid-cols-5 gap-3'> */}
        {products.map((item) => (
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
  )
}

export {
  DiscountList,
  Newest,
  HotProduct,
  SellingProducts,
  AllProducts,
  ProductListSuspense,
}
