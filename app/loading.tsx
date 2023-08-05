/** @format */

import React from 'react'
import LoadingCart from './(store)/cart/loading'
import Image from 'next/image'
import { loginImg } from '@public/assets/images'
import { cn } from 'components/lib/utils'
const Loading = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <AppLoadingSpinner />
    </div>
  )
}

type Props = {
  hideText?: boolean
  imgClassname?: string
}

const LoadingText = () => {
  const circleCommonClasses = 'h-3 w-3 rounded'
  return (
    <div className='flex space-x-2 justify-between items-center'>
      <span className='text-2xl animate-bounce'>Đang </span>
      <span className='text-2xl animate-bounce200'>tải</span>

      <div className={`${circleCommonClasses} bg-black  animate-bounce`}></div>
      <div
        className={`${circleCommonClasses} bg-black mr-2 animate-bounce200`}></div>
      <div className={`${circleCommonClasses} bg-black animate-bounce`}></div>
    </div>
  )
}
export const AppLoadingSpinner = ({ hideText, imgClassname }: Props) => {
  return (
    <div className='animate-pulse select-none'>
      <div className='relative my-6'>
        <div className='w-full h-full flex items-center justify-center'>
          <Image
            src={loginImg}
            alt='Login icon'
            className={cn('w-40 h-40 scale-95', imgClassname)}
          />
        </div>

        <svg
          className='w-40 h-40 mr-2 text-gray-200  dark:text-gray-600 fill-blue-500 absolute inset-0 flex items-center justify-center'
          viewBox='0 0 24 24'
          xmlns='http://www.w3.org/2000/svg'>
          <path d='M2,12A11.2,11.2,0,0,1,13,1.05C12.67,1,12.34,1,12,1a11,11,0,0,0,0,22c.34,0,.67,0,1-.05C6,23,2,17.74,2,12Z'>
            <animateTransform
              attributeName='transform'
              type='rotate'
              dur='0.8s'
              values='0 12 12;360 12 12'
              repeatCount='indefinite'
            />
          </path>
        </svg>
      </div>
      {!true && <LoadingText />}
    </div>
  )
}
export default Loading
