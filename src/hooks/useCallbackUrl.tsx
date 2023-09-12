/** @format */

import { useCurrentUrl } from '@/lib/utils'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

const useCallbackUrl = () => {
  const currentUrl = useCurrentUrl()
  const searchParams = useSearchParams()

  return useMemo(() => {
    const previousCallback = searchParams.get('callbackUrl')
    const isAuthPage = currentUrl?.includes('/auth/')
    const callbackUrl =
      previousCallback ?? !isAuthPage
        ? encodeURIComponent(currentUrl ?? '')
        : null
    return {
      callbackUrl,
    }
  }, [currentUrl, searchParams])
}
export default useCallbackUrl
