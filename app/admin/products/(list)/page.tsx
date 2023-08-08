/** @format */

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
import { Images } from 'types/constants'

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
        header: 'Tên sản phẩm',
        cell: function render({ getValue }) {
          return (
            <div className='line-clamp-3'>
              <p>{(getValue() as any) ?? ''}</p>
            </div>
          )
        },
      },
      {
        id: 'summary',
        accessorKey: 'summary',
        header: 'Mô tả',
        cell: function render({ getValue }) {
          return (
            <div className='line-clamp-3'>
              <p>{(getValue() as any) ?? ''}</p>
            </div>
          )
        },
      },
      {
        id: 'description',
        accessorKey: 'description',
        header: 'Giới thiệu',
        cell: function render({ getValue }) {
          return (
            <div className='line-clamp-3'>
              <p>{(getValue() as any) ?? ''}</p>
            </div>
          )
        },
      },
      {
        id: 'images',
        accessorKey: 'images',
        header: 'Hình ảnh',
        cell: function render({ getValue }) {
          return (
            <Image
              sx={{ maxWidth: '100px' }}
              src={getValue<FirebaseImage[]>()?.[0] ?? Images.products}
              alt={getValue<FirebaseImage>()}
              width={70}
              height={70}
            />
          )
        },
      },
      {
        id: 'reviewCount',
        accessorKey: 'reviewCount',
        header: 'Số lượt đánh giá',
      },
      {
        id: 'avgRating',
        accessorKey: 'avgRating',
        header: 'Đánh giá',
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
