/** @format */

'use client'

import React from 'react'
import { IResourceComponentsProps } from '@refinedev/core'
import { useTable } from '@refinedev/react-table'
import { ColumnDef } from '@tanstack/react-table'
import { TableContainer, Table, HStack, Image } from '@chakra-ui/react'
import { FirebaseImage, IProduct, IVariant } from 'types/index'
import { useDefaultTableRender } from '@/hooks/useRenderTable'
import { API } from 'types/constants'
import { EditButton, ShowButton } from '@components/buttons'
import { List } from '@components/crud'

const page = () => {
  return (
    <>
      <VariantList />
    </>
  )
}

const { resource, projection } = API['variants']()
export const variantColumns: ColumnDef<IVariant>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    header: 'Id',
  },
  {
    id: 'sku',
    accessorKey: 'sku',
    header: 'Mã SKU',
  },
  {
    id: 'images',
    accessorKey: 'images',
    header: 'Hình ảnh',

    cell: function render({ getValue }) {
      return (
        <HStack>
          {getValue<FirebaseImage[]>()?.map((item, index) => (
            <Image
              src={item}
              key={index}
              sx={{ height: '50px', maxWidth: '100px' }}
            />
          ))}
        </HStack>
      )
    },
  },
  {
    id: 'price',
    accessorKey: 'price',
    header: 'Giá tiền',
  },
  {
    id: 'availableQuantity',
    accessorKey: 'availableQuantity',
    header: 'Số lượng khả dụng',
    enableHiding: true,
    enableResizing: true,
  },
  {
    id: 'actions',
    accessorKey: 'id',
    header: 'Hành động',
    cell: function render({ getValue }) {
      return (
        <HStack>
          <ShowButton
            resource={resource}
            hideText
            recordItemId={getValue() as string}
          />
          <EditButton
            resource={resource}
            hideText
            recordItemId={getValue() as string}
          />
        </HStack>
      )
    },
  },
]

export const VariantList: React.FC<IResourceComponentsProps> = () => {
  const columns = React.useMemo<ColumnDef<IVariant>[]>(() => {
    const productColumn: ColumnDef<IVariant> = {
      id: 'product',
      accessorKey: 'product',
      header: 'Tên sản phẩm',
      cell: function render({ cell, getValue }) {
        return <>{(getValue() as IProduct).name}</>
      },
    }
    const columnsWithProduct = [...variantColumns]
    columnsWithProduct.splice(1, 0, productColumn)
    return columnsWithProduct
  }, [])
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
    refineCoreProps: {
      meta: {
        query: {
          projection: projection.withProductName,
        },
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
    rowModel: getRowModel(),
    headerGroups: getHeaderGroups(),
    pagination: {
      current,
      setCurrent,
      pageCount,
      pageSize,
      setPageSize,
    },
  })
  return (
    <List canCreate={false}>
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

export default page

export { variantColumns as variantTableColumns }
