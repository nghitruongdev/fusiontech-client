/** @format */

import { useBoolean } from '@chakra-ui/react'
import { Edit } from 'lucide-react'
import { useAuthUser } from '@/hooks/useAuth/useAuthUser'
import { useCustom, useUpdate } from '@refinedev/core'
import { API } from 'types/constants'
import { API_URL } from 'types/constants'
import { useForm } from 'react-hook-form'
import useMyToast from '@/hooks/useToast'
import { useHeaders } from '@/hooks/useHeaders'
import { ShippingAddress } from 'types'

export const AddressPanel = () => {
  const [isShow, { toggle }] = useBoolean()
  const isDefaultExists = true
  return (
    <div className={`min-w-[230px]`}>
      <div className={`flex justify-between items-center mb-2`}>
        <h2 className='text-xl font-bold'>Địa chỉ mặc định</h2>
        {isDefaultExists && (
          <Edit
            className='w-5 h-5 text-gray-400 cursor-pointer'
            onClick={toggle}
          />
        )}
      </div>
      <AddressContent showModal={isShow} />
    </div>
  )
}

const AddressContent = ({ showModal }: { showModal: boolean }) => {
  const { getAuthHeader, _isHydrated, authHeader } = useHeaders()
  const { userProfile, claims } = useAuthUser()
  console.log('claims?.id', claims)
  const { defaultAddressByUserId } = API['shippingAddresses']()
  const { data } = useCustom<ShippingAddress>({
    url: `${defaultAddressByUserId(claims?.id ?? userProfile?.id)}`,
    method: 'get',
    config: {
      headers: {
        ...authHeader,
      },
    },
    queryOptions: {
      enabled: !!authHeader && (!!claims?.id || !!userProfile?.id),
    },
  })
  console.log('getAuthHeader()', getAuthHeader())
  const { register, getValues } = useForm()

  const toast = useMyToast()
  const createShippingAddress = async (
    uid: number,
    shippingAddressData: Object,
  ) => {
    try {
      toast
        .ok({
          title: 'Thành công',
          message: 'Thêm địa chỉ nhận hàng thành công',
        })
        .fire()
    } catch (error) {
      console.log('Lỗi khi thêm địa chỉ nhận hàng:', error)
      toast
        .fail({
          title: 'Thành công',
          message: 'Thêm địa chỉ nhận hàng thất bại',
        })
        .fire()
    }
  }

  const handleUpdateShippingAddress = (event: any) => {
    event.preventDefault()
    const shippingAddressData = {
      name: getValues('name'),
      phone: getValues('phone'),
      province: getValues('province'),
      district: getValues('district'),
      ward: getValues('ward'),
      address: getValues('address'),
    }
    createShippingAddress(claims?.id ?? 0, shippingAddressData)
    !showModal
  }

  if (!showModal) {
    return (
      <form className='mt-2'>
        <div className='mb-4 '>
          <label
            htmlFor='fullName'
            className='block mb-1 text-sm '>
            Tỉnh/Thành phố
          </label>
          <input
            type='text'
            id='province'
            value={data?.data.province}
            readOnly
            className='w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2'
          />
        </div>
        <div className='mb-4'>
          <label
            htmlFor='fullName'
            className='block mb-1 text-sm '>
            Quận/Huyện
          </label>
          <input
            type='text'
            id='district'
            value={data?.data.district}
            readOnly
            className='w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2'
          />
        </div>
        <div className='mb-4'>
          <label
            htmlFor='fullName'
            className='block mb-1 text-sm '>
            Phường xã
          </label>
          <input
            type='text'
            id='ward'
            value={data?.data.ward}
            readOnly
            className='w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2'
            // {...register('Full name', { required: true })}
          />
        </div>
        <div className='mb-4'>
          <label
            htmlFor='fullName'
            className='block mb-1 text-sm '>
            Địa chỉ cụ thể
          </label>
          <input
            type='text'
            id='address'
            value={data?.data.address}
            readOnly
            className='w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2'
            // {...register('Full name', { required: true })}
          />
        </div>
      </form>
    )
  } else
    return (
      <>
        <div className='fixed inset-0 flex items-center justify-center  bg-black bg-opacity-50 z-50'>
          <form className='flex flex-col w-1/3 p-4 bg-white rounded-lg '>
            <h2 className='text-xl font-bold mb-4'>
              Thông tin người nhận hàng
            </h2>
            <div className='mb-4 '>
              <label
                htmlFor='fullName'
                className='block mb-1 text-sm '>
                Họ và tên
              </label>
              <input
                type='text'
                id='name'
                className='w-full  border border-gray-300 rounded-md px-3 py-2'
                {...register('name', { required: true })}
              />
            </div>
            <div className='mb-4 '>
              <label
                htmlFor='phone'
                className='block mb-1 text-sm '>
                Số điện thoại
              </label>
              <input
                type='text'
                id='phone'
                className='w-full  border border-gray-300 rounded-md px-3 py-2'
                {...register('phone', { required: true })}
              />
            </div>
            <h2 className='text-xl font-bold mb-4'>Địa chỉ nhận hàng</h2>
            <div className='flex space-x-2'>
              <div className='mb-4 '>
                <label
                  htmlFor='province'
                  className='block mb-1 text-sm '>
                  Tỉnh/Thành phố
                </label>
                <input
                  type='text'
                  id='province'
                  className='w-full  border border-gray-300 rounded-md px-3 py-2'
                  {...register('province', { required: true })}
                />
              </div>
              <div className='mb-4 '>
                <label
                  htmlFor='district'
                  className='block mb-1 text-sm '>
                  Quận/Huyện
                </label>
                <input
                  type='text'
                  id='district'
                  className='w-full  border border-gray-300 rounded-md px-3 py-2'
                  {...register('district', { required: true })}
                />
              </div>
            </div>
            <div className='flex space-x-2'>
              <div className='mb-4 '>
                <label
                  htmlFor='ward'
                  className='block mb-1 text-sm '>
                  Phường/Xã
                </label>
                <input
                  type='text'
                  id='ward'
                  className='w-full  border border-gray-300 rounded-md px-3 py-2'
                  {...register('ward', { required: true })}
                />
              </div>
              <div className='mb-4 '>
                <label
                  htmlFor='address'
                  className='block mb-1 text-sm '>
                  Địa chỉ cụ thể
                </label>
                <input
                  type='text'
                  id='address'
                  className='w-full  border border-gray-300 rounded-md px-3 py-2'
                  {...register('address', { required: true })}
                />
              </div>
            </div>
            <div className='flex space-x-2 justify-end mt-4'>
              <button
                className='bg-blue-500 text-white px-4 py-2 rounded-md'
                type='submit'
                // onClick={(!showModal)
              >
                Hủy bỏ
              </button>
              <button
                className='bg-blue-500 text-white px-4 py-2 rounded-md'
                type='submit'
                onClick={handleUpdateShippingAddress}>
                Lưu địa chỉ
              </button>
            </div>
          </form>
        </div>
      </>
    )
}
