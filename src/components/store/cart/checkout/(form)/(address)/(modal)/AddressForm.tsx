/** @format */

import { IAddress, ShippingAddress } from 'types'
import {
  Checkbox,
  FormControl,
  FormErrorIcon,
  FormErrorMessage,
  FormLabel,
  Input,
  UseRadioProps,
  chakra,
  useRadio,
  useRadioGroup,
} from '@chakra-ui/react'
import ChakraFormInput from '@components/ui/ChakraFormInput'
import LoadingOverlay from '@components/ui/LoadingOverlay'
import { Building, HomeIcon } from 'lucide-react'
import { RegisterOptions, Controller } from 'react-hook-form'
import { UseModalFormReturnType } from '@refinedev/react-hook-form'
import { HttpError, useCustom } from '@refinedev/core'
import { createContext, useContext, useEffect, useMemo } from 'react'
import { cn } from 'components/lib/utils'
import { SaveButton } from '@components/buttons'
import { validatePhoneNumber } from '@/lib/validate'
import { useAuthUser } from '@/hooks/useAuth/useAuthUser'
import { API, NEXT_API_URL } from 'types/constants'
import { toObjectOption } from '@/lib/utils'
import Select from 'react-select'
import { useAddressContextProvider } from '../AddressSection'

type State = {} & UseModalFormReturnType<
  ShippingAddress,
  HttpError,
  ShippingAddress
>

type ContextState = { address: ShippingAddress | undefined } & State

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

const Context = createContext<ContextState | null>(null)

const useContextProvider = () => {
  const ctx = useContext(Context)
  if (!ctx) throw new Error('Address Context is missing')
  return ctx
}
export const AddressFormProvider = ({ ...props }: State) => {
  const {
    saveButtonProps,
    refineCore: { formLoading, queryResult, id },
    setValue,
  } = props

  const { userProfile: user } = useAuthUser()
  const address = useMemo(
    () => queryResult?.data?.data,
    [queryResult?.data?.data],
  )

  useEffect(() => {
    if (!user) return
    setValue(`user`, user?._links?.self.href)

    if (id) return

    setValue(`name`, user.fullName ?? '')
    setValue(`phone`, user?.phoneNumber ?? '')
  }, [user, setValue, id])

  return (
    <Context.Provider value={{ ...props, address }}>
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
    refineCore: { id },
    watch,
    setValue,
    getFieldState,
    resetField,
  } = useContextProvider()

  const { defaultAddress: { id: defaultId } = {} } = useAddressContextProvider()
  useEffect(() => {
    resetField(`default`, { defaultValue: defaultId == id })
    console.log('defaultId === id', defaultId === id)
    console.log('defaultId, id', defaultId, id)
  }, [defaultId, id, setValue, resetField])
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
        <FormLabel m={0}>Địa chỉ mặc định</FormLabel>
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
    watch,
    formState: { errors },
    address,
    resetField,
  } = useContextProvider()
  const { data: { data: provinces } = {}, status } = useCustom<IAddress[]>({
    url: `${NEXT_API_URL}/${provincesApi}`,
    method: 'get',
  })
  const options = useMemo(
    () => provinces?.map((item) => toObjectOption(item?.name, item)),
    [provinces],
  )

  useEffect(() => {
    if (address) {
      const selected = options?.find(
        (option) => address.province === option.label,
      )
      selected && resetField(`provinceOption`, { defaultValue: selected })
    }
  }, [address, options, resetField])
  return (
    <FormControl isInvalid={!!errors?.provinceOption}>
      <FormLabel>Tỉnh/ Thành phố</FormLabel>
      <Select
        options={options}
        value={watch(`provinceOption`)}
        {...register(`provinceOption`, {
          required: 'Vui lòng chọn địa chỉ',
        })}
        onChange={(newValue) => {
          setValue(`provinceOption`, newValue, {
            shouldDirty: true,
          })
        }}
        placeholder={'Chọn tỉnh/ thành phố'}
        noOptionsMessage={() => {
          return <>Không tìm thấy dữ liệu</>
        }}
        isLoading={status === 'loading'}
        loadingMessage={() => <p>Đang tải....</p>}
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
    watch,
    formState: { errors, dirtyFields },
    address,
    resetField,
    getValues,
  } = useContextProvider()
  const provinceCode = watch(`provinceOption`)?.value.code
  const isValid = !!provinceCode
  const { data: { data: districts } = {}, status } = useCustom<IAddress[]>({
    url: `${NEXT_API_URL}/${districtsApi(provinceCode)}`,
    method: 'get',
    queryOptions: {
      enabled: !!provinceCode,
    },
  })

  const options = useMemo(
    () => districts?.map((item) => toObjectOption(item?.name, item)),
    [districts],
  )

  useEffect(() => {
    if (address) {
      const selected = options?.find(
        (option) => address.district === option.label,
      )
      selected && resetField(`districtOption`, { defaultValue: selected })
    }
  }, [address, options, resetField])

  useEffect(() => {
    const district = getValues(`districtOption`)
    if (dirtyFields.provinceOption && district)
      setValue(`districtOption`, null, {
        shouldDirty: true,
      })
  }, [provinceCode, dirtyFields.provinceOption, setValue, getValues])

  return (
    <FormControl isInvalid={!!errors?.provinceOption}>
      <FormLabel>Quận/ huyện</FormLabel>
      <Select
        options={provinceCode ? options : []}
        value={watch(`districtOption`)}
        {...register(`districtOption`, {
          required: 'Vui lòng chọn địa chỉ',
        })}
        onChange={(newValue) => {
          setValue(`districtOption`, newValue, {
            shouldDirty: true,
          })
        }}
        placeholder={'Chọn quận/ huyện'}
        noOptionsMessage={() => {
          return !provinceCode
            ? 'Vui lòng chọn tỉnh/ thành phố trước'
            : 'Không tìm thấy dữ liệu'
        }}
        isLoading={status === 'loading' && isValid}
        loadingMessage={() => <p>Đang tải....</p>}
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
    setValue,
    watch,
    control,
    formState: { errors, dirtyFields },
    resetField,
    address,
    getValues,
  } = useContextProvider()
  const districtCode = watch(`districtOption`)?.value.code
  const provinceCode = watch(`provinceOption`)?.value.code
  const isValid = !!districtCode && !!provinceCode
  const { data: { data: wards } = {}, status } = useCustom<IAddress[]>({
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

  useEffect(() => {
    if (address) {
      const selected = options?.find((option) => address.ward === option.label)
      selected && resetField(`wardOption`, { defaultValue: selected })
    }
  }, [address, options, resetField])

  useEffect(() => {
    const ward = getValues(`wardOption`)
    if (dirtyFields.districtOption && ward)
      setValue(`wardOption`, null, {
        shouldDirty: true,
      })
  }, [districtCode, dirtyFields.districtOption, setValue, getValues])
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
            options={districtCode ? options : []}
            onChange={(newValue) => {
              setValue(`wardOption`, newValue, {
                shouldDirty: true,
              })
            }}
            placeholder={'Chọn xã/ phường'}
            noOptionsMessage={(input) => {
              return !provinceCode
                ? 'Vui lòng chọn tỉnh/ thành phố trước'
                : !districtCode
                ? 'Vui lòng chọn quận/ huyện trước'
                : 'Không tìm thấy dữ liệu'
            }}
            isLoading={status === 'loading' && isValid}
            loadingMessage={() => <p>Đang tải....</p>}
          />
        )}
      />
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
  const { state, getInputProps, getRadioProps, htmlProps } = useRadio(props)
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

  const { getRadioProps, getRootProps } = useRadioGroup({
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
