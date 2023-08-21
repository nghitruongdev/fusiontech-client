/** @format */

'use client'
import React from 'react'
import { IProduct } from 'types'
import ProductCard from '@components/store/front/product/ProductCard'
import Image from 'next/image'

const SearchResult = ({ items }: { items: IProduct[] }) => {
  return (
    <>
      {!items.length && (
        <div className='flex flex-col items-center'>
          <Image
            src='https://firebasestorage.googleapis.com/v0/b/fusiontech-vnco4.appspot.com/o/images%2Fbanner%2FProduct%20Not%20Found.png?alt=media&token=c25d78c3-7594-40d5-966e-74beafdeb32c'
            alt='/'
            width={1500}
            height={1500}
            className='w-[100%] h-[450px] object-center p-10'
          />
          <p className='font-sans text-2xl font-bold text-zinc-500 mb-2'>
            Không tìm thấy sản phẩm
          </p>
        </div>
      )}
      {!!items?.length && (
        <div className='bg-white'>
          <div className='flex flex-row flex-wrap'>
            {items.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                className='w-1/6 gap-4'
              />
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default SearchResult
