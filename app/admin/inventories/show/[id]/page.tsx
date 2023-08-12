/** @format */

'use client'

import {
  useShow,
  IResourceComponentsProps,
  useCustom,
  useMany,
  useInfiniteList,
  useInvalidate,
} from '@refinedev/core'
import { TextField, DateField, NumberField } from '@refinedev/chakra-ui'
import {
  Heading,
  Portal,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { TableCaption } from '@components/ui/shadcn/table'
import { IInventory, IInventoryDetail, IVariant } from 'types'
import { useEffect, useMemo, useState } from 'react'
import React from 'react'
import { useModalForm } from '@refinedev/react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import { Show } from '@components/crud'
import { DeleteButton, EditButton } from '@components/buttons'
import { formatDateTime } from '../../../../../src/lib/utils'
import { AppError } from 'types/error'
import { API } from 'types/constants'
import dynamic from 'next/dynamic'
import LoadingOverlay from '@components/ui/LoadingOverlay'
import { onError, onSuccess } from '@/hooks/useCrudNotification'
export default function ShowPage() {
  return <InventoryShow />
}

export const InventoryShow: React.FC<IResourceComponentsProps> = () => {
  const { inventory } = useData()
  const { data, isLoading, isError, isFetched } = inventory
  const record = data?.data

  return (
    <Show
      isLoading={isLoading}
      canDelete={true}
      headerButtons={({ deleteButtonProps, defaultButtons }) => (
        <>{defaultButtons}</>
      )}>
      {isError && <>Không tìm thấy dữ liệu</>}
      {isFetched && !isError && (
        <>
          <Heading
            as='h5'
            size='sm'
            mt={4}>
            ID
          </Heading>
          <NumberField value={record?.id ?? ''} />
          <Heading
            as='h5'
            size='sm'
            mt={4}>
            Được tạo bởi
          </Heading>
          <TextField value={record?.createdBy.name} />
          <Heading
            as='h5'
            size='sm'
            mt={4}>
            Thời gian tạo
          </Heading>
          <p>{formatDateTime(record?.createdDate)}</p>
          {!!record?.lastModifiedBy && (
            <>
              <Heading
                as='h5'
                size='sm'
                mt={4}>
                Được cập nhật bởi
              </Heading>
              <TextField value={record?.lastModifiedBy?.name} />
            </>
          )}
          {record?.lastModifiedBy && (
            <>
              <Heading
                as='h5'
                size='sm'
                mt={4}>
                Thời gian cập nhật
              </Heading>
              <DateField value={record?.lastModifiedDate} />
            </>
          )}

          <Heading
            as='h5'
            size='sm'
            mt={4}>
            Tổng số lượng
          </Heading>
          <NumberField value={record?.totalQuantity ?? ''} />
          <InventoryItems />
        </>
      )}
    </Show>
  )
}

const InventoryItems = ({ className }: { className?: string }) => {
  const {
    inventory: { data: inventoryData },
    items: { data, queryKey: itemsQueryKey },
    variants: { data: variantData },
  } = useData()

  //update variant-infos in inventory detail list
  const items = useMemo(() => {
    const variants = variantData?.data || []

    const findVariant = (id?: string) =>
      variants.find((v) => !!id && v.id === +id)

    return !!variants.length
      ? (data?.data ?? []).map((item) => ({
          ...item,
          variant: findVariant(item.variantId),
        }))
      : []
  }, [data?.data, variantData?.data])

  const invalidate = useInvalidate()
  const { resource: detailResource } = API['inventory-details']()
  const { resource: variantResource } = API['variants']()
  const queryClient = useQueryClient()
  const modalFormProps = useModalForm<
    IInventoryDetail,
    AppError,
    IInventoryDetail
  >({
    refineCoreProps: {
      resource: detailResource,
      action: 'edit',
      onMutationSuccess(data, variables, context) {
        queryClient.invalidateQueries(itemsQueryKey)
        invalidate({
          resource: variantResource,
          invalidates: ['many'],
        })
      },
      successNotification: onSuccess,
      errorNotification: onError,
      mutationMode: 'optimistic',
    },
  })

  const {
    modal: { show: showModal, visible },
  } = modalFormProps
  return (
    <div className={className}>
      <Heading
        as='h5'
        size='sm'
        mt={4}>
        Bảng nhập kho
      </Heading>
      <TableContainer whiteSpace='pre-line'>
        <Table
          size='md'
          variant='simple'>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Tên Sản Phẩm</Th>
              <Th>Mã phiên bản</Th>
              <Th>Mã SKU</Th>
              <Th isNumeric>Số Lượng Nhập</Th>
              <Th isNumeric>Số Lượng Khả Dụng</Th>
              <Th>Menu</Th>
            </Tr>
          </Thead>
          <Tbody>
            {items.map(({ id, quantity, variant }) => (
              <Tr key={id}>
                <Td>{id}</Td>
                <Td>{variant?.product?.name}</Td>
                <Td>{variant?.id}</Td>
                <Td>{variant?.sku}</Td>
                <Td isNumeric>{quantity}</Td>
                <Td isNumeric>{variant?.availableQuantity}</Td>
                <Td
                  display='flex'
                  gap='2'>
                  <EditButton
                    hideText
                    onClick={showModal.bind(null, id)}
                  />

                  <DeleteButton
                    hideText
                    resource={detailResource}
                    recordItemId={id}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
          <TableCaption>Chi tiết quản lý kho</TableCaption>
        </Table>
      </TableContainer>
      <Portal>{visible && <DynamicModalForm {...modalFormProps} />}</Portal>
    </div>
  )
}

const DynamicModalForm = dynamic(
  () =>
    import(`../../(form)/EditDetailModalForm`).then(
      (mod) => mod.EditDetailModalForm,
    ),
  {
    loading: () => <LoadingOverlay />,
  },
)
const useData = () => {
  const { queryResult } = useShow<IInventory>()
  const record = queryResult.data?.data
  const itemsQueryKey = [record?._links?.items?.href]

  const { resource } = API['inventory-details']()
  const items = useCustom<IInventoryDetail[]>({
    url: record?._links?.items?.href || '',
    method: 'get',
    meta: {
      resource,
    },
    queryOptions: {
      enabled: !!record,
      keepPreviousData: true,
      queryKey: itemsQueryKey,
    },
  })

  const {
    resource: variantResource,
    projection: { withProductBasic },
  } = API['variants']()
  const variantIds = items.data?.data.map((item) => item.variantId || '') || []
  const variants = useMany<IVariant>({
    resource: variantResource,
    ids: variantIds,
    meta: {
      query: {
        projection: withProductBasic,
      },
    },
    queryOptions: {
      enabled: variantIds.length > 0,
    },
  })

  return {
    inventory: queryResult,
    items: { ...items, queryKey: itemsQueryKey },
    variants,
  }
}
