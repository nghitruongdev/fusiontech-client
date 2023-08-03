/** @format */

// "use client";
// import React, { useRef } from "react";
// import { loginImg } from "public/assets/images";
// import Image from "next/image";

// import SectionTitle from "@components/ui/SectionTitle";

// import { Button } from "@components/ui/shadcn/button";
// import { IconButton, Link, useBreakpointValue } from "@chakra-ui/react";
// import { getCategoriesList } from "@/providers/server-data-provider/data/categories";
// import { ICategory } from "types";
// import Slider from "react-slick";
// import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";
// import SliderButton from "@components/ui/SliderButton";
// import { brandContent } from "@/mock/brand";

// const Brands = () => {
//     const settings = {
//         infinite: true,
//         speed: 500,
//         slidesToShow: 6,
//         slidesToScroll: 1,
//         autoplay: true,
//         autoplaySpeed: 3000,
//         cssEase: "linear",
//         swipeToSlide: true,
//         arrows: false,
//         responsive: [
//             {
//                 breakpoint: 1024,
//                 settings: {
//                     slidesToShow: 6,
//                     slidesToScroll: 3,
//                 },
//             },
//             {
//                 breakpoint: 768,
//                 settings: {
//                     slidesToShow: 4,
//                     slidesToScroll: 4,
//                 },
//             },
//             {
//                 breakpoint: 640,
//                 settings: {
//                     slidesToShow: 3,
//                     slidesToScroll: 3,
//                 },
//             },
//         ],
//     };

//     interface Props {
//         brandName: string;
//         imageSrc: any;
//     }
//     const BrandBox: React.FC<Props> = ({ brandName, imageSrc }) => {
//         return (
//             <div className="relative flex items-center p-3 lg:p-2 shadow-md lg:shadow-xl">
//                 <Image
//                     src={imageSrc}
//                     width={300}
//                     height={175}
//                     alt={brandName}
//                 />
//                 <div className="absolute dark:inset-0 dark:bg-slate-800/40"></div>
//             </div>
//         );
//     };
//     const sliderRef = useRef<Slider | null>(null);

//     return (
//         <div className="relative p-1 my-4 md:my-8 text-center">
//             <SectionTitle title={"popularBrands"} />
//             <SliderButton sliderRef={sliderRef} />
//             <Slider
//                 {...settings}
//                 ref={(slider) => (sliderRef.current = slider)}
//             >
//                 {brandContent.map((brandItem) => {
//                     return (
//                         <BrandBox
//                             key={brandItem.id}
//                             brandName={brandItem.name}
//                             imageSrc={loginImg}
//                         />
//                     );
//                 })}
//             </Slider>
//         </div>
//     );
// };

// export default Brands;
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

  const BrandItem: React.FC<{ brand: IBrand }> = ({ brand }) => {
    return (
      <div className='relative flex items-center m-2 p-2 md:p-4 shadow justify-center rounded-lg'>
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
