/** @format */

'use client'
import { AppLoadingSpinner } from 'app/loading'
import { cn } from 'components/lib/utils'

const LoadingOverlay = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        `absolute top-0 left-0 w-full h-screen flex pt-[200px] justify-center bg-slate-100 bg-opacity-20 z-50 cursor-wait pointer-events-none`,
        className,
      )}>
      <AppLoadingSpinner />
    </div>
  )
}
export default LoadingOverlay
