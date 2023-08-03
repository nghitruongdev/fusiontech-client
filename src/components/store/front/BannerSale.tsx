/** @format */

'use client'
import React, { useEffect, useState } from 'react'
import SectionTitle from '@components/ui/SectionTitle'

import Image from 'next/image'

import { Button } from '@components/ui/shadcn/button'

const BannerSale = () => {
  const [countdown, setCountdown] = useState(7 * 60 * 60) // 7 hours in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')} : ${minutes
      .toString()
      .padStart(2, '0')} : ${secs.toString().padStart(2, '0')}`
  }
  const backgroundImageURL1 =
    'https://zishop.vercel.app/_next/image?url=%2Fimages%2Fbanners-img%2Fhome1.webp&w=1080&q=75'
  const backgroundImageURL2 =
    'https://zishop.vercel.app/_next/image?url=%2Fimages%2Fbanners-img%2Fhome2.webp&w=1080&q=75'
  return (
    <div className='flex items-center flex-col w-full xl:max-w-[2100px] mb-4 md-8 mx-auto'>
      <SectionTitle title={'Giảm giá đặc biệt'} />
      <div className='grid gap-4 grid-cols-6 lg:grid-cols-12'>
        <div className='col-span-6 lg:col-span-6 flex justify-center shadow-2xl relative rounded-lg overflow-hidden dark:bg-gray-500/70 !dark:bg-blend-multiply'>
          <div
            className='w-full bg-[#ffc42133] text-black rounded-lg p-4 hover:scale-105 transition-transform duration-300 ease-in-out'
            style={{
              backgroundImage: `url(${backgroundImageURL1})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}>
            <div className='p-5 grid grid-cols-2 gap-4'>
              <div className='col-span-1'>
                <div className='flex flex-col justify-center h-full'>
                  <h2 className='text-xl font-bold text-left mb-2 text-white'>
                    Special Sale
                  </h2>
                  <p className='text-base text-left mb-4'>
                    Here are the biggest enterprise technology acquisitions of
                    2021 so far, in reverse chronological order.
                  </p>
                  <div className='flex justify-start'>
                    <Button className=' bg-yellow hover:bg-[#f6b911] text-white text-lg  '>
                      Mua ngay
                    </Button>
                  </div>
                  <div className='text-base mt-3 font-bold text-red-600 text-left mb-4'>
                    Sale ends in: {formatTime(countdown)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='col-span-6 lg:col-span-6 flex justify-center shadow-2xl relative rounded-lg overflow-hidden dark:bg-gray-500/70 !dark:bg-blend-multiply'>
          <div
            className='w-full bg-[#ffc42133] text-black rounded-lg p-4 hover:scale-105 transition-transform duration-300 ease-in-out'
            style={{
              backgroundImage: `url(${backgroundImageURL2})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}>
            <div className='p-5 grid grid-cols-2 gap-4'>
              <div className='col-span-1'>
                <div className='flex flex-col justify-center h-full'>
                  <h2 className='text-xl font-bold text-left mb-2 text-white'>
                    Special Sale
                  </h2>
                  <p className='text-base text-left mb-4'>
                    Here are the biggest enterprise technology acquisitions of
                    2021 so far, in reverse chronological order.
                  </p>
                  <div className='flex justify-start'>
                    <Button className=' bg-yellow hover:bg-[#f6b911] text-white text-lg  '>
                      Mua ngay
                    </Button>
                  </div>
                  <div className='text-base mt-3 font-bold text-red-600 text-left mb-4'>
                    Sale ends in: {formatTime(countdown)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BannerSale
