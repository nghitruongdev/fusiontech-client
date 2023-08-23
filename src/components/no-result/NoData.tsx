/** @format */

import { Boxes } from 'lucide-react'
import { PropsWithChildren } from 'react'

export function NoData({ children }: PropsWithChildren) {
  return (
    <div className='flex flex-col items-center justify-center gap-4 w-full h-[450px] bg-white'>
      <Boxes
        className='w-[300px] h-[300px] text-zinc-600 '
        strokeWidth={0.5}
      />
      <p className='text-3xl text-zinc-600 font-semibold'>
        {children ? children : 'Không có dữ liệu :('}
      </p>
    </div>
  )
}
