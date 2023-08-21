/** @format */

'use client'
import React, { useState, useEffect } from 'react'
import { useAuthUser } from '@/hooks/useAuth/useAuthUser'
import { FaRegUserCircle, FaRegListAlt, FaSearchLocation } from 'react-icons/fa'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import RecentProductView from '@components/store/front/section/RecentProductView'
import AuthenticatedPage from 'app/(others)/authenticated'
import { Avatar, Image } from '@chakra-ui/react'
import { Button } from '@components/ui/shadcn/button'

const AccountLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthenticatedPage>
      <div className='bg-gray-100'>
        <div className='min-h-screen flex w-4/5 mx-auto max-w-7xl'>
          <div className=' w-1/4 p-4 '>
            <AccountMenu />
          </div>
          <div className='w-3/4  p-4'>{children}</div>
        </div>
        <div className='px-8'>
          <RecentProductView />
        </div>
      </div>
    </AuthenticatedPage>
  )
}
export default AccountLayout
// Lấy thông tin đường dẫn hiện tại

const AccountMenu = () => {
  const router = useRouter()
  const { user, userProfile } = useAuthUser()

  const username =
    user?.displayName ?? userProfile?.firstName ?? userProfile?.fullName
  const imageUrl = user?.photoURL ?? userProfile?.image ?? ''

  const [currentPath, setCurrentPath] = useState('')

  useEffect(() => {
    // Lấy đường dẫn URL hiện tại và cập nhật vào state
    setCurrentPath(window.location.pathname)
  }, [currentPath]) // useEffect sẽ chạy một lần khi component được render lần đầu tiên

  const handleMenuClick = (path: string) => {
    setCurrentPath(path)
  }
  console.log(currentPath)
  return (
    <div className='items-center'>
      <div className='flex items-center'>
        <div className='w-12 h-12 rounded-full overflow-hidden'>
          <Image
            src={imageUrl}
            alt='User'
            className='w-full h-full object-cover'
          />
          <Avatar
            src={imageUrl}
            name={username}
          />
        </div>
        <div className='flex-col items-start ml-2'>
          <h4>Tài khoản của:</h4>
          <h3 className='text-md font-semibold'>{username}</h3>
        </div>
      </div>
      <div className=''>
        <ul className='mt-3 space-y-3 '>
          <Link
            href={{
              pathname: '/account/profile',
            }}
            className=''>
            <li
              className={`flex items-center mt-2 hover:bg-gray-200 hover:text-blue-600 hover:font-semibold hover:rounded-lg ${
                currentPath === '/account/profile'
                  ? 'text-blue-600 font-semibold'
                  : ''
              }`}
              onClick={() => handleMenuClick('/account/profile')}>
              <FaRegUserCircle className='text-gray-400' />
              <button className='ml-2'>Thông tin tài khoản</button>
            </li>
          </Link>
          <Link
            href={{
              pathname: '/account/orders',
            }}
            className=''>
            <li
              className={`flex items-center mt-2 hover:bg-gray-200 hover:text-blue-700 hover:font-semibold hover:rounded-lg ${
                currentPath === '/account/orders'
                  ? 'text-blue-700 font-semibold'
                  : ''
              }`}
              onClick={() => handleMenuClick('/account/orders')}>
              <FaRegListAlt className='text-gray-400' />
              <button className='ml-2'>Quản lý đơn hàng</button>
            </li>
          </Link>
          <Link
            href={{
              pathname: '/account/favorites',
            }}
            className=''>
            <li
              className={`flex items-center mt-2 hover:bg-gray-200 hover:text-blue-700 hover:font-semibold hover:rounded-lg ${
                currentPath === '/account/favorites'
                  ? 'text-blue-700 font-semibold'
                  : ''
              }`}
              onClick={() => handleMenuClick('/account/favorites')}>
              <FaSearchLocation className='text-gray-400' />
              <button className='ml-2'>Sản phẩm yêu thích</button>
            </li>
          </Link>

          {/* <li className="flex items-center hover:bg-gray-200 hover:text-blue-700 hover:font-semibold hover:rounded-lg">
            <FaRegBell className="text-gray-400" />
            <button className="ml-2">Thông báo</button>
          </li>
          <li className="flex items-center hover:bg-gray-200 hover:text-blue-700 hover:font-semibold hover:rounded-lg">
            <FaRegEnvelope className="text-gray-400" />
            <button className="ml-2">Bản tin</button>
          </li> */}
        </ul>
      </div>
    </div>
  )
}
