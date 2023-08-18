/** @format */

'use client'
import { useHeaders } from '@/hooks/useHeaders'
import { formatPrice, toRecord } from '@/lib/utils'
import {
  HStack,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Skeleton,
  Table,
  Tr,
  Container,
  Box,
  Heading,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
} from '@chakra-ui/react'
import { useCustom, useMany } from '@refinedev/core'
import React, { useState, useEffect } from 'react'
import { IUser } from 'types'
import { API } from 'types/constants'
import { v4 as uuidv4 } from 'uuid'

export interface DoanhThuResult {
  saleYear: number
  totalSales: number
  totalRevenue: number
  averagePrice: number
}
export interface Inventory {
  variant_id: number
  quantity: number
}

export default function StaticPage() {
  const { getAuthHeader } = useHeaders()

  const { bestCustomer, resource, revenue } = API.statistical()

  const { data: { data } = {} } = useCustom<
    { id: number; totalOrder: number }[]
  >({
    url: bestCustomer(),
    method: 'get',
    meta: {
      resource,
    },
    config: {
      headers: {
        ...getAuthHeader(),
      },
    },
  })

  const { data: { data: doanhThuData = [] } = {} } = useCustom<
    DoanhThuResult[]
  >({
    url: revenue(),
    method: 'get',
  })

  const { data: { data: inventoryData = [] } = {} } = useCustom<Inventory[]>({
    url: 'statistical/inventories',
    method: 'get',
  })

  const record = toRecord(data ?? [], 'id')
  const ids = Object.keys(record)
  const { data: { data: users = [] } = {} } = useMany<IUser>({
    resource: 'users',
    ids: ids,
    queryOptions: {
      enabled: !!ids.length,
    },
  })
  const getTotalOrder = (userId: number) =>
    record[userId as unknown as keyof typeof record]?.totalOrder

  return (
    <div>
      <Tabs
        variant='soft-rounded'
        colorScheme='blue'>
        <TabList mt={10}>
          <Tab>Doanh thu theo năm</Tab>
          <Tab>Người dùng mua hàng nhiều nhất</Tab>
          <Tab>Kho hàng</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            {doanhThuData.map((item) => (
              <Revenue
                key={uuidv4()}
                {...item}
              />
            ))}
          </TabPanel>
          <TabPanel>
            <TableContainer>
              <Table>
                <Thead>
                  <Tr>
                    <Th>Tên</Th>
                    <Th>Email</Th>
                    <Th>Số điện thoại</Th>
                    <Th>Số đơn mua</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {users.map((user) => (
                    <Tr key={user.id}>
                      <Td>{user.fullName}</Td>
                      <Td>{user.email}</Td>
                      <Td>{user.phoneNumber}</Td>
                      {!!user.id && <Td>{getTotalOrder(user.id)}</Td>}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </TabPanel>
          <TabPanel>
            <Table className='w-full '>
              <Thead>
                <Tr>
                  <Th>Id</Th>
                  <Th>Số lượng</Th>
                </Tr>
              </Thead>
              <Tbody>
                {inventoryData.map((item) => (
                  <Inventory
                    key={uuidv4()}
                    {...item}
                  />
                ))}
              </Tbody>
            </Table>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  )
}

const Revenue = (props: DoanhThuResult) => {
  return (
    <Table className='w-full '>
      <Thead>
        <Tr>
          <Th>Năm</Th>
          <Th>Đã bán được</Th>
          <Th>Tổng doanh thu</Th>
          <Th>Giá trung bình mỗi sản phẩm</Th>
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          <Td>{props.saleYear}</Td>
          <Td>{props.totalSales}</Td>
          <Td>{formatPrice(props.totalRevenue)}</Td>
          <Td>{formatPrice(props.averagePrice)}</Td>
        </Tr>
      </Tbody>
    </Table>
  )
}

const Inventory = (props: Inventory) => {
  return (
    <Tr>
      <Td>{props.variant_id}</Td>
      <Td>{props.quantity}</Td>
    </Tr>
  )
}
