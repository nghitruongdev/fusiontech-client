/** @format */

'use client'
import { AppLoadingSpinner } from 'app/loading'

const LoadingOverlay = () => {
  return (
    <div className='absolute top-0 left-0 w-full h-full flex pt-[200px] justify-center bg-slate-100 bg-opacity-20 z-50 cursor-wait pointer-events-none'>
      <AppLoadingSpinner />
    </div>
  )
}
export default LoadingOverlay
