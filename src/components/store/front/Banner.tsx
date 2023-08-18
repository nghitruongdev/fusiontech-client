/** @format */

// const Banner = () => {
//   return (

//   )
// }
// export default Banner
/** @format */
'use client'
import SectionTitle from '@components/ui/SectionTitle'
import { getProductsWithDetails } from '@/providers/server-data-provider/data/products'
import { IProduct } from 'types'
import Image from 'next/image'
import Link from 'next/link'
import NextLinkContainer from '@components/ui/NextLinkContainer'
import { formatPrice } from '@/lib/utils'
import { BsStarFill } from 'react-icons/bs'
import { ChevronRight, Plus } from 'lucide-react'
import { Button } from '@components/ui/shadcn/button'
import { FavoriteButtonWithCardProvider } from './product/FavoriteButton'
import { ProductCardProvider } from './product/ProductCardProvider'
import { API } from 'types/constants'
import { useCustom } from '@refinedev/core'
import { bannerImg, newProduct } from 'public/assets/images'
import CaptionCarousel from '@components/ui/Carousel'
import SliderButton from '@components/ui/SliderButton'
import Slider from 'react-slick'
import { useRef } from 'react'
// import { Flex } from "@chakra-ui/react";
// import { useWindowDimensions } from "@/hooks/useWindowDimensions";

const Banner = () => {
  return (
    <div className='w-full  px-4 py-4 font-titleFont flex gap-4 '>
      <div className='w-[80%] rounded-lg h-[410px] shadow-md relative'>
        <CaptionCarousel />
      </div>

      <div className='w-[20%] h-[410px]  flex flex-col justify-between'>
        <Image
          alt='/'
          src='https://firebasestorage.googleapis.com/v0/b/fusiontech-vnco4.appspot.com/o/images%2Fbanner%2Frightbannerts9.webp?alt=media&token=508ec6c9-669f-4190-a6e0-54edbe899cc9'
          width={500}
          height={500}
          className='w-full h-[140px] rounded-md mb-3'
        />
        <Image
          alt='/'
          src='https://firebasestorage.googleapis.com/v0/b/fusiontech-vnco4.appspot.com/o/images%2Fbanner%2Fasus%20tuf.webp?alt=media&token=31d567e2-087e-432d-813d-9b05e852aa28'
          width={500}
          height={500}
          className='w-full h-[140px] rounded-md mb-3'
        />
        <Image
          alt='/'
          src='https://firebasestorage.googleapis.com/v0/b/fusiontech-vnco4.appspot.com/o/images%2Fbanner%2Fipadth7-new.webp?alt=media&token=e09998be-b749-46eb-9221-7f959ae7960f'
          width={500}
          height={500}
          className='w-full h-[140px] rounded-md'
        />
      </div>
    </div>
  )
}

export default Banner
