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
  const { get } = useSearchParams()
  const router = useRouter()
  const { updateParam } = useUrl()
  const [current, setCurrent] = useState<number>(
    Number.parseInt(get(`current`) ?? '1'),
  )
  const [pageSize, setPageSize] = useState<number>(
    Number.parseInt(get('size') ?? '10'),
  )

  useEffect(() => {
    const url = updateParam({ current, size: pageSize })
    router.push(url, {
      shallow: true,
    })
  }, [current, pageSize, router])

  return {
    current,
    setCurrent,
    pageSize,
    setPageSize,
  }
}
