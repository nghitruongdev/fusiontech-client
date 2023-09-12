/** @format */

'use client'

import React, { useMemo } from 'react'
import {
  IResourceComponentsProps,
  GetManyResponse,
  useMany,
  GetListResponse,
  useCustom,
} from '@refinedev/core'
import { useTable } from '@refinedev/react-table'
import { useHeaders } from '@/hooks/useHeaders'
import { ColumnDef } from '@tanstack/react-table'
import { DateField, TextField } from '@refinedev/chakra-ui'
import { TableContainer, Table, HStack, Badge } from '@chakra-ui/react'
import { Button } from '@components/ui/shadcn/button'
import { useState } from 'react'
import { IOrderStatusGroup } from 'types'
import { API, ORDER_STATUS_GROUP } from 'types/constants'
import {
  IOrder,
  IOrderStatus,
  IPayment,
  IUser,
  OrderStatus as OrderStatusType,
  OrderStatusText,
  PaymentStatus,
  PaymentStatusLabel,
} from 'types'
import { EditableControls, OrderStatus } from '../OrderStatus'
import { ShowButton } from '@components/buttons'
import { List } from '@components/crud'
import { useDefaultTableRender } from '@/hooks/useRenderTable'
import { formatPrice } from '@/lib/utils'
import { onError } from '@/hooks/useCrudNotification'
import { statusColor } from 'types/constants'
export default function ListPage() {
  return <OrderList />
}
const statusGroups = ORDER_STATUS_GROUP as IOrderStatusGroup[]
const { findByStatus, findAllStatusByGroup } = API.orders()
const OrderList: React.FC<IResourceComponentsProps> = () => {
  const { getAuthHeader, authHeader } = useHeaders()
  const [group, setTab] = useState<IOrderStatusGroup>(
    statusGroups[0] as IOrderStatusGroup,
  )

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
              px='4'
              py='1'
              rounded='md'
              colorScheme={`${status?.color ? status.color : 'facebook'}`}>
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
  const { data: { data: statusList } = {} } = useCustom<IOrderStatus[]>({
    url: findAllStatusByGroup(group.name),
    method: 'get',
    queryOptions: {
      enabled: !!authHeader,
    },
    config: {
      headers: {
        ...authHeader,
      },
    },
  })
  const statusParam = useMemo(
    () => statusList?.map((item) => item.name).join(',') ?? '',
    [statusList],
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
        url: findByStatus(statusParam),
      },
      queryOptions: {
        enabled: !!statusParam,
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
    <List
      headerButtons={() => {
        return (
          <>
            <OrderStatusTab
              group={group}
              setGroup={setTab}
            />
          </>
        )
      }}>
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

const OrderStatusTab = ({
  group,
  setGroup,
}: {
  group: IOrderStatusGroup
  setGroup: (newTab: IOrderStatusGroup) => void
}) => {
  return (
    <div className='w-full flex gap-4 justify-between mt-4 items-center bg-white'>
      <div className='flex flex-grow rounded-md shadow-md bg-red overflow-hidden'>
        {statusGroups.map((item) => {
          return (
            <Button
              key={item.id}
              variant={'secondary'}
              onClick={() => {
                setGroup(item)
              }}
              className={`${
                item.id === group.id
                  ? 'bg-zinc-100 text-blue-600'
                  : 'bg-white text-zinc-400'
              } min-w-[100px] px-4 py-2 text-sm font-semibold text-center`}>
              <p className='whitespace-nowrap'>{item.detailName}</p>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
