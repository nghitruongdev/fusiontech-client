/** @format */

'use client'

import React from 'react'
import { IResourceComponentsProps } from '@refinedev/core'
import { useTable } from '@refinedev/react-table'
import { ColumnDef } from '@tanstack/react-table'
import { TableContainer, Table, HStack } from '@chakra-ui/react'
import { useDefaultTableRender } from '@/hooks/useRenderTable'
import { List } from '@components/crud'
import { DeleteButton, EditButton, ShowButton } from '@components/buttons'
import { FirebaseImage, IVoucher } from 'types'
import Image from 'next/image'
import { Images } from 'types/constants'

export default function ListPage() {
  return <VoucherList />
}

const VoucherList: React.FC<IResourceComponentsProps> = () => {
  const columns = React.useMemo<ColumnDef<IVoucher>[]>(
    () => [
      {
        id: 'id',
        accessorKey: 'id',
        header: 'Id',
      },
      {
        id: 'code',
        accessorKey: 'code',
        header: 'Code',
      },
      {
        id: 'discount',
        accessorKey: 'discount',
        header: 'Giảm giá',
      },
      {
        id: 'description',
        accessorKey: 'description',
        header: 'Mô tả',
      },
      // {
      //   id: 'minOrderAmount',
      //   accessorKey: 'minOrderAmount',
      //   header: 'minOrderAmountu',
      // },
      // {
      //   id: 'maxDiscountAmount',
      //   accessorKey: 'maxDiscountAmount',
      //   header: 'maxDiscountAmount',
      // },
      // {
      //   id: 'startDate',
      //   accessorKey: 'startDate',
      //   header: 'startDate',
      // },
      // {
      //   id: 'expirationDate',
      //   accessorKey: 'maxDiscountAmount',
      //   header: 'maxDiscountAmount',
      // },
      {
        id: 'limitUsage',
        accessorKey: 'limitUsage',
        header: 'Số lần sử dụng',
      },
      {
        id: 'userLimitUsage',
        accessorKey: 'userLimitUsage',
        header: 'Số lần sử dụng của người dùng',
      },
      {
        id: 'actions',
        accessorKey: 'id',
        header: 'Hành động',
        cell: function render({ getValue }) {
          return (
            <HStack>
              <ShowButton
                hideText
                recordItemId={getValue() as string}
              />
              <EditButton
                hideText
                recordItemId={getValue() as string}
              />
              <DeleteButton
                hideText
                recordItemId={getValue() as string}
              />
            </HStack>
          )
        },
      },
    ],
    [],
  )

  const {
    getHeaderGroups,
    getRowModel,
    setOptions,
    refineCore: {
      setCurrent,
      pageCount,
      current,
      pageSize,
      setPageSize,
      tableQueryResult: { data: tableData },
    },
  } = useTable({
    columns,
  })

  setOptions((prev) => ({
    ...prev,
    meta: {
      ...prev.meta,
    },
  }))
  const paginationData = {
    pageCount,
    pageSize,
    setPageSize,
    current,
    setCurrent,
  }
  const { headers, body, pagination } = useDefaultTableRender({
    rowModel: getRowModel(),
    headerGroups: getHeaderGroups(),
    pagination: paginationData,
  })
  return (
    <List>
      <TableContainer whiteSpace='pre-line'>
        <Table variant='simple'>
          {headers}
          {body}
        </Table>
      </TableContainer>
      {pagination}
    </List>
  )
}
