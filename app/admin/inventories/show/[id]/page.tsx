'use client'

// import { ChakraUIShowInferencer } from "@refinedev/inferencer/chakra-ui";
import {
  useShow,
  IResourceComponentsProps,
  useCustom,
  useMany,
} from '@refinedev/core'
import {
  Show,
  TextField,
  DateField,
  NumberField,
  EditButton,
  DeleteButton,
} from '@refinedev/chakra-ui'
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
import { useEffect, useState } from 'react'
import React from 'react'
import { useModalForm } from '@refinedev/react-hook-form'
import { EditDetailModalForm } from './EditModalForm'
import { useQueryClient } from '@tanstack/react-query'
export default function ShowPage() {
  // return <ChakraUIShowInferencer />;
  return <InventoryShow />
}

export const InventoryShow: React.FC<IResourceComponentsProps> = () => {
  const { inventory } = useData()
  const { data, isLoading, isError, isFetched } = inventory

  const isAdmin = true
  const record = data?.data

  return (
    <Show isLoading={isLoading} canDelete={isAdmin}>
      {isError && <>Not found record</>}
      {isFetched && !isError && (
        <>
          <Heading as="h5" size="sm" mt={4}>
            Created By
          </Heading>
          <TextField value={record?.createdBy} />
          <Heading as="h5" size="sm" mt={4}>
            Created Date
          </Heading>
          <DateField value={record?.createdDate} />
          <Heading as="h5" size="sm" mt={4}>
            Last Modified Date
          </Heading>
          <DateField value={record?.lastModifiedDate} />
          <Heading as="h5" size="sm" mt={4}>
            Id
          </Heading>
          <NumberField value={record?.id ?? ''} />
          <Heading as="h5" size="sm" mt={4}>
            Total Quantity
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
  const variants = variantData?.data || []
  const findVariant = (id: string) => variants.find((v) => v.id === +id)
  const [items, setItems] = useState(data?.data || [])
  const isEdit = true

  useEffect(() => {
    let array: IInventoryDetail[] = []
    if (!!data?.data) {
      array = data.data
    }
    if (!!variants.length) {
      array = array.map((item) => ({
        ...item,
        variant: findVariant(item.variantId || ''),
      }))
    }
    setItems(array)
  }, [variants, data?.data])
  const queryClient = useQueryClient()

  const editModalProps = useModalForm<IInventoryDetail>({
    refineCoreProps: {
      resource: 'inventory-details',
      action: 'edit',
      onMutationSuccess(data, variables, context) {
        queryClient.invalidateQueries(itemsQueryKey)
      },
    },
  })

  const {
    modal: { show: showEditModal },
  } = editModalProps
  return (
    <div className={className}>
      <Heading as="h5" size="sm" mt={4}>
        Bảng nhập kho
      </Heading>
      <TableContainer whiteSpace="pre-line">
        <Table size="md" variant="simple">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Mã Sản Phẩm</Th>
              <Th isNumeric>Số Lượng</Th>
              {isEdit && <Th>Actions</Th>}
            </Tr>
          </Thead>
          <Tbody>
            {items.map(({ id, quantity, variant }) => (
              <Tr key={id}>
                <Td>{id}</Td>
                <Td>{variant?.id || 'Loading....'}</Td>
                <Td isNumeric>{quantity}</Td>
                {isEdit && (
                  <Td display="flex" gap="2">
                    <EditButton
                      hideText
                      onClick={showEditModal.bind(null, id)}
                    />

                    <DeleteButton
                      hideText
                      resource="inventory-details"
                      recordItemId={id}
                    />
                  </Td>
                )}
              </Tr>
            ))}
          </Tbody>
          <TableCaption>Chi tiết quản lý kho</TableCaption>
        </Table>
      </TableContainer>
      <Portal>
        <EditDetailModalForm {...editModalProps} items={items} />
      </Portal>
    </div>
  )
}

const useData = () => {
  const { queryResult } = useShow<IInventory>()
  const record = queryResult.data?.data
  const itemsQueryKey = [record?._links?.items?.href]

  const items = useCustom<IInventoryDetail[]>({
    url: record?._links?.items?.href || '',
    method: 'get',
    meta: {
      _embeddedResource: 'inventoryDetails',
    },
    queryOptions: {
      enabled: !!record,
      keepPreviousData: true,
      queryKey: itemsQueryKey,
    },
  })

  const variantIds = items.data?.data.map((item) => item.variantId || '') || []
  const variants = useMany<IVariant>({
    resource: 'variants',
    ids: variantIds,
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
