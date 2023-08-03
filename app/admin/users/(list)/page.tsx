/** @format */

'use client'

import React from 'react'
import { IResourceComponentsProps } from '@refinedev/core'
import { useTable } from '@refinedev/react-table'
import { ColumnDef } from '@tanstack/react-table'
import { TableContainer, Table, HStack } from '@chakra-ui/react'
import { useDefaultTableRender } from '@/hooks/useRenderTable'
import { EditButton, ShowButton } from '@components/buttons'
import { List } from '@components/crud'
import Image from 'next/image'
import { FirebaseImage, IUser } from 'types'
import { Images } from 'types/constants'

export default function ListPage() {
  return <UserList />
}

export const UserList: React.FC<IResourceComponentsProps> = () => {
  const columns = React.useMemo<ColumnDef<IUser>[]>(
    () => [
      {
        id: 'id',
        accessorKey: 'id',
        header: 'Id',
      },
      // {
      //   id: 'firebaseUid',
      //   accessorKey: 'firebaseUid',
      //   header: 'Firebase Uid',
      // },
      {
        id: 'fullName',
        accessorKey: 'fullName',
        header: 'Tên đầy đủ',
      },
      {
        id: 'email',
        accessorKey: 'email',
        header: 'Email',
      },
      {
        id: 'phoneNumber',
        accessorKey: 'phoneNumber',
        header: 'Số điện thoại',
      },

      {
        id: 'gender',
        accessorKey: 'gender',
        header: 'Giới tính',
      },
      {
        id: 'image',
        accessorKey: 'image',
        header: 'Hình ảnh',
        cell: function render({ getValue }) {
          return (
            <Image
              alt='/'
              width={50}
              height={50}
              src={getValue<FirebaseImage>() ?? Images.users}
              className='rounded-full'
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
  const { headers, body, pagination } = useDefaultTableRender({
    rowModel: getRowModel(),
    headerGroups: getHeaderGroups(),
    pagination: {
      pageCount,
      current,
      setCurrent,
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
