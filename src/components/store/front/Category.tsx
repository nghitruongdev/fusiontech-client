/** @format */

import React, { useEffect, useState } from 'react'
import { loginImg } from 'public/assets/images'
import Image from 'next/image'
import SectionTitle from '@components/ui/SectionTitle'
import { useList } from '@refinedev/core'

import { ICategory, IProduct } from 'types'
import { getCategoriesList } from '@/providers/server-data-provider/data/categories'

const Category = async () => {
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
          {Object.values(categories.data).map((item: ICategory) => (
            <div
              className='w-full h-36 overflow-y-hidden  bg-white rounded-lg p-4 flex flex-col justify-center items-center ease-in-out duration-300 scale-97 hover:scale-95  '
              key={item.id}>
              {item.image ? (
                <Image
                  src={item.image ?? ''}
                  width={200}
                  height={100}
                  alt={'/'}
                  className='w-full p-3  aspect-square rounded-md max-w-[200px] mx-auto object-cover'
                />
              ) : (
                <Image
                  alt='/'
                  width={200}
                  height={10}
                  className='w-full  aspect-square rounded-md max-w-[200px] mx-auto object-cover'
                  src='https://firebasestorage.googleapis.com/v0/b/fusiontech-vnco4.appspot.com/o/images%2Fvariants%2FlogostuImage.png?alt=media&token=90709f04-0996-4779-ab80-f82e99c62041'
                />
              )}
              <div
                style={{
                  fontFamily: 'Roboto, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '20px',
                  color: '#333333',
                }}>
                {item.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Category
// "use client";
// import React, { useRef } from "react";
// import Image from "next/image";
// import Slider from "react-slick";

// import SectionTitle from "@components/ui/SectionTitle";
// import { useList } from "@refinedev/core";
// import { getCategoriesList } from "@/providers/server-data-provider/data/categories";
// import { ICategory } from "types";
// import { loginImg } from "public/assets/images";
// import SliderButton from "@components/ui/SliderButton";

// const Category = () => {
//     const { data, status } = useList<ICategory>({
//         resource: "categories",
//     });
//     console.log("daa", data);

//     const CategoryItem: React.FC<{ category: ICategory }> = ({ category }) => {
//         return (
//             <div className="relative flex items-center p-3 lg:p-2 shadow-md ">
//                 {/* <Image
//                     src={loginImg}
//                     width={300}
//                     height={175}
//                     alt={category.name}
//                 /> */}
//                 <div className="p-4">{category.name}</div>
//             </div>
//         );
//     };

//     return (
//         <>
//             <SectionTitle
//                 title={"CategoryOfGoods"}
//                 className="flex flex-col items-center"
//             />
//             <div className="relative p-1 my-4 md:my-8 text-center">
//                 {status === "loading" ? (
//                     <div>Loading...</div>
//                 ) : status === "error" ? (
//                     <div>Error occurred while fetching data</div>
//                 ) : data && data.data && Array.isArray(data.data) ? (
//                     <>
//                         <span>hien thi thanh cong</span>

//                         {data.data.map((category: ICategory) => (
//                             <CategoryItem
//                                 key={category.id}
//                                 category={category}
//                             />
//                         ))}
//                     </>
//                 ) : (
//                     <div>No data available</div>
//                 )}
//             </div>
//         </>
//     );
// };

// export default Category;
