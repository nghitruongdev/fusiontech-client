/** @format */

import { IUser, ShippingAddress } from 'types'
import {
  Checkbox,
  FormLabel,
  Input,
  Spinner,
  Stack,
  UseRadioProps,
  chakra,
  useRadio,
  useRadioGroup,
} from '@chakra-ui/react'
import ChakraFormInput from '@components/ui/ChakraFormInput'
import LoadingOverlay from '@components/ui/LoadingOverlay'
import { Building, HomeIcon, Icon } from 'lucide-react'
import { UseFormRegister, FieldErrors, RegisterOptions } from 'react-hook-form'
import { UseModalFormReturnType } from '@refinedev/react-hook-form'
import { HttpError } from '@refinedev/core'
import { createContext, useContext, useEffect, useMemo } from 'react'
import { Badge } from '@components/ui/shadcn/badge'
import { cn } from 'components/lib/utils'
import { SaveButton } from '@components/buttons'
import { validatePhoneNumber } from '@/lib/validate'
import { useAuthUser } from '@/hooks/useAuth/useAuthUser'

type State = {} & UseModalFormReturnType<
  ShippingAddress,
  HttpError,
  ShippingAddress
>

const validate: {
  [key in keyof ShippingAddress]: RegisterOptions | undefined
} = {
  id: undefined,
  name: {
    required: 'Vui lòng nhập tên người nhận',
    setValueAs: (value) => value?.trim(),
  },
  phone: {
    required: 'Vui lòng nhập số điện thoại',
    validate: (phone) =>
      validatePhoneNumber(phone ?? '') || 'Số điện thoại không hợp lệ',
    setValueAs: (value) => value?.trim(),
  },
  address: undefined,
  ward: undefined,
  district: undefined,
  province: undefined,
}

const Context = createContext<State | null>(null)

const useContextProvider = () => {
  const ctx = useContext(Context)
  if (!ctx) throw new Error('Address Context is missing')
  return ctx
}
export const AddressFormProvider = ({ ...props }: State) => {
  const {
    saveButtonProps,
    modal: { visible, close },
    register,
    formState: { errors },
    handleSubmit,
    reset,
    refineCore: { formLoading, onFinish },
    setValue,
  } = props

  const { userProfile: user } = useAuthUser()
  useEffect(() => {
    if (!user) {
      return
    }
    reset({
      user: user?._links?.self.href,
      name: user.fullName,
      phone: user?.phoneNumber,
    })
  }, [user, reset])

  return (
    <Context.Provider value={props}>
      <div className='relative'>
        {formLoading && <LoadingOverlay />}
        <Body />
        <div className='flex justify-end'>
          <SaveButton
            {...saveButtonProps}
            isLoading={formLoading}
          />
        </div>
      </div>
    </Context.Provider>
  )
}

const Body = function Body() {
  const {
    register,
    formState: { errors },
  } = useContextProvider()

  return (
    <>
      <ChakraFormInput
        label='Họ và tên'
        id='name'
        isInvalid={!!errors?.name}
        errorMessage={`${errors.name?.message}`}>
        <Input
          type='text'
          {...register('name', validate.name)}
        />
      </ChakraFormInput>
      <ChakraFormInput
        label='Số điện thoại'
        id='phone'
        isInvalid={!!errors?.phone}
        errorMessage={`${errors.phone?.message}`}>
        <Input
          type='tel'
          {...register('phone', validate.phone)}
        />
      </ChakraFormInput>
      <div className='grid grid-cols-3 gap-4'>
        <ChakraFormInput
          label='Tỉnh/ Thành phố'
          isInvalid={!!errors?.province}
          errorMessage={`${errors.province?.message}`}>
          <Input
            id='province'
            type='text'
            {...register('province', validate.province)}
          />
        </ChakraFormInput>
        <ChakraFormInput
          label='Quận/ Huyện'
          id='district'
          isInvalid={!!errors?.district}
          errorMessage={`${errors.district?.message}`}>
          <Input
            type='text'
            {...register('district', validate.district)}
          />
        </ChakraFormInput>
        <ChakraFormInput
          label='Xã/ Phường'
          id='ward'
          isInvalid={!!errors?.ward}
          errorMessage={`${errors.ward?.message}`}>
          <Input
            type='text'
            {...register('ward', validate.ward)}
          />
        </ChakraFormInput>
      </div>
      <ChakraFormInput
        label='Địa chỉ'
        id='address'
        isInvalid={!!errors?.address}
        errorMessage={`${errors.address?.message}`}>
        <Input
          type='text'
          {...register('address', validate.address)}
        />
      </ChakraFormInput>
      <ChakraFormInput
        display='flex'
        gap={2}
        alignItems={'center'}>
        <Checkbox {...register('default')} />
        <FormLabel m={0}>Đặt làm địa chỉ mặc định</FormLabel>
      </ChakraFormInput>
      <ChakraFormInput label='Loại địa chỉ'>
        <AddressType />
      </ChakraFormInput>
    </>
  )
}

type RadioProps = { label: string; icon: JSX.Element } & UseRadioProps
const AddressTypeRadio = function RadioType({
  label,
  icon,
  ...props
}: RadioProps) {
  const { state, getInputProps, getRadioProps, htmlProps, getLabelProps } =
    useRadio(props)
  return (
    <>
      <chakra.label
        {...htmlProps}
        cursor='pointer'>
        <input
          {...getInputProps({})}
          hidden
        />
        <p
          {...getRadioProps()}
          className={cn(
            'px-4 p-2 border-0 border-gray-300 rounded-md text-zinc-500 flex items-center gap-2 text-sm font-semibold',
            state.isChecked && `border border-sky-100 bg-sky-50 text-sky-600`,
          )}>
          {icon} {label}
        </p>
      </chakra.label>
    </>
  )
}

const AddressType = () => {
  const { setValue } = useContextProvider()
  const handleChange = (value: string) => {
    setValue(`type`, value as ShippingAddress['type'])
  }

  const { value, getRadioProps, getRootProps } = useRadioGroup({
    onChange: handleChange,
    defaultValue: 'Nhà riêng',
  })
  return (
    <div
      className='flex gap-4'
      {...getRootProps()}>
      {[
        { label: 'Nhà riêng', icon: <HomeIcon /> },
        { label: 'Văn phòng', icon: <Building /> },
      ].map((item) => (
        <AddressTypeRadio
          key={item.label}
          {...item}
          {...getRadioProps({ value: item.label })}
        />
      ))}
    </div>
  )
}
