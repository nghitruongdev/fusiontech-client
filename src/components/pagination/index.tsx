/** @format */

import {
  Box,
  HStack,
  IconButton,
  Button,
  Select,
  BoxProps,
} from '@chakra-ui/react'
import { usePagination } from '@refinedev/chakra-ui'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons'

export type PaginationProps = {
  current: number
  pageCount: number
  setCurrent: (page: number) => void
  pageSize: number | undefined
  setPageSize: ((size: number) => void) | undefined
}

export const Pagination: React.FC<PaginationProps & BoxProps> = ({
  current,
  pageCount,
  setCurrent,
  pageSize = 10,
  setPageSize,
  ...props
}) => {
  const pagination = usePagination({
    current,
    pageCount,
  })

  return (
    <Box
      display='flex'
      justifyContent='flex-end'
      {...props}>
      <HStack
        my='3'
        spacing='1'>
        {pagination?.prev && (
          <IconButton
            aria-label='previous page'
            onClick={() => setCurrent(current - 1)}
            disabled={!pagination?.prev}
            variant='outline'>
            <IconChevronLeft size='18' />
          </IconButton>
        )}

        {pagination?.items.map((page) => {
          if (typeof page === 'string') return <span key={page}>...</span>

          return (
            <Button
              key={page}
              onClick={() => setCurrent(page)}
              variant={page === current ? 'solid' : 'outline'}>
              {page}
            </Button>
          )
        })}
        {!!pageCount && !!pagination?.next && (
          <IconButton
            aria-label='next page'
            onClick={() => setCurrent(current + 1)}
            variant='outline'>
            <IconChevronRight size='18' />
          </IconButton>
        )}
        {!!setPageSize && (
          <Select
            value={pageSize}
            maxW={'150px'}
            onChange={(event) => {
              setPageSize(+event.target.value)
            }}>
            {[10, 20, 30, 50, 100].map((item) => (
              <option
                key={item}
                value={item}>
                {item} /trang
              </option>
            ))}
          </Select>
        )}
      </HStack>
    </Box>
  )
}
