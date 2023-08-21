/** @format */

import React, { FC } from 'react'
import Image from 'next/image'
import { getCategoriesList } from '@/providers/server-data-provider/data/categories'
import { Images } from 'types/constants'
import NextLinkContainer from '@components/ui/NextLinkContainer'

async function Category() {
  const categories = await getCategoriesList()

  return (
    <div className='bg-white rounded-lg mt-6'>
      <h2 className='px-3 py-3 font-bold  text-xl uppercase '>
        Danh mục sản phẩm
      </h2>
      <hr />
      <div className='flex flex-col items-center'>
        {/* 💻lg break point */}
        <div className='grid grid-cols-10 border-gray-300 bg-slate-50   '>
          {Object.values(categories.data)
            .map((item) => ({
              ...item,
              image: item.image ?? Images.categories,
            }))
            .map((item) => (
              <NextLinkContainer
                key={item.id}
                href={`/search/danh-muc/${item.id}-${item.slug}`}
                className='w-full h-36 overflow-y-hidden  bg-white rounded-lg p-4 flex flex-col justify-center items-center ease-in-out duration-300 scale-97 hover:scale-95'>
                <Image
                  src={item.image}
                  width={50}
                  height={50}
                  alt={'/'}
                  className='w-full p-3  aspect-square rounded-md max-w-[200px] mx-auto object-cover'
                />
                <p className='"font-roboto font-normal text-base leading-5 text-gray-700"'>
                  {item.name}
                </p>
              </NextLinkContainer>
            ))}
        </div>
      </div>
    </div>
  )
}

export default Category
