'use client'

import React from 'react'
import { IResourceComponentsProps } from '@refinedev/core'
import { useTable } from '@refinedev/react-table'
import { ColumnDef } from '@tanstack/react-table'
import {} from '@refinedev/chakra-ui'
import { TableContainer, Table, HStack } from '@chakra-ui/react'
import { useDefaultTableRender } from '@/hooks/useRenderTable'
import { List } from '@components/crud'
import { DeleteButton, EditButton, ShowButton } from '@components/buttons'
import { FirebaseImage } from 'types'
import Image from 'next/image'
import { Images } from 'types/constants'

export default function ListPage() {
  return <BrandList />
}

export const BrandList: React.FC<IResourceComponentsProps> = () => {
  const columns = React.useMemo<ColumnDef<any>[]>(
    () => [
      {
        id: 'id',
        accessorKey: 'id',
        header: 'Id',
      },
      {
        id: 'name',
        accessorKey: 'name',
        header: 'Tên thương hiệu',
      },
      {
        id: 'image',
        accessorKey: 'image',
        header: 'Hình ảnh',
        cell: function render({ getValue }) {
          return (
            // eslint-disable-next-line jsx-a11y/alt-text
            <Image
              alt="/"
              width={70}
              height={70}
              src={getValue<FirebaseImage>()?.url ?? Images.brands}
            />
          )
        },
      },
      {
        id: 'actions',
        accessorKey: 'id',
        header: 'Hành động',
        cell: function render({ getValue }) {
          return (
            <HStack>
              <ShowButton hideText recordItemId={getValue() as string} />
              <EditButton hideText recordItemId={getValue() as string} />
              <DeleteButton hideText recordItemId={getValue() as string} />
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
      <TableContainer whiteSpace="pre-line">
        <Table variant="simple">
          {headers}
          {body}
        </Table>
      </TableContainer>
      {pagination}
    </List>
  )
}
