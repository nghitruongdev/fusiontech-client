/** @format */

'use client'

import { HttpError, useCustom, useList, useOne } from '@refinedev/core'
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  InputGroup,
  InputLeftElement,
  useConst,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Tooltip,
  Switch,
  FormErrorIcon,
  Button,
  useBoolean,
  ButtonGroup,
} from '@chakra-ui/react'
import { useForm } from '@refinedev/react-hook-form'
import { useRouter, useSearchParams } from 'next/navigation'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import Select from 'react-select'
import {
  FirebaseImage,
  IProduct,
  ISpecification,
  IVariant,
  IVariantField,
  Option,
} from 'types'
import { PropsWithChildren } from 'react'
import { Controller, FieldArrayWithId, useFieldArray } from 'react-hook-form'
import { API, API_URL } from 'types/constants'
import {
  cleanValue,
  formatPrice,
  isValidNewSelectOption,
  toArrayOptionString,
  toObjectOption,
  toRecord,
} from '@/lib/utils'
import CreatableSelect from 'react-select/creatable'
import ImageUpload, { UploadProviderProps } from '@components/image-upload'
import useUploadImage, { uploadUtils } from '@/hooks/useUploadImage'
import { Create, Edit } from '@components/crud'
import { ChakraCurrencyInput } from '@components/ui/ChakraCurrencyInput'
import { QuestionIcon } from '@chakra-ui/icons'
import { waitPromise } from '@/lib/promise'
import CurrencyInput from 'react-currency-input-field'
import { Badge } from '@components/ui/shadcn/badge'
import { DeleteVariantButton } from './DeleteVariantButton'
import { SaveButton } from '@components/buttons'
const productResource = API.products()
const variantResource = API.variants()
const ENABLE_FETCHED = true
type FormProps = {
  action: 'create' | 'edit'
}

export const VariantForm = ({ action }: FormProps) => {
  return (
    <VariantForm.Provider action={action}>
      <VariantForm.Body />
    </VariantForm.Provider>
  )
}

type ContextProps = {
  variant: IVariant | undefined
  handleFormSubmit: () => void
} & FormProps &
  ReturnType<typeof useForm<IVariant, HttpError, IVariantField>>

const Context = createContext<ContextProps | null>(null)

const useFormProvider = () => {
  const ctx = useContext(Context)
  if (!ctx) throw new Error('Create Variant Context Provider is missing')
  return {
    ...ctx,
  }
}

VariantForm.Provider = function Provider({
  children,
  ...props
}: PropsWithChildren<FormProps>) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { uploadImages, removeImages } = useUploadImage({
    resource: 'variants',
  })
  const { action } = props
  const formMethods = useForm<IVariant, HttpError, IVariantField>({
    refineCoreProps: {
      resource: variantResource.resource,
      redirect: false,
      meta: {
        query: {
          projection: variantResource.projection.withSpecs,
        },
      },
      onMutationSuccess() {
        console.log('on mutation success')
        setTimeout(router.back, 500)
      },
    },
  })
  const {
    handleSubmit,
    formState: { dirtyFields },
    saveButtonProps: saveProps,
    refineCore: {
      onFinish,
      queryResult: { data: { data: variant } = { data: undefined } } = {},
    },
  } = formMethods

  const handleFormSubmit = handleSubmit(async (formValues: IVariantField) => {
    const {
      id,
      images,
      files,
      specifications,
      formSpecifications,
      specificationGroup,
      formProduct: { value: product },
      ...values
    } = formValues

    const handleSpecifications = () =>
      formSpecifications &&
      formSpecifications
        //todo: check again what is proper request for create variants
        .map(({ option }) => option?.value)
        .filter((item) => !!item)

    const handleImages = async () => {
      const variantImages = [...(variant?.images ?? [])]

      const removed = () =>
        (images ?? [])
          .map((image, idx) =>
            !image ? variantImages.splice(idx, 1)[0] : null,
          )
          .filter((item) => !!item)
          .map((item) => item as FirebaseImage)
      const [uploadedUrls] = await Promise.all([
        uploadImages(files),
        dirtyFields.images && removeImages(removed()),
      ])

      return [...variantImages, ...uploadedUrls]
    }
    const onSubmit = async () => {
      const formSpecs = dirtyFields.formSpecifications && handleSpecifications()
      const formImages = dirtyFields.files && (await handleImages())

      const formValues = Object.entries(values).reduce((acc, [key, val]) => {
        const asKey = key as keyof typeof values
        if (dirtyFields[asKey]) acc[asKey] = val
        return acc
      }, {} as any)

      const submitValues = {
        ...formValues,
        ...(formSpecs && { specifications: formSpecs }),
        ...(formImages && { images: formImages }),
        ...(action === 'create' && { product: { id: product.id } }),
      }
      onFinish({ ...(submitValues as any) })
      console.log('after on finish success')
    }

    await onSubmit()
  })

  const saveButtonProps = {
    ...saveProps,
    onClick: (e: any) => {
      console.log('save button clicked')
      handleFormSubmit(e)
    },
  }

  const contextValue: ContextProps = {
    ...props,
    ...formMethods,
    handleFormSubmit,
    saveButtonProps,
    variant,
  }

  return (
    <Context.Provider value={contextValue}>
      <VariantForm.Container>{children}</VariantForm.Container>
    </Context.Provider>
  )
}

