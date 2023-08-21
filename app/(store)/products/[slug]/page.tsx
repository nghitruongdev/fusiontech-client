/**
 * @ts-expect-error Async Server Component
 * eslint-disable react/display-name
 *  @format
/*  */

import ReviewComponent from './(review)/Review'
import Description from './Description'
import { getOneProduct } from '@/providers/server-data-provider/data/products'
import dynamic from 'next/dynamic'
import {
  ProductCartButton,
  ProductFavoriteDetails,
  ProductFrequentBoughtTogether,
  ProductImages,
  ProductPrice,
  ProductQuantity,
  ProductRating,
  ProductSpecification,
} from './product-client'
import { getOneBrand } from '@/providers/server-data-provider/data/brands'
import { Suspense } from 'react'
import { ProductOptions } from './product-options'
import { Info } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { Skeleton } from '@components/ui/Skeleton'
import RecentProductView from '@components/store/front/section/RecentProductView'
import { API, API_URL } from 'types/constants'

type Props = {
  params: {
    slug: string
  }
}
const DynamicContextProvider = dynamic(() => import('./product-client'), {
  ssr: false,
})

const Product = async ({ params: { slug } }: Props) => {
  const id = slug.substring(0, slug.indexOf('-'))
  Product.Id = id
  const product = await getOneProduct(id)
  return (
    <DynamicContextProvider product={product}>
      <section className=''>
        <div className='w-[90%] mx-20 p-4'>
          <div className='grid grid-cols-3 gap-8'>
            <div className='col-span-2 relative'>
              <ProductImages />
              <ProductFrequentBoughtTogether />
            </div>
            <div className='col-span-1 flex flex-col gap-2 '>
              <div className='p-4 pt-0 rounded-lg flex flex-col gap-6 shadow-lg border'>
                <ProductFavoriteDetails />
                {/* @ts-expect-error Async Server Component */}
                <Product.Info />
              </div>
            </div>
          </div>
          <div className='grid grid-cols-3 gap-4 border-t shadow-lg rounded-md p-4 mt-4'>
            <div className='col-span-2'>
              <Description />
            </div>
            <div className='col-span-1'>
              <ProductSpecification />
            </div>
          </div>
          <div className=''>
            <ReviewComponent productId={id} />
          </div>
          <RecentProductView />
        </div>
      </section>
    </DynamicContextProvider>
  )
}
Product.Id = ''
Product.Info = async () => {
  const { name } = await getOneProduct(Product.Id)
  return (
    <>
      <div className='flex flex-col gap-1'>
        {/* @ts-expect-error Async Server Component */}
        <Product.Brand />
        <p className='text-2xl font-bold text-zinc-700'>{name}</p>
        <ProductRating />
        <ProductPrice />
        <Product.StoreInfo />
        <ProductQuantity />

        <Suspense
          fallback={
            <div className='grid gap-2'>
              {Array.from({ length: 5 }).map((_, idx) => (
                <Skeleton
                  key={idx}
                  className='h-10'
                />
              ))}
            </div>
          }>
          <ProductOptions />
          <ProductCartButton />
        </Suspense>
        {/* Add to cart  */}
        {/* @ts-expect-error Async Server Component */}
        <Product.KeyFeatures />
      </div>
    </>
  )
}

Product.Brand = async () => {
  const { brand } = await getOneProduct(Product.Id)
  let name = 'OEM'
  if (brand && brand.id) {
    const brandDb = await getOneBrand(brand?.id || '')
    name = brandDb?.name ?? name
  }
  return (
    <>
      <p className='text-sm underline underline-offset-4 '>{name}</p>
    </>
  )
}

Product.StoreInfo = function StoreInfo() {
  return (
    <p className='text-gray-500 text-sm font-medium flex gap-1 items-center '>
      Hàng chính hãng được bán bởi FusionTech
      <span>
        <Info className='w-5 h-5' />
      </span>
    </p>
  )
}

Product.KeyFeatures = async function KeyFeatures() {
  const { features } = await getOneProduct(Product.Id)
  if (!features) return <></>
  return (
    <div className=''>
      <p className='text-lg font-semibold leading-none'>Tính năng nổi bật</p>
      {features.map((feat) => (
        <p key={uuidv4()}>{feat}</p>
      ))}
    </div>
  )
}

export default Product
