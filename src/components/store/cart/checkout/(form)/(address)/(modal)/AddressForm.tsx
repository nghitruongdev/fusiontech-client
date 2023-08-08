/** @format */

import { IAddress, IUser, ShippingAddress } from 'types'
import {
  Checkbox,
  FormControl,
  FormErrorIcon,
  FormErrorMessage,
  FormLabel,
  Input,
  Spinner,
  Stack,
  UseRadioProps,
  chakra,
  useBoolean,
  useRadio,
  useRadioGroup,
} from '@chakra-ui/react'
import ChakraFormInput from '@components/ui/ChakraFormInput'
import LoadingOverlay from '@components/ui/LoadingOverlay'
import { Building, HomeIcon, Icon } from 'lucide-react'
import {
  UseFormRegister,
  FieldErrors,
  RegisterOptions,
  Controller,
} from 'react-hook-form'
import { UseModalFormReturnType } from '@refinedev/react-hook-form'
import { HttpError, useCustom } from '@refinedev/core'
import {
  cache,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Badge } from '@components/ui/shadcn/badge'
import { cn } from 'components/lib/utils'
import { SaveButton } from '@components/buttons'
import { validatePhoneNumber } from '@/lib/validate'
import { useAuthUser } from '@/hooks/useAuth/useAuthUser'
import AsyncSelect from 'react-select/async'
import { API, NEXT_API_URL } from 'types/constants'
import { toObjectOption } from '@/lib/utils'
import Select from 'react-select'

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
      <div className='grid gap-2'>
        <ProvinceSelect />
        <DistrictSelect />
        <WardSelect />
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

const {
  provinces: provincesApi,
  districts: districtsApi,
  wards: wardsApi,
} = API['address']

const ProvinceSelect = () => {
  const {
    register,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useContextProvider()
  const { data: { data: provinces } = {} } = useCustom<IAddress[]>({
    url: `${NEXT_API_URL}/${provincesApi}`,
    method: 'get',
  })

  const options = useMemo(
    () => provinces?.map((item) => toObjectOption(item?.name, item)),
    [provinces],
  )
  return (
    <FormControl isInvalid={!!errors?.provinceOption}>
      <FormLabel>Tỉnh/ Thành phố</FormLabel>
      <Select
        options={options}
        value={watch(`provinceOption`)}
        {...register(`provinceOption`, {
          required: 'Vui lòng chọn địa chỉ',
        })}
        onChange={(newValue, action) => {
          setValue(`provinceOption`, newValue, {
            shouldDirty: true,
          })
        }}
        placeholder={'Chọn tỉnh/ thành phố'}
        noOptionsMessage={(input) => {
          return <>Không tìm thấy dữ liệu</>
        }}
      />
      <FormErrorMessage>
        <FormErrorIcon />
        {errors?.provinceOption?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

const DistrictSelect = () => {
  const {
    register,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useContextProvider()
  const provinceCode = watch(`provinceOption`)?.value.code
  const { data: { data: districts } = {} } = useCustom<IAddress[]>({
    url: `${NEXT_API_URL}/${districtsApi(provinceCode)}`,
    method: 'get',
    queryOptions: {
      enabled: !!provinceCode,
    },
  })

  //   const options = [] as any
  //   console.log('districts', districts)

  const options = useMemo(
    () => districts?.map((item) => toObjectOption(item?.name, item)),
    [districts],
  )
  return (
    <FormControl isInvalid={!!errors?.provinceOption}>
      <FormLabel>Quận/ huyện</FormLabel>
      <Select
        options={options}
        value={watch(`districtOption`)}
        {...register(`districtOption`, {
          required: 'Vui lòng chọn địa chỉ',
        })}
        onChange={(newValue, action) => {
          setValue(`districtOption`, newValue, {
            shouldDirty: true,
          })
        }}
        placeholder={'Chọn quận/ huyện'}
        noOptionsMessage={(input) => {
          return !provinceCode
            ? 'Vui lòng chọn tỉnh/ thành phố trước'
            : 'Không tìm thấy dữ liệu'
        }}
      />
      <FormErrorMessage>
        <FormErrorIcon />
        {errors?.districtOption?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

const WardSelect = () => {
  const {
    register,
    setValue,
    getValues,
    watch,
    control,
    formState: { errors },
  } = useContextProvider()
  const districtCode = watch(`districtOption`)?.value.code
  const provinceCode = watch(`provinceOption`)?.value.code

  const { data: { data: wards } = {} } = useCustom<IAddress[]>({
    url: `${NEXT_API_URL}/${wardsApi(districtCode)}`,
    method: 'get',
    queryOptions: {
      enabled: !!districtCode,
    },
  })

  const options = useMemo(
    () => wards?.map((item) => toObjectOption(item?.name, item)),
    [wards],
  )
  return (
    <FormControl isInvalid={!!errors?.wardOption}>
      <FormLabel>Xã/ phường</FormLabel>
      <Controller
        control={control}
        name='wardOption'
        rules={{
          required: 'Vui lòng chọn địa chỉ',
        }}
        render={({ field }) => (
          <Select
            {...field}
            options={options}
            onChange={(newValue, action) => {
              setValue(`wardOption`, newValue, {
                shouldDirty: true,
              })
            }}
            placeholder={'Chọn xã/ phường'}
            // noOptionsMessage={(input) => {
            //   return !provinceCode
            //     ? 'Vui lòng chọn tỉnh/ thành phố trước'
            //     : !districtCode
            //     ? 'Vui lòng chọn quận/ huyện trước'
            //     : 'Không tìm thấy dữ liệu'
            // }}
          />
        )}
      />
      {/* <Select
        options={options}
        value={watch(`wardOption`)}
        {...register(`wardOption`, {
          required: 'Vui lòng chọn địa chỉ',
        })}
        onChange={(newValue, action) => {
          setValue(`wardOption`, newValue, {
            shouldDirty: true,
          })
        }} */}
      {/* placeholder={'Chọn xã/ phường'}
        noOptionsMessage={(input) => {
          return !provinceCode
            ? 'Vui lòng chọn tỉnh/ thành phố trước'
            : !districtCode
            ? 'Vui lòng chọn quận/ huyện trước'
            : 'Không tìm thấy dữ liệu'
        }}
      /> */}
      <FormErrorMessage>
        <FormErrorIcon />
        {errors?.wardOption?.message}
      </FormErrorMessage>
    </FormControl>
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
