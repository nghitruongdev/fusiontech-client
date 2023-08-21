/** @format */

import { useUrl } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

type ReturnProps = {
  current: number
  setCurrent: (current: number) => void
  pageSize: number
  setPageSize: (pageSize: number) => void
}
export function usePageable() {
  const [current, setCurrent] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(5)

  return {
    current,
    setCurrent,
    pageSize,
    setPageSize,
  }
}
