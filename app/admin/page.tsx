/** @format */

'use client'

import UserWidget from '@components/statistical/widget/user'
import OrderWidget from '@components/statistical/widget/order'

import RevenueWidget from '@components/statistical/widget/revenue'
import RevenueDayWidget from '@components/statistical/widget/revenueDay'

import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from 'recharts'
import React from 'react'

const AdminDashboard = () => {
  const viewData = [
    { name: 'January', views: 30 },
    { name: 'February', views: 78 },
    { name: 'March', views: 56 },
    { name: 'April', views: 34 },
    { name: 'May', views: 100 },
    { name: 'June', views: 45 },
    { name: 'July', views: 13 },
  ]
  const data = [
    {
      name: 'Iphone 14',
      uv: 590,
      pv: 800,
      amt: 1400,
    },
    {
      name: 'Laptop MSI',
      uv: 868,
      pv: 967,
      amt: 1506,
    },
    {
      name: 'Macbook',
      uv: 1397,
      pv: 1098,
      amt: 989,
    },
    {
      name: 'Ipad',
      uv: 1480,
      pv: 1200,
      amt: 1228,
    },
    {
      name: 'Tai nghe',
      uv: 1520,
      pv: 1108,
      amt: 1100,
    },
    {
      name: 'Ram',
      uv: 1400,
      pv: 680,
      amt: 1700,
    },
  ]

  // const {
  //   getSellingProducts,
  //   resource: productResource,
  //   projection: { full },
  // } = API.products()

  // const { getAuthHeader } = useHeaders()

  // const startDate = new Date('2022-08-30')
  // const endDate = new Date('2024-08-30')

  // // Lấy dữ liệu bán hàng sản phẩm
  // const { data: { data: sellingProduct } = {} } = useCustom<
  //   { id: number; sold: number }[]
  // >({
  //   url: `${getSellingProducts(startDate, endDate)}`,
  //   method: 'get',
  //   meta: { productResource },
  //   config: {
  //     headers: {
  //       ...getAuthHeader(),
  //     },
  //   },
  // })

  // const productRecord: Record<number, { id: number; sold: number }> = {}
  // sellingProduct?.forEach((item) => {
  //   productRecord[item.id] = { id: item.id, sold: item.sold }
  // })
  // const idss = Object.keys(productRecord)

  // // Lấy thông tin các sản phẩm dựa trên các ID đã lấy từ sellingProduct
  // const { data: { data: products = [] } = {}, isFetching } = useMany<IProduct>({
  //   resource: 'products',
  //   ids: idss,
  //   meta: {
  //     query: {
  //       projection: full,
  //     },
  //     headers: {
  //       ...getAuthHeader(),
  //     },
  //   },
  //   queryOptions: {
  //     enabled: !!idss.length,
  //   },
  // })

  // // Chuyển đổi dữ liệu để phù hợp với ComposedChart
  // const composedChartData = products.map((product) => {
  //   // const soldInfo = productRecord[product.id]
  //   return {
  //     name: product.name, // Tên sản phẩm
  //     // uv: soldInfo ? soldInfo.sold : 0, // Số lượt bán
  //     pv: product.maxPrice, // Giá sản phẩm (hoặc một thuộc tính khác nếu muốn)
  //     amt: product.minPrice, // Số lượng tồn kho (hoặc một thuộc tính khác nếu muốn)
  //   }
  // })
  return (
    <div className='w-full'>
      <div className='grid grid-cols-4 mb-4'>
        <UserWidget />
        <OrderWidget />
        <RevenueWidget />
        <RevenueDayWidget />
      </div>
      <div className='flex space-x-4'>
        {/* Product Sold Chart */}

        <div className='bg-white p-2 w-1/2 rounded-md'>
          <ResponsiveContainer>
            <ComposedChart
              width={500}
              height={400}
              data={data}>
              <CartesianGrid stroke='#f5f5f5' />
              <XAxis
                dataKey='name'
                scale='band'
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type='monotone'
                dataKey='amt'
                fill='#8884d8'
                stroke='#8884d8'
              />
              <Bar
                dataKey='pv'
                barSize={20}
                fill='#2563EB'
              />
              <Line
                type='monotone'
                dataKey='uv'
                stroke='#ff7300'
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className='w-1/2 bg-white p-4'>
          <LineChart
            width={500}
            height={400}
            data={viewData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type='monotone'
              dataKey='views'
              stroke='#2563EB'
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
