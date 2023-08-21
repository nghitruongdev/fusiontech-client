/** @format */

import Image from 'next/image'
import CaptionCarousel from '@components/ui/Carousel'
import { cn } from 'components/lib/utils'

const Banner = ({ className }: { className?: string }) => {
  const smallAds = [
    'https://images.macrumors.com/t/Qy54Z3G-mzwW6DuUR38uVaLORxI=/1600x/article-new/2023/03/Hello-Yellow-iPhone-Ad.jpeg',
    'https://firebasestorage.googleapis.com/v0/b/fusiontech-vnco4.appspot.com/o/images%2Fbanner%2Frightbannerts9.webp?alt=media&token=508ec6c9-669f-4190-a6e0-54edbe899cc9',
    'https://firebasestorage.googleapis.com/v0/b/fusiontech-vnco4.appspot.com/o/images%2Fbanner%2Fasus%20tuf.webp?alt=media&token=31d567e2-087e-432d-813d-9b05e852aa28',
    'https://firebasestorage.googleapis.com/v0/b/fusiontech-vnco4.appspot.com/o/images%2Fbanner%2Fipadth7-new.webp?alt=media&token=e09998be-b749-46eb-9221-7f959ae7960f',
  ]
  //   const bigImage =
  // 'https://iphoneros.com/wp-content/uploads/2020/10/The-most-powerful-iPhone-ever.jpeg'
  // 'https://i.pinimg.com/736x/15/f4/89/15f489110026456126dcd3dccd40fd15.jpg'
  // 'https://i.pinimg.com/originals/d5/8d/57/d58d57875a833bb83e028179391beefc.png',
  // 'https://i.pinimg.com/1200x/73/67/98/7367981383d96afff6f19d101599eb52.jpg'
  // https://i.pinimg.com/1200x/73/67/98/7367981383d96afff6f19d101599eb52.jpg
  https: return (
    <div className={cn(`font-titleFont flex gap-6 w-[95%] mx-auto`, className)}>
      {/* <div className='w-1/5'></div> */}
      <div className='w-4/5 rounded-lg shadow-md relative'>
        <CaptionCarousel />
      </div>

      <div className='w-1/5'>
        {/* <div className=''>
          <Image
            alt={`Banner big`}
            src={bigImage}
            width={200}
            height={200}
            className='rounded-md w-full'
          />
        </div>
        <div className=''>
          <Image
            alt={`Banner big`}
            src={bigImage}
            width={200}
            height={200}
            className='rounded-md w-full'
          />
        </div> */}
        <div className='grid gap-4'>
          {smallAds.map((image, idx) => (
            <Image
              key={idx}
              alt={`Banner ${idx}`}
              src={image}
              width={200}
              height={200}
              className='rounded-md w-full'
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Banner
