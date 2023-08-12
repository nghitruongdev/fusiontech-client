/** @format */

'use client'
import React, {
  BaseSyntheticEvent,
  PropsWithChildren,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  HttpError,
  useCustom,
  useList,
  useOne,
  useSelect,
} from '@refinedev/core'
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Select,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  FormErrorIcon,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from '@chakra-ui/react'
import {
  UseFormReturnType,
  UseModalFormReturnType,
  useForm,
  useModalForm,
} from '@refinedev/react-hook-form'
import {
  GroupOption,
  IInventoryDetail,
  IProduct,
  IVariant,
  Option,
} from 'types'
import { Edit } from '@components/crud'
import { AppError } from 'types/error'
import { API } from 'types/constants'
import useDebounceFn from '@/hooks/useDebounceFn'
import { findProductLikeNoOption } from './utils'
import AsyncSelect from 'react-select/async'
import { cn } from 'components/lib/utils'
import { GroupBase, OptionsOrGroups } from 'react-select'
import { useQueryClient } from '@tanstack/react-query'
import { toObjectOption } from '@/lib/utils'
import { Controller } from 'react-hook-form'

type Props = UseModalFormReturnType<
  IInventoryDetail,
  AppError,
  IInventoryDetail
>
export const EditDetailModalForm: React.FC<Props> = (props) => {
  return (
    <Form.Provider {...props}>
      <Form.Body />
    </Form.Provider>
  )
}

type ContextProps = {
  detailFormProps: UseModalFormReturnType<
    IInventoryDetail,
    AppError,
    IInventoryDetail
  >
}

export const Form = () => {}

Form.Context = createContext<ContextProps | null>(null)

Form.useContext = () => {
  const ctx = useContext(Form.Context)
  if (!ctx) throw new Error('FormContext.Provider is missing')
  return ctx
}

Form.Provider = function Provider({
  children,
  ...props
}: PropsWithChildren<Props>) {
  const {
    formState: { isSubmitting, dirtyFields },
    handleSubmit,
    refineCore: { onFinish, queryResult },
    reset,
  } = props

  const saveButtonProps = {
    disabled: isSubmitting,
    isLoading: isSubmitting,
    onClick: async (e: BaseSyntheticEvent) => {
      await handleSubmit(
        async (data) => {
          console.log('data', data)
          const result = await onFinish(data)
          console.log('result', result)
        },
        (err, e) => {},
      )(e)
    },
  }

  return (
    <Form.Context.Provider
      value={{
        detailFormProps: { ...props, saveButtonProps },
      }}>
      {children}
    </Form.Context.Provider>
  )
}

Form.Body = function FormBody() {
  const {
    modal: { visible, close },
    refineCore: { formLoading, id },
    saveButtonProps,
  } = Form.useContext().detailFormProps

  return (
    <Modal
      size='md'
      isOpen={visible}
      onClose={close}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>Thay đổi phiếu nhập kho</ModalHeader>

        <ModalBody>
          <Edit
            isLoading={formLoading}
            saveButtonProps={saveButtonProps}
            resource='inventory-details'
            recordItemId={id}
            title={false}
            goBack={null}
            breadcrumb={null}>
            <Form.ProductSelect />
            <Form.Quantity />
          </Edit>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
const {
  resource,
  findByNameLike,
  projection: { nameWithVariants },
} = API['products']()

Form.ProductSelect = function ProductSelect() {
  const {
    detailFormProps: {
      register,
      setValue,
      formState: { errors },
      refineCore: { queryResult },
      resetField,
      control,
      watch,
    },
  } = Form.useContext()
  const { resource: variantResource } = API['variants']()
  const variantId = queryResult?.data?.data.variantId
  const { data: { data: product } = {} } = useCustom<IProduct>({
    url: `${variantResource}/${variantId}/product`,
    method: 'get',
    config: {
      query: {
        projection: nameWithVariants,
      },
    },
    queryOptions: {
      enabled: !!variantId,
    },
  })

  const options = useMemo(
    () =>
      !!product
        ? [{ label: product.name, options: product.variants ?? [] }]
        : [],
    [product],
  )

  useEffect(() => {
    const variant = product?.variants?.find(
      (v) => variantId && v.id === +variantId,
    )
    variant && setValue(`variant`, variant)
  }, [product, variantId, setValue])

  const [findProductDebounce, isFetching] = useDebounceFn(
    findProductLikeNoOption,
    300,
  )
  const option: GroupBase<IVariant> = {
    options: [...(product?.variants ?? [])],
  }
  const formatGroupLabel = (data: GroupBase<IVariant>): ReactNode => (
    <div className=' flex items-center justify-between'>
      <span>{data.label}</span>
      <span className='bg-gray-50 px-2 rounded-full text-zinc-700'>
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
            onChange={field.onChange}
            ref={field.ref}
            value={field.value}
            formatGroupLabel={formatGroupLabel}
            formatOptionLabel={(data) => {
              return `${data.sku}`
            }}
            defaultOptions={options}
            noOptionsMessage={(value) => {
              return 'Không có dữ liệu'
            }}
            loadOptions={findProductDebounce as any}
            isLoading={isFetching}
            isOptionSelected={(item, options) => {
              return item.id === field.value?.id
            }}
            loadingMessage={(input) => {
              return 'Đang tìm....'
            }}
            placeholder='Chọn sản phẩm'
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
  onSubmit?: (e: any) => void
}) {
  const {
    detailFormProps: {
      register,
      formState: { errors },
      refineCore: { queryResult },
      setValue,
      watch,
    },
  } = Form.useContext()

  const quantity = queryResult?.data?.data.quantity
  const watchQuantity = watch(`quantity`)
  useEffect(() => {
    quantity && setValue(`quantity`, quantity)
  }, [quantity, setValue])
  return (
    <FormControl
      mb='3'
      isInvalid={!!errors?.quantity}>
      <FormLabel>Số lượng</FormLabel>
      <NumberInput
        min={1}
        value={watchQuantity}>
        <NumberInputField
          {...register('quantity', {
            required: 'Nhập số lượng sản phẩm',
            min: 1 || 'Số lượng tối thiểu là 1',
            pattern: {
              value: /^\d+$/,
              message: 'Số lượng sản phẩm không hợp lệ',
            },
          })}
        />
        <NumberInputStepper>
          <NumberIncrementStepper
            onClick={() => {
              setValue(`quantity`, watchQuantity + 1)
            }}
          />
          <NumberDecrementStepper
            onClick={() => {
              setValue(`quantity`, watchQuantity - 1)
            }}
          />
        </NumberInputStepper>
      </NumberInput>
      <FormErrorMessage>{errors?.quantity?.message}</FormErrorMessage>
    </FormControl>
  )
}
