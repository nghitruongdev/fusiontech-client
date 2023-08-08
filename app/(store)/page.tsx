/** @format */

import Banner from '@components/store/front/Banner'
import ProductList from '@components/store/front/ProductList'
import { Skeleton } from '@components/ui/Skeleton'
import { Metadata } from 'next'
import { Suspense } from 'react'
import Banner1 from '@components/store/front/BannerSale'
import Category from '@components/store/front/Category'
import BannerSale from '@components/store/front/BannerSale'
import Benefits from '@components/store/front/Benefits'
import Newest from '@components/store/front/Newest'
import Brands from '@components/store/front/Brands'
import CardSaleBody from '@components/store/front/CardSaleBody'
import FusionNews from '@components/store/front/FusionNews'
import RecentProductView from '@components/store/front/section/RecentProductView'

const metadata: Metadata = {
  title: 'FushionTech - Official Store',
  description: 'Generated by Create Next App',
  icons: '/favicon.ico',
}
const array = Array.from({ length: 20 })
const ProductLoading = () => {
  return (
    <div className='flex'>
      {array.map((_, idx) => (
        <div
          key={idx}
          className='min-w-[20%] grid gap-2 p-4'>
          <Skeleton className='h-32' />
          <Skeleton className='h-6' />
          <Skeleton className='h-6' />
          <Skeleton className='h-6' />
        </div>
      ))}
    </div>
  )
}
const HomePage = async () => {
  return (
    <>
      <main>
        <div className='max-w-contentContainer mx-auto '>
          <Suspense>
            <div className=''>
              <Banner />
            </div>
          </Suspense>
          <Suspense fallback={<ProductLoading />}>
            <div className='mx-20'>
              <ProductList />
              <Category />
              <CardSaleBody />
              <Newest />
              <BannerSale />
              {/* <Benefits /> */}
              <Brands />
              <RecentProductView />
              <FusionNews />
            </div>
          </Suspense>
        </div>
      </main>
    </>
  )
}
export default HomePage
