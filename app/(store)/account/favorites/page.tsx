/** @format */

'use client'
import { FaHeart, FaStar } from 'react-icons/fa'
import React, { useEffect, useState } from 'react'
import favoriteApi from 'src/api/favoriteAPI'
import { GoPlus } from 'react-icons/go'
import { BsStarFill } from 'react-icons/bs'
import useMyToast from '@/hooks/useToast'
import useFavorite, { useFavoriteStore } from '@/hooks/useFavorite'
import Image from 'next/image'

const FavoriteProducts = () => {
  const { deleteFavoriteProduct } = useFavorite()
  const [favorites] = useFavoriteStore((state) => [state.favoriteProducts])

  return (
    <div className='mx-auto bg-white rounded'>
      <h1 className='text-xl font-semibold pt-2 pl-4'>
        Sản phẩm bạn yêu thích
      </h1>
      <div className='mx-auto'>
        <div className='py-6 px-4 grid grid-cols-4 gap-4'>
          {Object.values(favorites).map((product) => (
            <div
              key={product.id}
              className='border-[1px] border-gray-200 mb-6 group rounded-xl shadow-lg'>
              <div className='flex justify-end p-2'>
                <button
                  className='hover:opacity-50 transition-opacity hover:scale-125  duration-3000'
                  onClick={() =>
                    product.id && deleteFavoriteProduct(+product.id)
                  }>
                  <FaHeart className='text-red-500' />
                </button>
              </div>
              <div className='w-full h-[150px] overflow-hidden p-1'>
                <Image
                  src={product.images?.[0] ?? ''}
                  alt={product.name}
                  width={200}
                  height={200}
                />
              </div>
              {/* Description Start */}
              <div className='px-2 py-4 flex flex-col justify-center'>
                <div className='flex items-center gap-3'>
                  <p className='font-titleFont text-lg text-green-700 font-semibold'>
                    Now 999$
                  </p>
                  <p className='text-gray-500 text-base line-through decoration-[1px]'>
                    1500$
                  </p>
                </div>
                <p className='text-sm font-semibold my-2 text-black line-clamp-1'>
                  {product.name}
                </p>
                <p className='text-base text-zinc-500 line-clamp-2'>
                  {product.description && product.description.substring(0, 80)}
                </p>
                <div className='flex items-center gap-2 text-yellow mt-2'>
                  <div className='flex text-sm gap-1 items-center'>
                    <BsStarFill />
                    <BsStarFill />
                    <BsStarFill />
                    <BsStarFill />
                    <BsStarFill />
                    <p className=' text-black'>25</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FavoriteProducts
