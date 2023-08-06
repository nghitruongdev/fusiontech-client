/** @format */

'use client'
import React, { useRef } from 'react'
import Image from 'next/image'
import Slider from 'react-slick'

import SectionTitle from '@components/ui/SectionTitle'
import { useList } from '@refinedev/core'
import { IBrand } from 'types'
import SliderButton from '@components/ui/SliderButton'
import { loginImg } from 'public/assets/images'
import { getAllBrands } from '@/providers/server-data-provider/data/brands'

const Brands = () => {
  const { data, status } = useList<IBrand>({
    resource: 'brands',
  })
  console.log('brands', data)

  const settings = {
    infinite: true,
    speed: 1000,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1000,
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

  const BrandItem: React.FC<{ brand: IBrand }> = ({ brand }) => {
    return (
      <div className='relative flex items-center m-2 p-2 md:p-4 shadow justify-center rounded-lg bg-white'>
        {brand.image ?? '' ? (
          <Image
            src={brand.image ?? ''}
            width={90}
            height={90}
            alt={brand.name}
          />
        ) : (
          <Image
            alt='/'
            width={90}
            height={90}
            src='https://firebasestorage.googleapis.com/v0/b/fusiontech-vnco4.appspot.com/o/images%2Fvariants%2FlogostuImage.png?alt=media&token=90709f04-0996-4779-ab80-f82e99c62041'
          />
        )}
      </div>
    )
  }

  const sliderRef = useRef<Slider | null>(null)

  return (
    <>
      {/* <SectionTitle
                title={"Thương hiệu"}
                className="flex flex-col items-center"
            /> */}
      <div className='relative p-1 my-8 md:my-8 text-center'>
        {status === 'loading' ? (
          <div>Loading...</div>
        ) : status === 'error' ? (
          <div>Error occurred while fetching data</div>
        ) : data && data.data && Array.isArray(data.data) ? (
          <>
            <SliderButton sliderRef={sliderRef} />
            <Slider
              {...settings}
              ref={(slider) => (sliderRef.current = slider)}>
              {data.data.map((brand: IBrand) => (
                <BrandItem
                  key={brand.id}
                  brand={brand}
                />
              ))}
            </Slider>
          </>
        ) : (
          <div>No data available</div>
        )}
      </div>
    </>
  )
}

export default Brands
