'use client'

import React from 'react'
import {
  IResourceComponentsProps,
  GetManyResponse,
  useMany,
  useList,
  GetListResponse,
} from '@refinedev/core'
import { useTable } from '@refinedev/react-table'
import { ColumnDef, flexRender } from '@tanstack/react-table'
import { DateField, NumberField } from '@refinedev/chakra-ui'
import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  HStack,
  Badge,
} from '@chakra-ui/react'

import { Pagination } from '@components/pagination'
import { IOrder, IOrderStatus } from 'types'
import { EditableControls, OrderStatus, statusColor } from '../OrderStatus'
import { ShowButton } from '@components/buttons'
import { List } from '@components/crud'
export default function ListPage() {
  // return <ChakraUIListInferencer />;
  return <OrderList />
}

export const OrderList: React.FC<IResourceComponentsProps> = () => {
  const columns = React.useMemo<ColumnDef<IOrder>[]>(
    () => [
      {
        id: 'id',
        accessorKey: 'id',
        header: 'Id',
      },
      {
        id: 'userId',
        accessorKey: 'userId',
        header: 'Id người dùng',
        cell: function render({ getValue, table }) {
          const meta = table.options.meta as {
            userData: GetManyResponse
          }

          const user = meta.userData?.data?.find(
            (item) => item.id === getValue<any>(),
          )

          return user?.id?.toString().substring(0, 6) ?? 'Loading...'
        },
      },
      // {
      //     id: "note",
      //     accessorKey: "note",
      //     header: "Note",
      // },
      // {
      //     id: "email",
      //     accessorKey: "email",
      //     header: "Email",
      // },

      {
        id: 'purchasedAt',
        accessorKey: 'purchasedAt',
        header: 'Ngày mua hàng ',
        cell: function render({ getValue }) {
          return <DateField value={getValue<any>()} />
        },
      },
      {
        id: 'paymentAmount',
        accessorKey: 'paymentId',
        header: 'Phương thức thanh toán',
        cell: function render({ getValue, table }) {
          const meta = table.options.meta as {
            paymentData: GetManyResponse
          }

          const payment = meta.paymentData?.data?.find(
            (item) => item.id === getValue<any>(),
          )

          return <NumberField value={payment?.amount} /> ?? 'Loading...'
        },
      },
      {
        id: 'paymentStatus',
        accessorKey: 'paymentId',
        header: 'Trạng thái thanh toán',
        cell: function render({ getValue, table }) {
          const meta = table.options.meta as {
            paymentData: GetManyResponse
          }

          const payment = meta.paymentData?.data?.find(
            (item) => item.id === getValue<any>(),
          )

          return (
            <Badge
              variant="outline"
              px="2"
              // py="1"
              lineHeight="taller"
              rounded="md"
              colorScheme="whatsapp"
            >
              {payment?.status ?? 'Loading...'}
            </Badge>
          )
        },
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: 'Trạng thái đơn hàng',
        cell: function render({ getValue, row, table }) {
          const statusName = getValue() as string
          const meta = table.options.meta as {
            statusData: GetListResponse<IOrderStatus>
            statusOptions: { label: string; value: IOrderStatus }[]
          }
          const status = meta.statusData?.data?.find(
            (st) => st.name === statusName,
          )
          return (
            <>
              {!!status ? (
                status.isChangeable ? (
                  <OrderStatus
                    status={status}
                    control={
                      <EditableControls
                        options={meta.statusOptions}
                        status={status}
                        orderId={row.original.id}
                      />
                    }
                  />
                ) : (
                  <Badge colorScheme={statusColor(status)} px="4" py="1">
                    {status.detailName}
                  </Badge>
                )
              ) : (
                <Badge>Loading...</Badge>
              )}
            </>
          )
        },
      },
      {
        id: 'actions',
        accessorKey: 'id',
        header: 'Hành động',
        cell: function render({ getValue }) {
          return (
            <HStack justifyContent="center">
              <ShowButton hideText recordItemId={getValue() as string} />
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

  if (!!tableData) {
    // console.log("tableData?.data", tableData?.data);
  }

  const { data: statusData } = useList<IOrderStatus>({
    resource: 'orders/statuses',
    queryOptions: {
      enabled: !!tableData?.data,
    },
    pagination: {
      mode: 'off',
    },
  })

  const userIds = tableData?.data?.map((item) => item?.userId) ?? []
  const { data: userData } = useMany({
    resource: 'users',
    ids: userIds,
    queryOptions: {
      enabled: userIds.length > 0,
    },
  })

  const paymentIds = tableData?.data?.map((item) => item?.paymentId) ?? []
  const { data: paymentData } = useMany({
    resource: 'payments',
    ids: paymentIds,
    queryOptions: {
      enabled: paymentIds.length > 0,
    },
  })

  setOptions((prev) => ({
    ...prev,
    meta: {
      ...prev.meta,
      userData,
      statusData,
      paymentData,
      statusOptions:
        statusData?.data.map((status) => ({
          label: status.detailName,
          value: status,
        })) ?? [],
    },
  }))

  return (
    <List>
      <TableContainer whiteSpace="pre-line">
        <Table variant="simple">
          <Thead>
            {getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th key={header.id}>
                    {!header.isPlaceholder &&
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {getRowModel().rows.map((row) => (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Pagination
        current={current}
        pageCount={pageCount}
        setCurrent={setCurrent}
        pageSize={pageSize}
        setPageSize={setPageSize}
      />
    </List>
  )
}
