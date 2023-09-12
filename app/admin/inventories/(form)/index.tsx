/** @format */

'use client'

import { toObjectOption } from '@/lib/utils'
import {
  Button,
  FormControl,
  FormErrorIcon,
  FormErrorMessage,
  FormLabel,
  Heading,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from '@chakra-ui/react'
import { DeleteButton, SaveButton } from '@components/buttons'
import { Create, Edit } from '@components/crud'
import { HttpError, useList } from '@refinedev/core'
import { UseFormReturnType, useForm } from '@refinedev/react-hook-form'
import { PlusCircle, Inbox } from 'lucide-react'
import React, { ReactNode, cache, useMemo } from 'react'
import { BaseSyntheticEvent, createContext, useContext } from 'react'
import { Controller, UseFieldArrayReturn, useFieldArray } from 'react-hook-form'
import {
  GroupOption,
  IInventory,
  IInventoryDetail,
  IInventoryDetailWithoutInventoryRef,
  IProduct,
  IVariant,
  Option,
} from 'types'
import { ActionText, API } from 'types/constants'
import AsyncSelect from 'react-select/async'
import { springDataProvider } from '@/providers/rest-data-provider'
import useDebounceFn from '@/hooks/useDebounceFn'
import { GroupBase } from 'react-select'
import { cn } from 'components/lib/utils'
import CollapseAlert from '@components/alert/CollapseAlert'
import { waitPromise } from '@/lib/promise'
import { onError, onSuccess } from '@/hooks/useCrudNotification'
import LoadingOverlay from '@components/ui/LoadingOverlay'
import { findProductLikeNoOption, toVariantsWithProduct } from './utils'
import { useHeaders } from '@/hooks/useHeaders'
import Image from 'next/image'

type InventoryForm = {
  items: IInventoryDetail[]
}
type ContextProps = {
  action: 'create' | 'edit'
} & {
  detailFormProps: UseFormReturnType<
    IInventoryDetail,
    HttpError,
    IInventoryDetailWithoutInventoryRef
  >
  formProps: UseFormReturnType<IInventory, HttpError, InventoryForm>
  fieldsArray: UseFieldArrayReturn<InventoryForm, 'items', 'id'>
}

type ProviderProps = {
  action: ContextProps['action']
}

export const Form = ({ action }: ProviderProps) => {
  return <Form.Provider action={action} />
}

Form.Context = createContext<ContextProps | null>(null)

Form.useContext = () => {
  const ctx = useContext(Form.Context)
  if (!ctx) throw new Error('FormContext.Provider is missing')
  return ctx
}
Form.Provider = function Provider({ action }: ProviderProps) {
  const { getAuthHeader } = useHeaders()
  const formProps = useForm<IInventory, HttpError, InventoryForm>({
    reValidateMode: 'onSubmit',
    refineCoreProps: {
      meta: {
        headers: {
          ...getAuthHeader(),
        },
      },
      errorNotification: onError,
      successNotification: onSuccess.bind(null, action),
      //   redirect: false,
      mutationMode: 'pessimistic',
    },
  })

  const detailFormProps = useForm<
    IInventoryDetail,
    HttpError,
    IInventoryDetail
  >({
    refineCoreProps: {
      meta: {
        headers: {
          ...getAuthHeader(),
        },
      },
      errorNotification: onError,
      //   successNotification: onSuccess.bind(null, 'edit'),
      successNotification: {
        type: 'success',
        message: 'Cập nhật thành cônng!',
      },
      resource: 'inventory-details',
    },
  })

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    refineCore: { onFinish, formLoading },
  } = formProps

  const itemsFiedArray = useFieldArray({
    control,
    name: 'items',
    rules: {
      required: {
        value: true,
        message: 'Bạn chưa thêm danh sách sản phẩm nhập hàng',
      },
    },
  })

  const submitHandler = async () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
    await handleSubmit(async (data) => {
      //   await waitPromise(5000)
      console.log('data', data)
      onFinish({ items: data.items })
    })()
  }
  const saveButtonProps = {
    disabled: isSubmitting,
    isLoading: isSubmitting,
    onClick: () => {
      submitHandler()
    },
  }

  return (
    <Form.Context.Provider
      value={{
        action,
        formProps: { ...formProps, saveButtonProps },
        detailFormProps,
        fieldsArray: itemsFiedArray,
      }}>
      {/* {isSubmitting && <LoadingOverlay />} */}
      <Form.Container />
    </Form.Context.Provider>
  )
}

