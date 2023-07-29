import { API, API_URL } from 'types/constants'
import { IUser, ShippingAddress } from 'types'
import {
  useCustomMutation,
  useNotification,
  useOne,
  useCustom,
  UpdateResponse,
  CreateResponse,
} from '@refinedev/core'
import { UseFormHandleSubmit, UseFormReset } from 'react-hook-form'

type Props = {
  userId: string
}

const defaultAddressValue = (): ShippingAddress => {
  return {
    id: '',
    name: '',
    phone: '',
    address: '',
    ward: '',
    district: '',
    province: '',
  }
}

export type CreateAddressProps = {
  handleSubmit: UseFormHandleSubmit<ShippingAddress, undefined>
  onFinish: (
    data: ShippingAddress,
  ) => Promise<
    void | UpdateResponse<ShippingAddress> | CreateResponse<ShippingAddress>
  >
  reset: UseFormReset<ShippingAddress>
  closeModal: () => void
}

export type EditAddressProps = CreateAddressProps

export default function useCheckout({ userId }: Props) {
  const { mutate } = useCustomMutation()
  const { open, close } = useNotification()
  const { resource, findAllByUserId, defaultAddressByUserId } =
    API['shippingAddresses']()
  const { resource: userResource, defaultAddress } = API['users']()
  const { data: userData } = useOne({
    resource: userResource,
    id: userId,
    errorNotification(error, values, resource) {
      return {
        type: 'error',
        message: `Error getting user info`,
        description: `${error?.statusCode} - ${error?.message}`,
      }
    },
  })

  const {
    data: addressListData,
    isLoading,
    isFetching,
    refetch: refetchAddressList,
  } = useCustom({
    url: `${API_URL}/${findAllByUserId}`,
    method: 'get',
    config: {
      query: {
        uid: userId,
      },
    },
    queryOptions: {
      retry: 3,
      // enabled: false,
    },
    meta: {
      // _embeddedResource: addressAPI.name,
      resource,
    },
    errorNotification(error, values) {
      return {
        type: 'error',
        message: "Error retrieving user's shipping address list",
        description: `${error?.statusCode} - ${error?.message}`,
      }
    },
  })

  const { data: addressData, refetch: refetchDefaultAddress } = useCustom({
    url: `${API_URL}/${defaultAddressByUserId}`,
    method: 'get',
    config: {
      query: {
        uid: userId,
      },
    },
    queryOptions: {
      retry: 3,
    },
    errorNotification(error, values, resource) {
      return {
        type: 'error',
        message: 'Error finding the default address',
        description: `${error?.statusCode} - ${error?.message}`,
      }
    },
  })

  const updateDefaultAddress = async (addressId: number) => {
    if (!!!addressId) {
      open?.({
        type: 'error',
        message: '404 - Không tìm thấy địa chỉ mặc định',
      })
      return
    }
    if (!!!userId) {
      open?.({
        type: 'error',
        message: '404 - Không tìm thấy người dùng',
      })
      return
    }

    const url = `${API_URL}/${defaultAddress.update(userId, addressId)}`
    mutate(
      {
        url,
        method: 'patch',
        values: { addressId },
      },
      {
        async onSuccess(data, variables, context) {
          setTimeout(
            () =>
              open?.({
                type: 'success',
                message: 'Cập nhật địa chỉ mặc định thành công',
              }),
            1000,
          )
          setTimeout(refetchDefaultAddress, 0)
        },
      },
    )
  }

  const createAddress = ({
    handleSubmit,
    onFinish,
    reset,
    closeModal,
  }: CreateAddressProps) => {
    handleSubmit(async (data) => {
      if (data.user === undefined) {
        open?.({
          type: 'error',
          message: 'Không tìm thấy người dùng đăng nhập',
          description: 'Vui lòng kiểm tra lại hệ thống',
        })
        return
      }
      const response = await onFinish(data)
      if (!!response) {
        reset(defaultAddressValue)
        closeModal()
      }
    })()
  }

  const editAddress = ({
    handleSubmit,
    onFinish,
    reset,
    closeModal,
  }: EditAddressProps) => {
    handleSubmit(async (data) => {
      if (data.user === undefined) {
        open?.({
          type: 'error',
          message: 'Không tìm thấy người dùng đăng nhập',
          description: 'Vui lòng kiểm tra lại hệ thống',
        })
        return
      }
      const response = await onFinish(data)
      if (!!response) {
        console.log('response', response)
        reset(defaultAddressValue)
        closeModal()
      }
    })()
  }

  const deleteAddress = async (address: ShippingAddress) => {
    if (!!address.default) {
      open?.({
        type: 'error',
        message: 'Cannot delete default address',
      })
    }
    mutate(
      {
        url: address._links?.self.href ?? '',
        method: 'delete',
        values: {},
        successNotification: {
          message: `Shipping address has been successfully deleted`,
          description: 'Success with no errors',
          type: 'success',
        },
        errorNotification(error, values, resource) {
          return {
            message: `Delete address failed`,
            description: `${error?.statusCode} - ${error?.message}`,
            type: 'error',
          }
        },
      },
      {
        onSuccess(data, variables, context) {
          setTimeout(refetchAddressList, 500)
        },
      },
    )
  }

  return {
    user: {
      data: userData?.data as IUser,
    },
    addressList: {
      data: addressListData?.data as ShippingAddress[],
      refetch: refetchAddressList,
    },
    defaultAddress: {
      data: addressData?.data as ShippingAddress,
      update: updateDefaultAddress,
    },
    address: {
      createAddress,
      editAddress,
      deleteAddress,
    },
  }
}
