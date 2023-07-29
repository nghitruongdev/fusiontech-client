'use client'
import { IResourceComponentsProps } from '@refinedev/core'
import { useTable } from '@refinedev/react-table'
import { ColumnDef } from '@tanstack/react-table'
import { TagField } from '@refinedev/chakra-ui'
import { TableContainer, Table, HStack } from '@chakra-ui/react'
import React from 'react'
import { useDefaultTableRender } from '@/hooks/useRenderTable'
import { List } from '@components/crud'
import { DeleteButton, EditButton, ShowButton } from '@components/buttons'

export default function ListPage() {
  return <CategoriesList />
}

export const CategoriesList: React.FC<IResourceComponentsProps> = () => {
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
        header: 'Name',
      },
      {
        id: 'slug',
        accessorKey: 'slug',
        header: 'Slug',
      },
      {
        id: 'description',
        accessorKey: 'description',
        header: 'Description',
      },
      {
        id: 'categorySpecs',
        accessorKey: 'categorySpecs',
        header: 'Category Specs',

        cell: function render({ getValue }) {
          return (
            <HStack>
              {getValue<any[]>()?.map((item, index) => (
                <TagField value={item} key={index} />
              ))}
            </HStack>
          )
        },
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
    current,
    setCurrent,
    pageSize,
    setPageSize,
    pageCount,
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
