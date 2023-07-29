'use client'

import React from 'react'
import { IResourceComponentsProps } from '@refinedev/core'
import { useTable } from '@refinedev/react-table'
import { ColumnDef, flexRender } from '@tanstack/react-table'
import { TableContainer, Table, Image, HStack } from '@chakra-ui/react'
import { FirebaseImage, IProduct } from 'types'
import { useDefaultTableRender } from '@/hooks/useRenderTable'
import { List } from '@components/crud'
import { EditButton, ShowButton } from '@components/buttons'

export default function ListPage() {
  return <ProductList />
}
const ProductList: React.FC<IResourceComponentsProps> = () => {
  const columns = React.useMemo<ColumnDef<IProduct>[]>(
    () => [
      {
        id: 'id',
        accessorKey: 'id',
        header: 'Id',
      },
      {
        id: 'name',
        accessorKey: 'name',
        header: 'Name',
      },
      {
        id: 'summary',
        accessorKey: 'summary',
        header: 'Summary',
      },
      {
        id: 'description',
        accessorKey: 'description',
        header: 'Description',
      },
      {
        id: 'thumbnail',
        accessorKey: 'thumbnail',
        header: 'Thumbnail',
        cell: function render({ getValue }) {
          return (
            <Image
              sx={{ maxWidth: '100px' }}
              src={getValue<FirebaseImage>()?.url}
            />
          )
        },
      },
      {
        id: 'reviewCount',
        accessorKey: 'reviewCount',
        header: 'Review Count',
      },
      {
        id: 'avgRating',
        accessorKey: 'avgRating',
        header: 'Avg Rating',
      },
      {
        id: 'actions',
        accessorKey: 'id',
        header: 'Actions',
        cell: function render({ getValue }) {
          return (
            <HStack>
              <ShowButton hideText recordItemId={getValue() as string} />
              <EditButton hideText recordItemId={getValue() as string} />
              {/* <DeleteButton
                                hideText
                                recordItemId={getValue() as string}
                            /> */}
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
      setPageSize,
      pageSize,
      tableQueryResult: { data: tableData },
    },
  } = useTable({
    columns,
    refineCoreProps: {
      sorters: {
        initial: [],
      },
    },
  })

  setOptions((prev) => ({
    ...prev,
    meta: {
      ...prev.meta,
    },
  }))
  const { headers, body, pagination } = useDefaultTableRender({
    headerGroups: getHeaderGroups(),
    rowModel: getRowModel(),
    pagination: { current, pageCount, pageSize, setCurrent, setPageSize },
  })
  console.log('tableData', tableData)
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
