/** @format */

'use client'
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
import React, { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

export interface SanPhamBanChayResult {
  saleYear: number
  productId: number
  productName: String
  totalQuantitySold: number
  totalRevenue: number
}

export interface DoanhThuResult {
  saleYear: number
  totalSales: number
  totalRevenue: number
  averagePrice: number
}
export default function StaticPage() {
  const [doanhThuData, setDoanhThuData] = useState<DoanhThuResult[]>([])
  const [banChayData, setBanChayData] = useState<SanPhamBanChayResult[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('http://100.82.6.136:8080/api/statistical/best-seller')
      .then((response) => response.json())
      .then((banChayData) => {
        setBanChayData(banChayData)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
        setIsLoading(false)
      })
  }, [])

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
        <TabList>
          <Tab>Sản phẩm bán chạy</Tab>
          <Tab>Doanh thu theo năm</Tab>
          <Tab>Doanh thu theo năm</Tab>
          <Tab>Doanh thu theo năm</Tab>
        </TabList>
        <TabPanels>
          {/* doanh thu theo nam */}
          <TabPanel>
            {banChayData.map((item) => (
              <MostSaleProducts
                key={uuidv4()}
                {...item}
              />
            ))}
          </TabPanel>
          <TabPanel>
            {doanhThuData.map((item) => (
              <Revenue
                key={uuidv4()}
                {...item}
              />
            ))}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  )
}

const Revenue = (props: DoanhThuResult) => {
  return (
    <TableContainer>
      <Table size='sm'>
        <Thead>
          <Tr>
            <Th>Năm</Th>
            <Th>Đã bán được</Th>
            <Th>Tổng doanh thu</Th>
            <Th>Giá trung bình</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>{props.saleYear}</Td>
            <Td>{props.totalSales}</Td>
            <Td>{props.totalRevenue}</Td>
            <Td>{props.averagePrice}</Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  )
}
const MostSaleProducts = (props: SanPhamBanChayResult) => {
  return (
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            <Th>Năm</Th>
            <Th>Mã sản phẩm</Th>
            <Th>Tên sản phẩm</Th>
            <Th>Số lượng bán được</Th>
            <Th>Tổng doanh thu</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>{props.saleYear}</Td>
            <Td>{props.productId}</Td>
            <Td>{props.productName}</Td>
            <Td>{props.totalQuantitySold}</Td>
            <Td>{props.totalRevenue}</Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  )
}
