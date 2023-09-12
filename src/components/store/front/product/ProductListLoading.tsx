/** @format */

import { Skeleton } from '@components/ui/Skeleton'
import { cn } from 'components/lib/utils'

const ProductListLoading = (props: JSX.IntrinsicElements['div']) => {
  return (
    <div
      {...props}
      className={cn(`grid grid-cols-5 gap-4`, props.className)}>
      {Array.from({ length: 5 }).map((item, idx) => (
        <div key={idx}>
          <Skeleton className='w-full h-[150px]' />
          <div className='grid gap-2 mt-2'>
            <Skeleton className='w-full h-6' />
            <Skeleton className='w-full h-6' />
            <Skeleton className='w-[95%] h-6' />
          </div>
        </div>
      ))}
    </div>
  )
}
export default ProductListLoading
