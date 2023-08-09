/** @format */

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

type Props = {
  params: {
    id: string
  }
}
const DynamicContextProvider = dynamic(() => import('./product-client'), {
  ssr: false,
})

const Product = async ({ params: { id } }: Props) => {
  Product.Id = id
  const product = await getOneProduct(id)
  return (
    <DynamicContextProvider product={product}>
      <section className='bg-white'>
        <div className='w-[90%] mx-auto p-4'>
          {/* mx-auto flex items-center py-4 */}
          <div className='flex'>
            <div className='w-2/3 relative'>
              <ProductImages />
              <ProductFrequentBoughtTogether />
            </div>
            <div className='w-1/3 flex flex-col gap-2 mt-4'>
              <div className='p-4 pt-0 rounded-lg flex flex-col gap-6 shadow-lg border'>
                <ProductFavoriteDetails />
                <Product.Info />
              </div>
            </div>
          </div>
          <div className='flex border-t shadow-lg rounded-md p-4 mt-4'>
            <div className='w-2/3'>
              <Description />
            </div>
            <div className='w-1/3'>
              <ProductSpecification />
            </div>
          </div>
          <div className=''>
            <ReviewComponent />
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
        <Product.Brand />
        <p className='text-2xl font-bold'>{name}</p>
        {/* <p className="text-base text-zinc-500">
                                {product.description}
                            </p> */}
        {/* <div className="flex items-center space-x-2 text-zinc-950 mt-2"> */}
        <ProductRating />
        {/* </div> */}
        {/* Product Price */}
        <ProductPrice />
        <Product.StoreInfo />

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
