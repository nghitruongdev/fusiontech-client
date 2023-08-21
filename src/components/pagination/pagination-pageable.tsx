/** @format */
'use client'
import { updateUrlParams, useUrl } from '@/lib/utils'
import { BoxProps } from '@chakra-ui/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { Pagination, PaginationProps } from '.'

type Props = {
  totalPages: number
}
const PaginationWithPageable = (props: PaginationProps & BoxProps) => {
  const { get } = useSearchParams()
  const router = useRouter()
  const { updateParams } = useUrl()
  const { current, pageCount, pageSize, setCurrent, setPageSize } = props
  useEffect(() => {
    const num = Number.parseInt(get('current') ?? '1')
    setCurrent(!isNaN(num) ? num : 1)
  }, [setCurrent, get])

  useEffect(() => {
    const num = Number.parseInt(get('size') ?? '5')
    setPageSize?.(!isNaN(num) ? num : 5)
  }, [setPageSize, get])

  useEffect(() => {
    const url = updateParams({ current, size: pageSize })
    router.push(url, { scroll: false })
  }, [current, pageSize, updateParams, router])

  return (
    <Pagination
      {...props}
      justifyContent={'center'}
      setPageSize={props.setPageSize ?? undefined}
    />
  )
}

export default PaginationWithPageable