VariantForm.Container = function Container({ children }: PropsWithChildren) {
  const {
    action,
    formState: { isLoading },
    saveButtonProps,
    refineCore: { id },
  } = useFormProvider()
  const isCreate = action === 'create'
  const isEdit = action === 'edit'

  if (isCreate)
    return (
      <Create
        isLoading={isLoading}
        saveButtonProps={saveButtonProps}>
        {children}
      </Create>
    )
  return (
    <Edit
      isLoading={isLoading}
      saveButtonProps={saveButtonProps}
      footerButtons={({ deleteButtonProps, saveButtonProps }) => {
        return (
          <ButtonGroup>
            <DeleteVariantButton
              {...deleteButtonProps}
              isDisabled={saveButtonProps?.isDisabled}
              disabled={saveButtonProps?.disabled}
              variantId={id}
            />
            <SaveButton {...saveButtonProps} />
          </ButtonGroup>
        )
      }}>
      {children}
    </Edit>
  )
}

VariantForm.Body = function Body() {
  return (
    <div className='grid grid-cols-3 gap-4'>
      <div className=' col-span-1  '>
        <div className='flex justify-center mb-5'>
          <VariantForm.Images />
        </div>
      </div>
      <div className=' col-span-2 flex flex-col gap-2'>
        <VariantForm.Product />
        <VariantForm.SKU />
        <VariantForm.Price />
        <VariantForm.Active />
        <VariantForm.Specification />
        <VariantForm.SpecDefault />
      </div>
    </div>
  )
}