Form.Container = function Container() {
  const {
    action,

    formProps: {
      formState: { isSubmitting },
      refineCore: { formLoading },
      saveButtonProps,
    },
  } = Form.useContext()

  const isEdit = action === 'edit'
  if (isEdit)
    return (
      <Edit
        isLoading={formLoading || isSubmitting}
        saveButtonProps={saveButtonProps}
        // canDelete={soldData && (soldData.data as unknown as number) == 0}
      >
        <Form.Body />
      </Edit>
    )

  return (
    <Create
      isLoading={formLoading || isSubmitting}
      saveButtonProps={saveButtonProps}
      contentProps={{ minH: '550px' }}>
      <Form.Body />
    </Create>
  )
}

Form.Body = function Body() {
  const {
    formProps: {
      formState: { errors },
      clearErrors,
      getFieldState,
    },
  } = Form.useContext()
  return (
    <>
      <CollapseAlert
        isVisible={!!errors.items}
        message={'Bạn chưa thêm danh sách sản phẩm nhập hàng'}
        onClose={() => {
          clearErrors(`items`)
        }}
      />
      <div className='border shadow-md my-4 p-4 rounded-md'>
        <InventoryDetailForm />
      </div>
      <hr className='my-2' />
      <Heading
        as='h2'
        size='md'
        mt='4'>
        Bảng chi tiết
      </Heading>
      <DetailTable />
    </>
  )
}

const InventoryDetailForm = () => {
  const {
    fieldsArray: { append },
    detailFormProps: { handleSubmit, reset, watch },
  } = Form.useContext()

  const onAddItem = (e: any) => {
    handleSubmit((value) => {
      append(value, { shouldFocus: false })
    })(e)
  }
  return (
    <>
      <div className='flex gap-2'>
        <div className='grid grid-cols-3 gap-4 flex-grow'>
          <div className='col-span-2'>
            <Form.ProductSelect />
          </div>
          <Form.Quantity onSubmit={onAddItem} />
        </div>

        <div className='mt-8 px-4'>
          <Button
            className='text-zinc-600'
            onClick={onAddItem}
            leftIcon={<PlusCircle />}>
            Thêm
          </Button>
        </div>
      </div>
      <div>
        <Form.ProductInfo />
      </div>
    </>
  )
}

const {
  resource,
  findByNameLike,
  projection: { nameWithVariants },
} = API['products']()

