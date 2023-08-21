/** @format */

'use client'
import React from 'react'
import { IResourceComponentsProps } from '@refinedev/core'
import { useTable } from '@refinedev/react-table'
import { ColumnDef } from '@tanstack/react-table'
import { TableContainer, Table } from '@chakra-ui/react'
import { useDefaultTableRender } from '@/hooks/useRenderTable'
import { List } from '@components/crud'
import Image from 'next/image'
import { FirebaseImage, Gender, IUser, ROLES } from 'types'
import { Images, ROLE_LABEL } from 'types/constants'
import { GenderLabel } from 'types/constants'
import { useHeaders } from '@/hooks/useHeaders'
import Select from 'react-select'
import { toOptionString } from '@/lib/utils'
const pageRole = () => {
  return <UserListRole />
}

const UserListRole: React.FC<IResourceComponentsProps> = () => {
  const { getAuthHeader } = useHeaders()
  const columns = React.useMemo<ColumnDef<IUser>[]>(
    () => [
      {
        id: 'id',
        accessorKey: 'id',
        header: 'Id',
      },
      {
        id: 'fullName',
        accessorKey: 'fullName',
        header: 'Họ và tên',
      },
      {
        id: 'email',
        accessorKey: 'email',
        header: 'Email',
      },

      {
        id: 'actions',
        accessorKey: 'roles',
        header: 'Hành động',
        cell: function render({ getValue }) {
          return <RoleSelect roles={getValue<string[]>() ?? []} />
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
    refineCoreProps: {
      resource: 'users',
      meta: {
        query: {
          projection: 'user-roles',
        },
        headers: {
          ...getAuthHeader(),
        },
      },
    },
  })
  console.log('table data', tableData)
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

const roleOptions = Object.entries(ROLES).map(([value, label]) => ({
  label: ROLE_LABEL[label].text,
  value: value,
}))

const RoleSelect = ({ roles }: { roles: string[] }) => {
  console.log(roles)
  const selected = roles.map((item) => ({
    label: ROLE_LABEL[item as ROLES].text,
    value: item,
  }))
  return (
    <>
      {JSON.stringify(selected)}
      <Select
        isMulti
        defaultValue={selected}
        options={roleOptions}
      />
    </>
  )
}

export default pageRole
