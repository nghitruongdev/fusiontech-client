/** @format */
'use client'
import { News } from '@/mock/FusionNews'
import { ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import Slider from 'react-slick'

const FusionNews = () => {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
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
  const sliderRef = useRef<Slider | null>(null)
  return (
    <div className='bg-white rounded-lg my-6'>
      <h2 className='px-3 py-3 font-bold  text-xl uppercase '>Tin công nghệ</h2>
      <hr />
      <div className='grid grid-cols-4 gap-4 rounded-lg'>
        <div className='col-span-4'>
          <div className='relative p-2 my-2 md:my-4'>
            <Slider
              {...settings}
              ref={(slider) => (sliderRef.current = slider)}>
              {News.map((newsItem) => {
                return (
                  <div
                    className='col-span-1 lg:col-span-1 flex flex-col '
                    key={newsItem.title}>
                    <Link href='http://localhost:3000/news'>
                      <Image
                        width={1000}
                        height={1000}
                        src={newsItem.imgSrc}
                        alt={newsItem.title}
                        className='w-[290px] h-[180px] rounded-lg ease-in-out duration-300 scale-97 hover:scale-95   '
                      />

                      <p className='m-3 text-sm leading-normal text-zinc-500 line-clamp-2 uppercase font-bold '>
                        {`${newsItem.title}`}
                      </p>
                    </Link>
                  </div>
                )
              })}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FusionNews
