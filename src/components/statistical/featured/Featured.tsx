/** @format */

'use client'
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

export default function StaticPage() {
  const [doanhThuData, setDoanhThuData] = useState<DoanhThuResult[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const { bestCustomer, resource } = API.statistical()

  const { data: { data } = {} } = useCustom<
    { id: number; totalOrder: number }[]
  >({
    url: bestCustomer(),
    method: 'get',
    meta: { resource },
  })

  const record = toRecord(data ?? [], 'id')

  const ids = Object.keys(record)
  const drop = useMany<IUser>({
    resource: 'users',
    ids: ids,
    queryOptions: {
      enabled: !!ids.length,
    },
  })
  const { data: { data: users = [] } = {}, isFetching } = drop

  useEffect(() => {
    fetch('http://100.82.6.136:8080/api/statistical/revenue')
      .then((response) => response.json())
      .then((doanhThuData) => {
        setDoanhThuData(doanhThuData)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!doanhThuData || doanhThuData.length === 0) {
    return <div>Invalid data</div>
  }

  return (
    <div>
      <Tabs
        variant='soft-rounded'
        colorScheme='blue'>
        <TabList mt={10}>
          <Tab>Doanh thu theo năm</Tab>
          <Tab>Người dùng mua hàng nhiều nhất</Tab>
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
                      {!!user.id && (
                        <Td>
                          {record[user.id as keyof typeof record]?.totalOrder}
                        </Td>
                      )}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
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
