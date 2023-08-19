/** @format */

'use client'

import React from 'react'
import {
  IResourceComponentsProps,
  GetManyResponse,
  useMany,
  useList,
  GetListResponse,
  useCustom,
} from '@refinedev/core'
import { useTable } from '@refinedev/react-table'
import { useHeaders } from '@/hooks/useHeaders'
import { ColumnDef, flexRender } from '@tanstack/react-table'
import { DateField, NumberField, TextField } from '@refinedev/chakra-ui'
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
import {
  IBasicUser,
  IOrder,
  IOrderStatus,
  IPayment,
  IUser,
  OrderStatus as OrderStatusType,
  OrderStatusText,
  PaymentStatus,
  PaymentStatusLabel,
} from 'types'
import { EditableControls, OrderStatus, statusColor } from '../OrderStatus'
import { ShowButton } from '@components/buttons'
import { List } from '@components/crud'
import { useDefaultTableRender } from '@/hooks/useRenderTable'
import { formatPrice } from '@/lib/utils'
import { onError } from '@/hooks/useCrudNotification'
export default function ListPage() {
  return <OrderList />
}

const OrderList: React.FC<IResourceComponentsProps> = () => {
  const { getAuthHeader } = useHeaders()
  const columns = React.useMemo<ColumnDef<IOrder>[]>(
    () => [
      {
        id: 'id',
        accessorKey: 'id',
        header: 'Id',
      },
      {
        id: 'user_name',
        accessorKey: 'user',
        header: 'Tên người nhận',
        cell: function render({ getValue, table }) {
          return <TextField value={getValue<IUser>().firstName} />
        },
      },
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
        header: 'Tổng tiền',
        cell: function render({ getValue, table }) {
          const meta = table.options.meta as {
            paymentData: GetManyResponse
          }

          const payment = meta.paymentData?.data?.find(
            (item) => item.id === getValue<number>(),
          )
          return formatPrice(+payment?.amount)
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
          const status =
            payment?.status &&
            PaymentStatusLabel[payment.status as PaymentStatus]
          if (!status) return <></>
          return (
            <Badge
              variant='outline'
              //   colorScheme={statusColor(status)}
              px='4'
              py='1'
              rounded='md'
              //   variant='outline'
              //   px='2'
              //   // py="1"
              //   lineHeight='taller'
              //   rounded='md'
              // colorScheme=''
              colorScheme={`${status?.color ? status.color : 'facebook'}`}
              //   colorScheme={`${status?.color ? status.color : 'whatsapp'}`}
            >
              {status?.text}
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

          if (!status) return <></>

          if (!status.isChangeable)
            return (
              <Badge
                variant='outline'
                colorScheme={statusColor(status)}
                px='4'
                py='1'
                rounded='md'>
                {OrderStatusText[statusName as string as OrderStatusType].text}
              </Badge>
            )
          return (
            <div className='min-w-[200px]'>
              <OrderStatus
                status={status}
                control={
                  <EditableControls
                    options={meta.statusOptions.filter(
                      (item) => item.value.name !== 'CANCELLED',
                    )}
                    status={status}
                    orderId={row.original.id}
                  />
                }
              />
            </div>
          )
        },
      },
      {
        id: 'actions',
        accessorKey: 'id',
        header: 'Hành động',
        cell: function render({ getValue }) {
          return (
            <HStack justifyContent='center'>
              <ShowButton
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
    refineCoreProps: {
      meta: {
        headers: {
          ...getAuthHeader(),
        },
      },
    },
  })

  const { data: statusData } = useCustom<IOrderStatus[]>({
    url: 'orders/statuses',
    method: 'get',
    queryOptions: {
      enabled: !!tableData?.data,
    },
    config: {
      headers: {
        ...getAuthHeader(),
      },
    },
    errorNotification: onError,
  })

  //   const userIds = tableData?.data?.map((item) => item?.userId) ?? []
  //   const { data: userData } = useMany({
  //     resource: 'users',
  //     ids: userIds,
  //     queryOptions: {
  //       enabled: userIds.length > 0,
  //     },
  //   }).bind()

  const paymentIds = tableData?.data?.map((item) => item?.paymentId) ?? []
  const { data: paymentData } = useMany<IPayment>({
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
      //   userData,
      statusData,
      paymentData,
      statusOptions:
        statusData?.data.map((status) => ({
          label: OrderStatusText[status.name as OrderStatusType].text,
          value: status,
        })) ?? [],
    },
  }))
  const { headers, body, pagination } = useDefaultTableRender({
    rowModel: getRowModel(),
    headerGroups: getHeaderGroups(),
    pagination: { current, setCurrent, pageCount, pageSize, setPageSize },
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
