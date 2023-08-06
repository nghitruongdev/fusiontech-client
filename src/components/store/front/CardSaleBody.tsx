/** @format */

import { benefitContent } from '@/mock/benefits'
import Image from 'next/image'

const CardSaleBody = () => {
  const imageClass =
    'w-[1000px] h-[180px] rounded-lg transition-transform duration-300 ease-in-out transform hover:translate-y-[-10px] hover:shadow-lg'
  return (
    <div className='flex flex-row mt-6'>
      <div className='grid grid-cols-3 gap-4'>
        <div className='col-span-1'>
          <Image
            src={
              'https://firebasestorage.googleapis.com/v0/b/fusiontech-vnco4.appspot.com/o/images%2Fbanner%2FCauhinhcuckhung-800x447.jpg?alt=media&token=0e93b789-4dd7-48ba-a27c-0fb069c8f11d'
            }
            alt='/'
            width={1500}
            height={100}
            className={`${imageClass} shadow`}

            // className='w-full h-[180px] rounded-lg'
          />
        </div>
        <div className='col-span-1'>
          <Image
            src={
              'https://firebasestorage.googleapis.com/v0/b/fusiontech-vnco4.appspot.com/o/images%2Fbanner%2Fbanner-laptop-gaming-he-1683277063.png?alt=media&token=c1b6a76f-0f36-43ca-b537-0701fdee1fd3'
            }
            alt='/'
            width={1500}
            height={100}
            className={`${imageClass} shadow`}

            // className=' h-[180px] rounded-lg  transition-transform duration-300 ease-in-out transform hover:translate-y-[-10px]'
          />
        </div>
        <div className='col-span-1'>
          <Image
            src={
              'https://firebasestorage.googleapis.com/v0/b/fusiontech-vnco4.appspot.com/o/images%2Fbanner%2Fmsi-800x447.jpg?alt=media&token=fc27c95a-02b2-4ebe-afc0-70fbbc1497d9'
            }
            alt='/'
            width={1500}
            height={100}
            className={`${imageClass} shadow`}

            // className='w-full h-[180px] rounded-lg'
          />
        </div>
      </div>
    </div>
  )
}

export default CardSaleBody
