/** @format */

'use client'
import { Portal, useDisclosure } from '@chakra-ui/react'
import { AddressBox, EmptyAddressBox } from './AddressBox'
import { ShippingAddress } from 'types'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { HttpError, useCustom, useCustomMutation } from '@refinedev/core'
import {
  UseModalFormReturnType,
  useModalForm,
} from '@refinedev/react-hook-form'
import { useAuthUser } from '@/hooks/useAuth/useAuthUser'
import { PropsWithChildren } from 'react'
import { API, API_URL } from 'types/constants'
import { Callback, checkIsCallback } from '@/lib/callback'
import { RefetchOptions, RefetchQueryFilters } from '@tanstack/react-query'
import useCrudNotification from '@/hooks/useCrudNotification'
import dynamic from 'next/dynamic'
import { useCheckoutContext } from '../../CheckoutProvider'
import { cn } from 'components/lib/utils'
import { useHeaders } from '@/hooks/useHeaders'

type RefetchFunction = (
  options?: RefetchOptions & RefetchQueryFilters<unknown>,
) => void
type ContextState = {
  refetch: {
    defaultAddress: RefetchFunction
    addressList: RefetchFunction
  }
  defaultAddress: ShippingAddress | undefined
  addressList: ShippingAddress[] | undefined
  editModalProps: UseModalFormReturnType<
    ShippingAddress,
    HttpError,
    ShippingAddress
  >
  createModalProps: ContextState['editModalProps']
  listModalProps: ReturnType<typeof useDisclosure>
  selectedAddress: ShippingAddress | undefined
  setSelectedAddress: (address: ContextState['selectedAddress']) => void
}
type ProviderProps = {}
const Context = createContext<ContextState | null>(null)

const useContextProvider = () => {
  const ctx = useContext(Context)
  if (!ctx) throw new Error('Address Context Provider is missing')
  return ctx
}

