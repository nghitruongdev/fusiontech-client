/** @format */
'use client'

import { Box, Table } from '@chakra-ui/react'

import UserWidget from '@components/statistical/widget/user'
import OrderWidget from '@components/statistical/widget/order'

import RevenueWidget from '@components/statistical/widget/revenue'
import RevenueDayWidget from '@components/statistical/widget/revenueDay'
import StaticPage from '@components/statistical/featured/Featured'

const Home = () => {
  return (
    <div className='w-full '>
      <div className=''>
        <div className='grid grid-cols-4 '>
          <UserWidget />
          <OrderWidget />
          <RevenueWidget />
          <RevenueDayWidget />
        </div>
        <div className='mt-8 bg-white rounded-3xl'>
          <StaticPage />
        </div>
        {/* <div className='listContainer shadow-md p-20 m-20'>
          <div className='listTitle font-semibold text-gray-500 mb-15'>
            Latest Transactions
          </div>
          <Table />
        </div> */}
      </div>
    </div>
  )
}

export default Home
