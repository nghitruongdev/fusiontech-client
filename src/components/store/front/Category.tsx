// import React, { useEffect, useState } from 'react'
// import { loginImg } from 'public/assets/images'
// import Image from 'next/image'
// import SectionTitle from '@components/ui/SectionTitle'
// import { useList } from '@refinedev/core'

// import { ICategory, IProduct } from 'types'
// import { getCategoriesList } from '@/providers/server-data-provider/data/categories'

// const Category = async () => {
//   const categories = await getCategoriesList()

//   return (
//     <>
//       <SectionTitle title={'Danh mục sản phẩm'} />
//       <div className="flex flex-col items-center">
//         {/* 💻lg break point */}
//         <div className="grid grid-cols-10 gap-4  ">
//           {Object.values(categories.data).map((item: ICategory) => (
//             <div
//               className="rounded-lg shadow-md bg-white p-1 flex flex-col justify-center items-center"
//               key={item.id}
//             >
//               <Image
//                 src={item.image?.url ?? ''}
//                 width={300}
//                 height={175}
//                 alt={'/'}
//               />
//               <div className="text-xs">{item.name}</div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   )
// }

// export default Category
'use client'
import React, { useRef } from 'react'
import Image from 'next/image'
import Slider from 'react-slick'

import SectionTitle from '@components/ui/SectionTitle'
import { useList } from '@refinedev/core'
import { getCategoriesList } from '@/providers/server-data-provider/data/categories'
import { ICategory } from 'types'
import { loginImg } from 'public/assets/images'
import SliderButton from '@components/ui/SliderButton'

const Category = () => {
  const { data, status } = useList<ICategory>({
    resource: 'categories',
  })
  console.log('daa', data)

  const CategoryItem: React.FC<{ category: ICategory }> = ({ category }) => {
    return (
      <div className="relative flex items-center p-3 lg:p-2 shadow-md ">
        <Image
          src={category.image?.url ?? ''}
          width={300}
          height={175}
          alt={'/'}
        />
        <div className="p-4">{category.name}</div>
      </div>
    )
  }

  return (
    <>
      <SectionTitle
        title={'CategoryOfGoods'}
        className="flex flex-col items-center"
      />
      <div className="relative p-1 my-4 md:my-8 text-center">
        {status === 'loading' ? (
          <div>Loading...</div>
        ) : status === 'error' ? (
          <div>Error occurred while fetching data</div>
        ) : data && data.data && Array.isArray(data.data) ? (
          <>
            <span>hien thi thanh cong</span>

            {data.data.map((category: ICategory) => (
              <CategoryItem key={category.id} category={category} />
            ))}
          </>
        ) : (
          <div>No data available</div>
        )}
      </div>
    </>
  )
}

export default Category
