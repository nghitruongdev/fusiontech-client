/** @format */
'use client'
import { useEffect, useState } from 'react'

import { Box, Link, Text, Tooltip, Icon } from '@chakra-ui/react'
import { API } from 'types/constants'
import { useCustom } from '@refinedev/core'
import { FiUsers } from 'react-icons/fi'
import { User } from 'lucide-react'

const UserWidget = () => {
  const { countUser, resource } = API.users()

  const { data: { data } = {} } = useCustom({
    url: countUser(),
    method: 'get',
    meta: { resource },
  })
  const usersCount = (data as unknown as number) ?? 0
  return (
    <div className='p-2 shadow-md rounded-lg bg-white w-[280px] '>
      <Text className='font-bold text-slate-500 text-base uppercase'>
        Người dùng
      </Text>

      <Text className='font-semibold text-green-600 text-xl my-1'>
        {usersCount}
      </Text>

      <div className='flex justify-between items-center '>
        <Text
          fontSize='12px'
          color='gray.600'
          className='mt-2 underline underline-offset-2'>
          Xem tất cả người dùng
        </Text>
        <User
          size={22}
          className='text-blue-800  bg-blue-300 rounded-lg p-1'
        />
      </div>
    </div>
  )
}

export default UserWidget
