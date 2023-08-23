/** @format */

import React from 'react'
import Image from 'next/image'
import { errorImg } from '@public/assets/images'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import StoreLayout from './(store)/layout'
import { Button } from '@components/ui/shadcn/button'
const NotFound = () => {
  return (
    <StoreLayout>
      <div className='h-[600px] flex items-center justify-center'>
        <div className='flex items-center justify-center'>
          <div className='mr-8'>
            <div className=''>
              <h1 className='font-extrabold text-5xl text-yellow'>
                FusionTech
              </h1>
            </div>
            <p className='text-2xl font-normal '>
              <span className=''>
                Yêu cầu URL không được tìm thấy trong hệ thống.
              </span>
              <br />
            </p>
            <Button
              variant={'link'}
              className=''>
              <Link
                href='/'
                className='flex'>
                <ChevronLeft className='mr-1' />
                Trở lại trang chủ
                {/* <div className='flex items-center mt-8 text-base  text-gray-900 hover:text-blue-700'></div> */}
              </Link>
            </Button>
          </div>
          <Image
            src={errorImg}
            alt='Error 404'
            className='w-96 h-96'
          />
        </div>
      </div>
    </StoreLayout>
  )
}
export default NotFound