Form.ProductSelect = function ProductSelect() {
  const { getAuthHeader } = useHeaders()
  const {
    detailFormProps: {
      register,
      setValue,
      control,
      formState: { errors },
    },
  } = Form.useContext()

  const { data: { data: products } = {} } = useList<IProduct>({
    resource,
    meta: {
      query: {
        projection: nameWithVariants,
      },
      headers: {
        ...getAuthHeader(),
      },
    },
  })
  const [findProductDebounce, isFetching] = useDebounceFn(
    findProductLikeNoOption,
    300,
  )
  const productOptions: GroupBase<IVariant>[] = useMemo(
    () =>
      products?.map((product) => ({
        label: product.name,
        options: toVariantsWithProduct(product),
      })) ?? [],
    [products],
  )
  const formatGroupLabel = (data: GroupBase<IVariant>): ReactNode => (
    <div className=' flex items-center justify-between'>
      <span>{data.label}</span>
      <span className='bg-gray-50 px-2 rounded-full text-zinc-500'>
        {data.options.length}
      </span>
    </div>
  )
  return (
    <FormControl isInvalid={!!errors.variant}>
      <FormLabel>Sản phẩm</FormLabel>
      <Controller
        control={control}
        name='variant'
        rules={{
          required: 'Vui lòng chọn một sản phẩm',
        }}
        render={({ field }) => (
          <AsyncSelect
            openMenuOnFocus
            formatGroupLabel={formatGroupLabel}
            formatOptionLabel={(option) => `${option.sku}`}
            defaultOptions={productOptions}
            value={field.value}
            ref={field.ref}
            onChange={field.onChange}
            noOptionsMessage={(value) => {
              return 'Không có dữ liệu'
            }}
            isOptionSelected={(item, options) => {
              return item.id === field.value?.id
            }}
            loadOptions={findProductDebounce as any}
            isLoading={isFetching}
            loadingMessage={(input) => {
              return 'Đang tìm....'
            }}
            classNames={{
              control: (state) => '',
              container: (state) => cn(``),
            }}
            placeholder='Chọn sản phẩm'
            styles={{
              //   container: (provided, state) => ({
              //     ...provided,
              //     minWidth: 250,
              //     margin: 8,
              //   }),
              control: (provided, state) => ({
                ...provided,
                // margin: '8px 10px',
                // borderColor: 'red',
                // bord,erStyle: 'solid',
                // borderWidth: '2px',
                // boxShadow: 'none',
                // borderRadius: '6px',
                // outline: '1px solid red',
              }),
            }}
          />
        )}
      />

      <FormErrorMessage>
        <FormErrorIcon />
        {errors.variant?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

Form.Quantity = function DetailQuantity({
  onSubmit,
}: {
  onSubmit: (e: any) => void
}) {
  const {
    detailFormProps: {
      register,
      formState: { errors },
    },
  } = Form.useContext()
  return (
    <FormControl
      mb='3'
      isInvalid={!!errors?.quantity}>
      <FormLabel>Số lượng</FormLabel>
      <NumberInput min={1}>
        <NumberInputField
          {...register('quantity', {
            required: 'Nhập số lượng sản phẩm',
            min: 1 || 'Số lượng tối thiểu là 1',
            pattern: {
              value: /^\d+$/,
              message: 'Số lượng sản phẩm không hợp lệ',
            },
          })}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSubmit(e)
          }}
        />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      <FormErrorMessage>
        <FormErrorIcon />
        {errors?.quantity?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

Form.ProductInfo = function ProductInfo() {
  const {
    detailFormProps: { watch },
  } = Form.useContext()
  const variant = watch(`variant`)

  return (
    <div>
      {/* {JSON.stringify(variant)} */}
      {variant && (
        <div className=''>
          <h2>Tên sản phẩm: {variant.product?.name}</h2>
          {/* <h2>Tên sản phẩm: {variant.images}</h2> */}

          <Image
            src={variant?.images?.[0] ?? ''}
            alt={variant?.images?.[0] ?? ''}
            width={200}
            height={200}
            style={{
              width: '100px',
              height: '100px',
              objectFit: 'contain',
            }}
            className='shadow-lg rounded-lg'
          />
        </div>
      )}
    </div>
  )
}
const DetailTable = () => {
  const {
    formProps: {
      watch,
      register,
      setValue,
      formState: { errors },
    },
    fieldsArray: { fields, remove },
  } = Form.useContext()

  return (
    <div className='border shadow-md rounded-md my-2 p-4'>
      <TableContainer>
        <Table variant='simple'>
          <TableCaption>
            Bảng chi tiết nhập hàng {new Date().toUTCString()}
          </TableCaption>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Tên Sản Phẩm</Th>
              <Th>Mã SKU</Th>
              <Th>Số lượng</Th>
              <Th w={'50px'}>Menu</Th>
            </Tr>
          </Thead>
          <Tbody>
            {!!!fields.length && (
              <Tr>
                <Td colSpan={4}>
                  <div className='min-h-[300px] flex flex-col items-center justify-center'>
                    <Inbox className='text-muted-foreground w-20 h-20' />
                    <p className='text-muted-foreground'>Không có dữ liệu</p>
                  </div>
                </Td>
              </Tr>
            )}
            {fields.map(({ id, variant, quantity }, idx) => (
              <Tr key={id}>
                <Td>{idx + 1}</Td>
                <Td>{variant?.product?.name}</Td>
                <Td>{variant?.sku}</Td>
                <Td>
                  <FormControl isInvalid={!!errors.items?.[idx]}>
                    <NumberInput
                      min={1}
                      //   defaultValue={quantity}
                      variant={'filled'}>
                      <NumberInputField
                        {...register(`items.${idx}.quantity`, {
                          required: 'Nhập số lượng sản phẩm',
                          min: 1 || 'Số lượng tối thiểu là 1',
                          pattern: {
                            value: /^\d+$/,
                            message: 'Số lượng sản phẩm không hợp lệ',
                          },
                        })}
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <FormErrorMessage>
                      <FormErrorIcon />
                      {errors?.items?.[idx]?.quantity?.message}
                    </FormErrorMessage>
                  </FormControl>
                </Td>
                <Td>
                  <DeleteButton
                    hideText
                    onClick={remove.bind(null, idx)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </div>
  )
}

export { Form as InventoryForm }
