/** @format */
'use client'
import { useUrl } from '@/lib/utils'
import { BoxProps } from '@chakra-ui/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { Pagination, PaginationProps } from '.'

const PaginationWithPageable = (props: PaginationProps & BoxProps) => {
  const router = useRouter()
  const { updateParams } = useUrl()
  const { current, pageCount, pageSize, setCurrent, setPageSize } = props

  useEffect(() => {
    console.log('current and size changed in pagination pagable')
    const url = updateParams({ current, size: pageSize })
    router.push(url, { scroll: false })
  }, [current, pageSize, updateParams, router])

  return (
    <Pagination
      {...props}
      pageCount={pageCount}
      justifyContent={'center'}
      setPageSize={undefined}
    />
  )
}

export default PaginationWithPageable
