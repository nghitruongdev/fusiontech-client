/** @format */

import { ShippingAddress } from 'types'
import { Flex, useBoolean, Radio, Spinner } from '@chakra-ui/react'
import MenuOptions, { MenuItem } from '@components/ui/MenuOptions'
import { BaseKey, useCustomMutation, useNotification } from '@refinedev/core'
import { Check, LoaderIcon, Plus } from 'lucide-react'
import { BsChatSquareQuote } from 'react-icons/bs'
import { RiFileShredLine, RiShutDownLine } from 'react-icons/ri'
import { useAddressContextProvider } from './AddressSection'
import { useAuthUser } from '@/hooks/useAuth/useAuthUser'
import { API } from 'types/constants'
import useCrudNotification from '@/hooks/useCrudNotification'
import { useCheckoutContext } from '../../CheckoutProvider'
import { cn } from 'components/lib/utils'

const hoverBorderColor = 'hover:border-blue-700'

const AddressBox = ({
  address: { id, name, address, ward, district, province, phone },
  onClick,
  showCheck,
  className,
}: {
  address: ShippingAddress
  showCheck?: boolean
  onClick?: () => void
  className?: string
}) => {
  const { defaultAddress: { id: defaultId } = {} } = useAddressContextProvider()
  const [hover, setHover] = useBoolean()
  const addressString = [address, ward, district, province]
    .filter((item) => item)
    .join(', ')
  const isDefault = !!defaultId && defaultId == id
  return (
    <div
      className={`group border ${hoverBorderColor} rounded-md bg-white flex items-center justify-start text-start leading-tight relative cursor-pointer h-[150px] shadow-lg hover:bg-blue-50 hover:text-blue-600 ${className}`}
      onMouseEnter={setHover.on}
      onMouseLeave={setHover.off}
      onClick={onClick}>
      <div className='m-4 leading-12'>
        <p className=''>
          <span className='font-semibold'>{name}</span>
        </p>
        {addressString && (
          <p className='text-sm'>
            <span className='underline'> Địa chỉ:</span>{' '}
            <span className='text-sm leading-none font-semibold'>
              {addressString}
            </span>
          </p>
        )}
        <p className='text-sm'>
          <span className='underline'>Số điện thoại:</span>{' '}
          <span className='font-semibold'>{phone}</span>
        </p>
      </div>

      {!isDefault && showCheck && (
        <div className='absolute top-0 right-0 rounded-full text-sm text-white bg-blue-600 transform scale-50 p-1 shadow-md border'>
          {/* {hover && <PencilIcon className="m-1 " />} */}

          <Check className='m-1' />
        </div>
      )}
      {isDefault && (
        <div className='text-end absolute -bottom-4 -right-2 rounded-full text-sm text-white bg-blue-600 hover:bg-blue-700 transform scale-75 p-1 shadow-lg border border-gray-50'>
          <p className='m-1 mx-2'>Địa chỉ mặc định</p>
        </div>
      )}
    </div>
  )
}

const LoadingAddressBox = () => {
  return (
    <div
      className={`group border ${hoverBorderColor} rounded-md bg-white flex items-center justify-center leading-tight relative cursor-pointer h-[150px] shadow-lg`}>
      <Spinner
        thickness='2px'
        speed='0.65s'
        emptyColor='gray.200'
        color='blue.600'
        size='xl'
      />
    </div>
  )
}
const EmptyAddressBox = () => {
  //   const { addressError } = useCheckoutContext(
  //     ({
  //       formState: {
  //         errors: { addressId },
  //       },
  //     }) => ({ addressError: addressId }),
  //   )
  const {
    formState: { errors },
  } = useCheckoutContext()

  return (
    <div
      className={cn(
        `border text-sm shadow-md border-gray-300 min-h-[150px] bg-gray-50 p-4 rounded-md text-gray-400 flex justify-center items-center cursor-pointer hover:text-blue-600 hover:bg-blue-50 ${hoverBorderColor}`,
        errors.addressId?.message && `border-red-500`,
      )}>
      <Plus />
      Thêm mới địa chỉ
    </div>
  )
}

const AddressRadioBox = ({ address }: { address: ShippingAddress }) => {
  const { defaultAddress: defaultApi } = API['users']()
  const {
    refetch: { defaultAddress: refetchDefault, addressList: refetchList },
    defaultAddress,
    selectedAddress: { id: selectedId } = {},
    editModalProps: {
      modal: { show: showEditModal },
    },
  } = useAddressContextProvider()
  const { userProfile: { id: userId } = {} } = useAuthUser()

  const { mutate } = useCustomMutation()
  const {
    onError,
    onSuccess,
    action: { open },
  } = useCrudNotification()

  const isDefault = !!defaultAddress?.id && defaultAddress.id == address.id
  const isSelected = !!selectedId && selectedId == address.id

  const updateDefaultAddress = async (addressId: number) => {
    if (!userId) return console.error('userId not found')

    const url = `${defaultApi.update(`${userId}`, addressId)}`

    mutate(
      {
        url,
        method: 'patch',
        values: { addressId },
        errorNotification: onError,
        successNotification: onSuccess,
      },
      {
        async onSuccess(data, variables, context) {
          refetchDefault()
        },
      },
    )
  }

  const deleteAddress = async (address: ShippingAddress) => {
    if (!!address.default) {
      open?.({
        type: 'error',
        message: 'Không thể xoá địa chỉ mặc định',
      })
    }
    mutate(
      {
        url: address._links?.self.href ?? '',
        method: 'delete',
        values: {},
        successNotification: onSuccess,
        errorNotification: onError,
      },
      {
        onSuccess(data, variables, context) {
          refetchList()
        },
      },
    )
  }
  const value = address.id ?? ''

  const items: MenuItem[] = [
    {
      text: 'Chỉnh sửa',
      rightIcon: <BsChatSquareQuote />,
      onClick: showEditModal.bind(this, address?.id),
      w: '150px',
    },
    {
      text: 'Đặt mặc định',
      rightIcon: <RiFileShredLine />,
      onClick: updateDefaultAddress.bind(this, +value),
      w: '150px',
      display: `${isDefault && 'none'}`,
    },
    {
      text: 'Xoá địa chỉ',
      rightIcon: <RiShutDownLine />,
      colorScheme: 'red',
      onClick: deleteAddress.bind(this, address),
      w: '150px',
      isDisabled: isDefault,
    },
  ]

  return (
    <div className='flex items-center my-4'>
      <Flex
        as='label'
        flexGrow='1'
        gap='2'>
        <Radio value={value} />
        <AddressBox
          address={address}
          className={`flex-1 text-center ${
            isSelected ? 'border-blue-600' : ''
          }`}
        />
      </Flex>

      <div className='mx-4'>
        <MenuOptions items={items} />
      </div>
    </div>
  )
}

export { AddressBox, EmptyAddressBox, LoadingAddressBox, AddressRadioBox }
