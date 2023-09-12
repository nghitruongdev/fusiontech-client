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
const getOrDefault = (value: string | null, defaultVal: number) => {
  const num = Number.parseInt(value ?? defaultVal + '')
  return !isNaN(num) ? num : defaultVal
}
export function usePageable() {
  const { get } = useSearchParams()
  const [current, setCurrent] = useState<number>(
    getOrDefault(get(`current`), 1),
  )
  const [pageSize, setPageSize] = useState<number>(
    getOrDefault(get(`size`), 10),
  )

  return {
    current,
    setCurrent,
    pageSize,
    setPageSize,
  }
}
