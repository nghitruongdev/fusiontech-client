/** @format */

'use client'
import React, { useEffect, useMemo, useState } from 'react'
import {
  IResourceComponentsProps,
  useCustomMutation,
  useUpdate,
} from '@refinedev/core'
import { useTable } from '@refinedev/react-table'
import { ColumnDef } from '@tanstack/react-table'
import { TableContainer, Table } from '@chakra-ui/react'
import { useDefaultTableRender } from '@/hooks/useRenderTable'
import { List } from '@components/crud'
import { IUser, ROLES, Option } from 'types'
import { ROLE_LABEL } from 'types/constants'
import { useHeaders } from '@/hooks/useHeaders'
import Select, { ActionMeta, MultiValue } from 'react-select'
import {
  onDefaultSuccess,
  onError,
  onSuccess,
} from '@/hooks/useCrudNotification'
const pageRole = () => {
  return <UserListRole />
}

const UserListRole: React.FC<IResourceComponentsProps> = () => {
  const { getAuthHeader } = useHeaders()
  const columns = React.useMemo<ColumnDef<IUser>[]>(
    () => [
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
        header: 'Phân quyền',
        cell: function render({ getValue, row }) {
          return (
            <RoleSelect
              roles={getValue<string[]>() ?? []}
              uid={row.original.firebaseUid}
            />
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

const roleOptions = Object.entries(ROLES)
  .filter(([, value]) => value !== ROLES.USER)
  .map(([value, label]) => ({
    label: ROLE_LABEL[label].text,
    value: value,
  }))
const RoleSelect = ({ roles, uid }: { roles: string[]; uid: string }) => {
  const { mutate, status } = useCustomMutation()
  const { getAuthHeader, authHeader } = useHeaders()
  const [values, setValues] = useState<MultiValue<Option<string>>>([])

  useEffect(() => {
    if (!roles) return
    const value = roles
      .filter((item) => !!item && item !== 'USER')
      .map((item) => ({
        label: ROLE_LABEL[item.toLowerCase() as ROLES]?.text,
        value: item,
      }))
    setValues(value)
  }, [roles])
  const handleChange = (
    newValue: MultiValue<Option<string>>,
    action: ActionMeta<Option<string>>,
  ) => {
    const submitRoles = newValue?.map((item) => item.value) ?? []
    mutate(
      {
        url: 'users/update-role',
        method: 'patch',
        values: {
          firebaseUid: uid,
          roles: ['USER', ...submitRoles],
        },
        config: {
          headers: {
            ...getAuthHeader(),
          },
        },
        errorNotification: onError,
        successNotification: () =>
          onDefaultSuccess('Cập nhật quyền thành công'),
      },
      {
        onSuccess() {
          setValues(newValue)
        },
      },
    )
  }
  return (
    <>
      <Select
        isMulti
        value={values}
        options={roleOptions}
        onChange={handleChange}
        isLoading={status === 'loading'}
      />
    </>
  )
}

export default pageRole