export const AddressSectionProvider = ({
  children,
  ...props
}: PropsWithChildren<ProviderProps>) => {
  const { resource, findAllByUserId, defaultAddressByUserId } =
    API['shippingAddresses']()
  const { resource: userResource } = API['users']()
  const { mutate } = useCustomMutation()
  const {
    onError,
    action: { open },
  } = useCrudNotification()
  const [selectedAddress, setSelectedAddress] = useState<ShippingAddress>()
  const { userProfile: user } = useAuthUser()
  const listModalProps = useDisclosure()

  //   const { setValue } = useCheckoutContext(({ setValue }) => ({ setValue }))
  const { setValue } = useCheckoutContext()
  const onAddressChange: Callback<Function> = useCallback(
    (value: number) => {
      setValue(`addressId`, value)
    },
    [setValue],
  )
  onAddressChange.isCallback = true

  const createProps = useModalForm<ShippingAddress, HttpError, ShippingAddress>(
    {
      refineCoreProps: {
        action: 'create',
        resource,
        onMutationSuccess(data, variables, context) {
          refetchAddressList()
        },
      },
      warnWhenUnsavedChanges: false,
    },
  )

  const editProps = useModalForm<ShippingAddress, HttpError, ShippingAddress>({
    refineCoreProps: {
      action: 'edit',
      resource,
      onMutationSuccess(data, variables, context) {
        refetchAddressList()
      },
    },
    warnWhenUnsavedChanges: false,
  })

  const { authHeader } = useHeaders()
  //find default address
  const {
    data: { data: defaultAddress } = {},
    refetch: refetchDefaultAddress,
  } = useCustom<ShippingAddress>({
    url: `${API_URL}/${defaultAddressByUserId(user?.id)}`,
    method: 'get',
    config: {
      headers: { ...authHeader },
    },
    queryOptions: {
      retry: 3,
      enabled: !!user?.id && !!authHeader,
    },
    errorNotification: false,
  })

  //find addressList by user
  const {
    data: { data: addressList } = {},
    isLoading,
    isFetching,
    refetch: refetchAddressList,
  } = useCustom<ShippingAddress[]>({
    url: `${API_URL}/${findAllByUserId(user?.id)}`,
    method: 'get',
    queryOptions: {
      retry: 3,
      enabled: !!user?.id && listModalProps.isOpen,
    },
    meta: {
      resource,
    },
    errorNotification: onError,
  })

  //update selected address with default
  useEffect(() => {
    if (!selectedAddress && defaultAddress) {
      setSelectedAddress(defaultAddress)
    }
  }, [selectedAddress, defaultAddress])

  //update address field checkout form
  useEffect(() => {
    selectedAddress?.id && onAddressChange(+selectedAddress.id)
  }, [selectedAddress, onAddressChange])

  const modalProps = () => {
    const checkUser = () => {
      if (!user) {
        open?.({
          type: 'error',
          message: 'Không tìm thấy người dùng đăng nhập',
          description: 'Vui lòng kiểm tra lại hệ thống',
        })
        return false
      }
      return true
    }

    const createButtonProps = () => {
      const {
        saveButtonProps,
        handleSubmit,
        refineCore: { onFinish },
        reset,
        modal: { close: closeModal },
      } = createProps

      const onClick = (event: any) => {
        handleSubmit(
          async ({ provinceOption, districtOption, wardOption, ...data }) => {
            if (!checkUser()) return
            const province = provinceOption?.value.name ?? ''
            const district = districtOption?.value.name ?? ''
            const ward = wardOption?.value.name ?? ''
            const response = await onFinish({
              ...data,
              province,
              district,
              ward,
              user: user?._links?.self.href,
            })
            if (!!response) {
              if (data.default || !addressList?.length) {
                refetchDefaultAddress()
              }
              setSelectedAddress(response.data)
              refetchAddressList()

              closeModal()
            }
          },
        )()
      }

      return {
        ...saveButtonProps,
        onClick,
      }
    }

    const editButtonProps = () => {
      const {
        saveButtonProps,
        handleSubmit,
        refineCore: { onFinish },
        reset,
        modal: { close },
      } = editProps

      const onClick = (event: any) => {
        const dirtyFields = editProps.formState.dirtyFields
        handleSubmit(
          async ({ wardOption, districtOption, provinceOption, ...data }) => {
            if (!checkUser()) return
            const province =
              dirtyFields.provinceOption && provinceOption?.value.name
            const district =
              dirtyFields.districtOption && districtOption?.value.name
            const ward = dirtyFields.wardOption && wardOption?.value.name
            const response = await onFinish({
              ...data,
              ...(province && { province }),
              ...(district && { district }),
              ...(ward && { ward }),
              user: user?._links?.self.href,
            })
            if (!!response) {
              console.log('response', response)
              if (dirtyFields.default) {
                refetchDefaultAddress()
              }
              close()
            }
          },
        )()
      }

      return {
        ...saveButtonProps,
        onClick,
      }
    }
    return {
      listModalProps,
      createModalProps: {
        ...createProps,
        saveButtonProps: createButtonProps(),
      },
      editModalProps: { ...editProps, saveButtonProps: editButtonProps() },
    }
  }

  return (
    <Context.Provider
      value={{
        ...props,
        ...modalProps(),
        selectedAddress,
        setSelectedAddress,
        refetch: {
          defaultAddress: refetchDefaultAddress,
          addressList: refetchAddressList,
        },
        defaultAddress,
        addressList,
      }}>
      {children}
    </Context.Provider>
  )
}

const DynamicListModal = dynamic(() => import('./(modal)/ListModal'))
const DynamicCreateModal = dynamic(() => import('./(modal)/CreateModal'), {})
const DynamicEditModal = dynamic(() => import('./(modal)/EditModal'), {})
const AddressSection = ({}: {}) => {
  const {
    editModalProps,
    createModalProps,
    listModalProps,
    selectedAddress,
    addressList,
  } = useContextProvider()

  const isListVisible = listModalProps.isOpen
  const isCreateVisible = createModalProps.modal.visible
  const isEditVisible = editModalProps.modal.visible

  return (
    <>
      {selectedAddress && (
        <AddressBox
          address={selectedAddress}
          onClick={listModalProps.onOpen}
          showCheck
          className={cn(`'border-blue-600 text-gray-700`)}
        />
      )}

      <div onClick={createModalProps.modal.show.bind(null, undefined)}>
        <EmptyAddressBox />
      </div>

      <Portal>
        {isListVisible && <DynamicListModal addressList={addressList} />}
        {isCreateVisible && <DynamicCreateModal {...createModalProps} />}
        {isEditVisible && <DynamicEditModal {...editModalProps} />}
      </Portal>
    </>
  )
}

export default AddressSection

export { useContextProvider as useAddressContextProvider }
