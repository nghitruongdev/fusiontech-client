/** @format */

import React from 'react'
import { IResourceComponentsProps, useUpdate } from '@refinedev/core'
import { useTable } from '@refinedev/react-table'
import { ColumnDef } from '@tanstack/react-table'
import { TableContainer, Table, HStack, Image } from '@chakra-ui/react'
import { FirebaseImage, IProduct, IVariant } from 'types/index'
import { useDefaultTableRender } from '@/hooks/useRenderTable'
import { API } from 'types/constants'
import { EditButton, ShowButton } from '@components/buttons'
import { List } from '@components/crud'
import { variantTableColumns } from './columns'
import { AppError } from 'types/error'

const { resource, projection } = API['variants']()

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
    const columnsWithProduct = [...variantTableColumns]
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
          projection: projection.withProductBasic,
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
