/** @format */

'use client'

import React, { useState } from 'react'
import { IResourceComponentsProps, useUpdate } from '@refinedev/core'
import { useTable } from '@refinedev/react-table'
import { ColumnDef } from '@tanstack/react-table'
import {
  TableContainer,
  Table,
  Image,
  HStack,
  FormControl,
  Switch,
} from '@chakra-ui/react'
import { FirebaseImage, IProduct } from 'types'
import { useDefaultTableRender } from '@/hooks/useRenderTable'
import { List } from '@components/crud'
import { EditButton, ShowButton } from '@components/buttons'
import { Images, API } from 'types/constants'
import { AppError } from 'types/error'
import { onDefaultSuccess, onError } from '@/hooks/useCrudNotification'
import { Stars } from 'lucide-react'
import { useHeaders } from '@/hooks/useHeaders'

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
            <div className=''>
              <p>{getValue<string>() ?? ''}</p>
            </div>
          )
        },
      },
      //   {
      //     id: 'summary',
      //     accessorKey: 'summary',
      //     header: 'Mô tả',
      //     cell: function render({ getValue }) {
      //       return (
      //         <div className='line-clamp-3'>
      //           <p>{(getValue() as any) ?? ''}</p>
      //         </div>
      //       )
      //     },
      //   },
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
        cell: ({ getValue }) => (
          <p className='flex items-center gap-1'>
            {getValue<number>()?.toFixed(1)}
            <Stars className='text-xs text-yellow w-4 h-4 no-wrap' />
          </p>
        ),
      },
      {
        id: 'active',
        accessorKey: 'active',
        header: 'Hiển thị',
        cell: function render({ getValue, row }) {
          return (
            <ActiveToggle
              defaultValue={getValue<boolean>()}
              id={row.getValue<number>('id')}
            />
          )
        },
      },
      {
        id: 'actions',
        accessorKey: 'id',
        header: 'Menu',
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

const ActiveToggle = ({
  defaultValue,
  id,
}: {
  defaultValue: boolean
  id: number
}) => {
  const { resource } = API.products()
  const { mutateAsync, isLoading } = useUpdate<IProduct, AppError>()
  const [active, setActive] = useState<boolean>(defaultValue)
  const { getAuthHeader } = useHeaders()
  return (
    <FormControl
      display='flex'
      alignItems='center'>
      <Switch
        id='show-hide-product'
        checked={active}
        isChecked={active}
        isDisabled={isLoading}
        onChange={() => {
          mutateAsync(
            {
              resource,
              id,
              values: { active: !active },
              meta: {
                headers: {
                  ...getAuthHeader(),
                },
              },
              invalidates: false as unknown as any,
              errorNotification: onError,

              successNotification: onDefaultSuccess('Cập nhật thành công'),
            },
            {
              onSuccess() {
                setActive((prev) => !prev)
              },
            },
          )
        }}
      />
    </FormControl>
  )
}
