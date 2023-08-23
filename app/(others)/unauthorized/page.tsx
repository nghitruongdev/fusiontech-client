/** @format */
import React from 'react'
import Image from 'next/image'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import StoreLayout from 'app/(store)/layout'
const page = () => {
  return (
    <StoreLayout>
      <div className='h-[600px] flex items-center justify-center'>
        <div className='flex items-center justify-center'>
          <div className='mr-8'>
            <div className=''>
              <h1 className='font-extrabold text-5xl text-red-700'>
                FusionTech
              </h1>
            </div>
            <p className='text-2xl font-normal '>
              <span className=''>Bạn không đủ quyền để vào trang này.</span>
              <br />
            </p>
            <Link href='/'>
              <div className='flex items-center mt-8 text-base  text-gray-900 hover:text-blue-700'>
                <ChevronLeft className='mr-1' />
                Trở lại trang chủ
              </div>
            </Link>
          </div>
          <Image
            src='https://firebasestorage.googleapis.com/v0/b/fusiontech-vnco4.appspot.com/o/images%2F403-unauthorized.png?alt=media&token=c2e223c4-d3b9-4c91-957e-a7aca0a87be9'
            alt='Error 403'
            className='w-96 h-96'
            width='500'
            height='500'
          />
        </div>
      </div>
    </StoreLayout>
  )
}
export default page
