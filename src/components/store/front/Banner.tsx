/** @format */

import Image from 'next/image'
import CaptionCarousel from '@components/ui/Carousel'

const Banner = () => {
  const images = [
    'https://firebasestorage.googleapis.com/v0/b/fusiontech-vnco4.appspot.com/o/images%2Fbanner%2Frightbannerts9.webp?alt=media&token=508ec6c9-669f-4190-a6e0-54edbe899cc9',
    'https://firebasestorage.googleapis.com/v0/b/fusiontech-vnco4.appspot.com/o/images%2Fbanner%2Fasus%20tuf.webp?alt=media&token=31d567e2-087e-432d-813d-9b05e852aa28',
    'https://firebasestorage.googleapis.com/v0/b/fusiontech-vnco4.appspot.com/o/images%2Fbanner%2Fipadth7-new.webp?alt=media&token=e09998be-b749-46eb-9221-7f959ae7960f',
  ]
  return (
    <div className='font-titleFont flex gap-6 w-[95%] mx-auto'>
      <div className='w-1/5'></div>
      <div className='w-3/5 rounded-lg shadow-md relative'>
        <CaptionCarousel />
      </div>

      <div className='w-1/5 flex flex-col justify-between'>
        {images.map((image, idx) => (
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
  )
}

export default Banner
