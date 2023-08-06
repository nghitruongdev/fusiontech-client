/** @format */

import { bannerImg, newProduct } from 'public/assets/images'
import Image from 'next/image'
import CaptionCarousel from '@components/ui/Carousel'

const Banner = () => {
  return (
    <div className='w-full  px-4 py-4 font-titleFont flex gap-4 '>
      <div className='w-2/3 rounded-lg h-[410px] shadow-md relative'>
        <CaptionCarousel />
      </div>
      <div className='w-1/3 border-[1px] bg-white border-gray-200 rounded-lg shadow-md p-4 flex flex-col justify-between'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-semibold text-black'>
            Flash Pick of the day
          </h2>
          <p className='text-base text-zinc-600 underline underline-offset-2'>
            View all
          </p>
        </div>
        <div className='flex justify-center items-center h-60'>
          <a href='#'>
            <Image
              className='h-full w-60 object-cover'
              src={newProduct}
              alt=''
            />
          </a>
        </div>
        <div className='px-2 pb-2'>
          <a href='#'>
            <h2 className='text-xl font-semibold tracking-tight text-gray-900 dark:text-white'>
              Acer Nitro 5
            </h2>
          </a>
          <div className=' flex justify-between mt-2.5 mb-5'>
            <div className='flex items-center'>
              <svg
                className='w-4 h-4 text-yellow-300 mr-1'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 22 20'>
                <path d='M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z' />
              </svg>
              <svg
                className='w-4 h-4 text-yellow-300 mr-1'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 22 20'>
                <path d='M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z' />
              </svg>
              <svg
                className='w-4 h-4 text-yellow-300 mr-1'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 22 20'>
                <path d='M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z' />
              </svg>
              <svg
                className='w-4 h-4 text-yellow-300 mr-1'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 22 20'>
                <path d='M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z' />
              </svg>
              <svg
                className='w-4 h-4 text-gray-200 dark:text-gray-600'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 22 20'>
                <path d='M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z' />
              </svg>
              <span className='bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-3'>
                5.0
              </span>
            </div>
            <a
              href='#'
              className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>
              19.990.000₫
            </a>
          </div>
          <div className='flex items-center '></div>
        </div>
      </div>
    </div>
  )
}
export default Banner