VariantForm.Product = function Product() {
  const {
    control,
    resetField,
    refineCore: { id: variantId },
    formState: { errors },
    variant,
    setValue,
  } = useFormProvider()
  const searchParams = useSearchParams()
  const paramProductId = searchParams.get('productId')
  const inputDisabled = !!paramProductId || !!variantId
  type IProductWithVariantCount = IProduct & { variantCount: number }
  const { data: { data: products } = {} } = useList<IProductWithVariantCount>({
    resource: productResource.resource,
    pagination: {
      mode: 'off',
    },
    queryOptions: {
      enabled: !inputDisabled && ENABLE_FETCHED,
    },
    meta: {
      query: {
        projection: productResource.projection.nameAndVariantCount,
      },
    },
  })

  const { data: { data: product } = {} } = useOne<IProductWithVariantCount>({
    resource: productResource.resource,
    id: variant?.product?.id ?? paramProductId ?? '',
    queryOptions: {
      enabled: !!variant?.product?.id || !!paramProductId,
    },
    meta: {
      query: {
        projection: productResource.projection.nameAndVariantCount,
      },
    },
  })

  const options: Option<{ id: string; name: string; variantCount: number }>[] =
    useMemo(() => {
      return (products ?? (!!product ? [product] : []))
        .map(({ id, name, variantCount }) =>
          toObjectOption(name, { id: id ?? '', name, variantCount }),
        )
        .map((item) => ({
          ...item,
          ...(item.value.variantCount === 1 && { __isDisabled__: true }),
        }))
    }, [products, product])

  useEffect(() => {
    const selectProductId = variant?.product?.id ?? paramProductId
    if (!selectProductId) return
    const option = options.find((item) => item.value.id == selectProductId)
    console.log('option', option)
    !!option && setValue('formProduct', option)
  }, [setValue, options, paramProductId, variant])

  return (
    <>
      <FormControl
        isRequired
        isInvalid={!!errors.formProduct}>
        <FormLabel>Chọn sản phẩm</FormLabel>
        <Controller
          render={({ field }) => (
            <Select
              options={options}
              {...field}
              isDisabled={inputDisabled}
              isOptionDisabled={(option) => !!option.__isDisabled__}
              formatOptionLabel={({ value }) =>
                !value ? (
                  <>Không có dữ liệu</>
                ) : (
                  <p className='flex items-center gap-2'>
                    <span>{value?.name}</span>
                    <span className=' text-xs text-center text-zinc-500 bg-gray-100 rounded-full w-4 h-4'>
                      {value?.variantCount}
                    </span>
                  </p>
                )
              }
            />
          )}
          control={control}
          name={`formProduct`}
          rules={{
            required: 'Chọn một sản phẩm để thêm biến thể.',
          }}
        />
        <FormErrorMessage>
          <FormErrorIcon />
          {errors.formProduct?.message as string}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

const validateSKUExists = async (
  variant: IVariant | undefined,
  sku: string,
) => {
  const { findBySku } = variantResource
  const id = variant?.id
  if (!sku) return false
  let message: string = ''
  const getResponse = async () => {
    const response = await fetch(`${API_URL}/${findBySku(sku.trim())}`)
    if (response.status === 404) {
      return true
    }
    if (response.ok) {
      const result = await response.json()
      if (result) {
        if (id && id === result.id) {
          return true
        }
        message = 'Mã SKU đã tồn tại'
      }
    }
  }
  await getResponse()
  return message ?? true
}

VariantForm.SKU = function SKU() {
  const {
    formState: { errors },
    register,
    variant,
    setError,
    action,
  } = useFormProvider()
  if (action === 'create') return <></>
  // const [checkSKU, isValidatingSKU] = useDebounceFn(validateSKUExists, 300)
  return (
    <FormControl
      mb='3'
      mt='3'
      isInvalid={!!(errors as any)?.sku}>
      <FormLabel
        display='flex'
        alignItems='center'>
        Mã SKU
        <span className='text-gray-300 text-sm ml-2'>
          <Tooltip label={`Tự động tạo bởi hệ thống`}>
            <QuestionIcon />
          </Tooltip>
        </span>
      </FormLabel>
      <Input
        readOnly
        {...register(`sku`)}
        placeholder={'1-BRA-CAT-PRO-SPEC'}
      />
      {/* <FormLabel>Mã SKU</FormLabel> */}
      {/* <InputGroup>
        <Input
          type='text'
          {...register('sku', {
            required: 'This field is required',
            validate: async (value) => {
              return await checkSKU.bind(null, variant)(value)
            },
          })}
        />
        <InputRightElement>
          {isValidatingSKU && (
            <Spinner
              size={'sm'}
              speed='1s'
              color='blue.500'
            />
          )}
        </InputRightElement>
      </InputGroup> */}
      <FormErrorMessage>
        <FormErrorIcon />
        {(errors as any)?.sku?.message as string}
      </FormErrorMessage>
    </FormControl>
  )
}

VariantForm.Price = function Price() {
  const {
    formState: { errors },
    register,
    setValue,
    watch,
    control,
  } = useFormProvider()
  const productId = watch(`formProduct`)?.value?.id
  const { product } = useOneProductSpecs(productId)

  return (
    <FormControl
      mb='3'
      isInvalid={!!errors?.price}>
      <FormLabel>Giá tiền</FormLabel>
      <InputGroup>
        <InputLeftElement
          pointerEvents='none'
          color='gray.300'
          fontSize='1.2em'>
          $
        </InputLeftElement>
        <Controller
          name='price'
          control={control}
          //todo: update this field,remove register
          render={({ field }) => (
            <div className='grid gap-2 w-full'>
              <ChakraCurrencyInput
                pl='10'
                {...field}
                {...register(`price`, {
                  required: 'Yêu cầu nhập giá tiền',
                  validate: (v) => (v && v > 0) || 'Giá tiền không hợp lệ',
                  valueAsNumber: true,
                })}
                onValueChange={(value) => {
                  setValue(`price`, value ? +value : 0)
                }}
              />
              {!errors?.price?.message &&
                !!product?.discount &&
                !!field.value && (
                  <div>
                    Giá sau giảm:
                    <Badge
                      variant={'secondary'}
                      className={'ml-2 text-green-500 font-bold'}>
                      {formatPrice(
                        ((100 - (product?.discount ?? 0)) / 100) * field.value,
                      )}{' '}
                      | -{product?.discount ?? 0}%
                    </Badge>
                  </div>
                )}
            </div>
          )}
        />
      </InputGroup>
      <FormErrorMessage>
        <FormErrorIcon />
        {errors?.price?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

VariantForm.Images = function Images() {
  const { setValue, variant: { images } = {} } = useFormProvider()

  const onFilesChange: UploadProviderProps['onFilesChange'] = useCallback(
    (files: File[]) => {
      setValue(`files`, files, {
        shouldDirty: true,
      })
    },
    [setValue],
  )
  onFilesChange.isCallback = true
  const onUrlRemove: UploadProviderProps['onRemoveUrl'] = useCallback(
    (index: number) => {
      setValue(`images.${index}`, null, {
        shouldDirty: true,
      })
    },
    [setValue],
  )
  onUrlRemove.isCallback = true

  const formImages = useMemo(() => {
    console.count('useMemo image ran')
    // setValue(`images`, images)
    console.log(images)
    return (
      images?.map((url) => ({
        url,
        name: uploadUtils.getName('variants', url) ?? '',
      })) ?? []
    )
  }, [images])

  useEffect(() => {
    setValue(`images`, images)
  }, [images, setValue])
  return (
    <div className='w-[300px] h-[258px] mt-[20px]'>
      <ImageUpload
        initialUrls={formImages}
        onFilesChange={onFilesChange}
        onRemoveUrl={onUrlRemove}
      />
    </div>
  )
}

VariantForm.SpecDefault = function SpecificationDefault({}) {
  const { findDistinctNames } = API['specifications']()
  const { action, resetField, watch } = useFormProvider()

  const productId = watch(`formProduct`)?.value?.id
  const { product } = useOneProductSpecs(productId)

  const productSpecs = product?.specifications ?? []
  useEffect(() => {
    if (action === 'edit') return

    const specifications = product?.specifications ?? []
    const formSpecs = specifications.filter((item) => item.values.length > 1)
    setTimeout(() => {
      resetField(`specificationGroup`, {
        defaultValue: toArrayOptionString(formSpecs.map((item) => item.name)),
      })
      resetField(`specifications`, {
        defaultValue: formSpecs
          .flatMap(({ values }) => values)
          .map((item) => toObjectOption(item.name, item)),
      })
    }, 0)
  }, [product?.specifications, action, resetField])

  return (
    <>
      {!!productSpecs.length && (
        <div className=' mt-4'>
          <FormLabel>Thông số mặc định</FormLabel>
          <Table
            variant='simple'
            colorScheme='blackAlpha'
            borderWidth='2px'
            borderRadius='xl'>
            <Thead>
              <Tr>
                <Th fontWeight='bold'>Tên thuộc tính</Th>
                <Th fontWeight='bold'>Giá trị</Th>
              </Tr>
            </Thead>
            <Tbody>
              {productSpecs.map(({ name, values }) => (
                <Tr key={name}>
                  <Td>{name}</Td>
                  <Td>{values.map((val) => val.value).join('/ ')}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </div>
      )}
    </>
  )
}

VariantForm.Specification = function Specification({}) {
  const { findDistinctNames } = API['specifications']()
  const {
    action,
    setValue,
    getValues,
    resetField,
    control,
    watch,
    variant,
    formState: { errors },
  } = useFormProvider()

  const buttonRef = useRef(null)

  const { fields, append, remove } = useFieldArray({
    name: 'formSpecifications',
    control: control,
  })
  const isDisabled = true

  const productId = watch(`formProduct`)?.value?.id
  const { product } = useOneProductSpecs(productId)
  const productSpecs = useMemo(
    () =>
      product?.specifications
        ?.filter((item) => item.values.length > 1)
        .map((item) => item.name) ?? [],
    [product?.specifications],
  )
  //reset and update spec item row when create new
  useEffect(() => {
    const formSpecs = productSpecs
    resetField(`formSpecifications`, { defaultValue: [] })
    const variantSpecs = toRecord(
      variant?.specifications ?? [],
      'name' as keyof ISpecification,
    )

    formSpecs.forEach(async (name) => {
      const value = variantSpecs[name as keyof ISpecification]
      append(
        {
          label: name,
          option: value ? toObjectOption(value.value, value) : undefined,
        },
        { shouldFocus: false },
      )
    })
  }, [productSpecs, action, resetField, append, variant?.specifications])

  if (!fields.length) return <></>
  return (
    <>
      <FormControl isInvalid={!!errors.formSpecifications}>
        <FormLabel>Thông số kỹ thuật</FormLabel>
        <FormErrorMessage>
          {errors?.formSpecifications?.message}
        </FormErrorMessage>
        <div className='border rounded-lg p-4'>
          <div className=''>
            {/* <div className='header flex'>
              <p className='flex-grow'>Tên thông số</p>
              <p className='flex-grow'>Chi tiết</p>
            </div> */}
            <div className='body flex flex-col'>
              {fields.map((field, idx) => (
                <VariantForm.Specification.Row
                  key={field.id}
                  index={idx}
                  field={field}
                />
              ))}
            </div>
          </div>
        </div>
        <VariantForm.OtherVariant />
      </FormControl>
    </>
  )
} as React.FC & {
  Row: React.FC<{
    field: FieldArrayWithId<IVariantField, 'formSpecifications', 'id'>
    index: number
    onRemove?: () => void
  }>
}

VariantForm.OtherVariant = function OtherVariants() {
  const {
    trigger,
    getValues,
    variant,
    setError,
    watch,
    clearErrors,
    getFieldState,
    formState: { errors },
  } = useFormProvider()
  const productId = watch(`formProduct`)?.value?.id
  const { data: { data: variants } = {} } = useCustom<IVariant[]>({
    url: productResource.getVariants(productId),
    method: 'get',
    queryOptions: {
      enabled: !!productId,
    },
    config: {
      query: {
        projection: variantResource.projection.withSpecs,
      },
    },
    meta: {
      resource: variantResource.resource,
    },
  })
  const specsChange = watch(`formSpecifications`)

  //todo: update this using trigger without rerendering the form
  const otherVariant = useMemo(() => {
    const isInvalid = specsChange.some((spec) => !spec.option?.value)
    console.log('isInvalid', isInvalid)
    if (isInvalid) return
    const specs = specsChange
      .filter((item) => !!item.option)
      .map((item) => item?.option?.value as ISpecification)
    const containsAllSpecs = (v: IVariant) =>
      !specs.some(
        ({ name, value }) =>
          !v.specifications?.find(
            (spec) => spec.name === name && spec.value === value,
          ),
      )
    const other = variants?.find(containsAllSpecs)
    if (!other || other.id === variant?.id) {
      getFieldState(`formSpecifications`).error &&
        clearErrors(`formSpecifications`)
      return
    }
    setError(`formSpecifications`, {
      message: 'Phiên bản sản phẩm đã tồn tại',
    })
    return other
  }, [specsChange, variants, variant?.id, setError, clearErrors, getFieldState])
  return (
    <>
      {otherVariant && (
        <div>
          <h2>Thông tin biến thể khác</h2>
          <p>ID: {otherVariant.id}</p>
          <p>SKU: {otherVariant.sku}</p>
          <p>Giá: {otherVariant.price}</p>
          <p>Tên sản phẩm: {otherVariant.product?.name}</p>
          <p>Số lượt bán: {otherVariant.soldCount}</p>
        </div>
      )}
    </>
  )
}

VariantForm.Active = function VariantActive() {
  const { register } = useFormProvider()
  return (
    <FormControl
      display='flex'
      alignItems='center'>
      <FormLabel
        htmlFor='show-hide-product'
        mb='0'>
        Hiển thị sản phẩm
      </FormLabel>
      <Switch
        {...register(`active`)}
        id='show-hide-product'
      />
    </FormControl>
  )
}

VariantForm.Specification.Row = function Row({
  index,
  onRemove,
  field: rowField,
}) {
  const { resource, findDistinctByName } = API['specifications']()
  const {
    control,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useFormProvider()
  const [shouldFetch, { on: shouldFetchOn }] = useBoolean()
  const isDisabled = false
  const { data: { data: specsData = [] } = {} } = useCustom<ISpecification[]>({
    url: findDistinctByName(rowField.label ?? ''),
    method: 'get',
    queryOptions: {
      enabled: !isDisabled && ENABLE_FETCHED && shouldFetch,
    },
    meta: {
      resource,
    },
  })

  const options = useMemo(() => {
    return specsData.map((item) => toObjectOption(item.value, item))
  }, [specsData])

  return (
    <FormControl>
      <FormLabel>{rowField.label}</FormLabel>
      <Controller
        name={`formSpecifications.${index}.option`}
        control={control}
        rules={{
          required: true,
        }}
        render={({ field }) => {
          return (
            <CreatableSelect
              {...field}
              options={options}
              onFocus={() => {
                !shouldFetch && shouldFetchOn()
              }}
              menuPosition={'fixed'}
              formatCreateLabel={(input) => `Tạo ${cleanValue(input)}`}
              isValidNewOption={isValidNewSelectOption}
              onChange={(newValue, meta) => {
                console.log('newValue', newValue)
                const { action } = meta
                let updateOption = newValue
                switch (action) {
                  case 'create-option': {
                    updateOption =
                      typeof updateOption?.value === 'string'
                        ? {
                            ...updateOption,
                            label: cleanValue(updateOption.value),
                            value: {
                              name: rowField.label,
                              value: cleanValue(updateOption.value),
                            },
                          }
                        : updateOption
                  }
                }
                const formSpecs = [...getValues(`formSpecifications`)]
                const index = formSpecs.findIndex(
                  (item) => item.label === rowField.label,
                )
                if (index === -1) return
                formSpecs[index] = {
                  label: rowField.label,
                  option: updateOption ?? undefined,
                }
                setValue(`formSpecifications`, formSpecs)
              }}
            />
          )
        }}
      />
      <FormErrorMessage>
        <FormErrorIcon />
        {errors.specifications?.[index]?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

const useOneProductSpecs = (productId: string | number | undefined) => {
  const { data: { data } = {} } = useOne<IProduct>({
    resource: productResource.resource,
    id: productId ?? '',
    queryOptions: {
      enabled: !!productId && ENABLE_FETCHED,
    },
    meta: {
      query: {
        projection: productResource.projection.specifications,
      },
    },
  })
  return {
    product: data,
  }
}
