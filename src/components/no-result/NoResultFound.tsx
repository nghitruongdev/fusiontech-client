/** @format */

import Image from 'next/image'

const NoResultFound = () => {
  return (
    <div className='flex flex-col items-center justify-center gap-4 w-full h-[450px] bg-white'>
      <Image
        alt='no-result-found'
        src='https://firebasestorage.googleapis.com/v0/b/fusiontech-vnco4.appspot.com/o/images%2Fno-result-found.png?alt=media&token=27af6304-ba76-445f-a2b0-59aa52815296'
        width={'300'}
        height={'300'}
      />
      <p className='text-3xl text-zinc-600 font-semibold'>
        {'Không có kết quả :('}
      </p>
    </div>
  )
}
export { NoResultFound }
