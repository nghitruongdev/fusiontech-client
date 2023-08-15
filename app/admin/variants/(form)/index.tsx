/** @format */

'use client'

import { HttpError, useCustom, useList, useOne } from '@refinedev/core'
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Spinner,
  useConst,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  useBoolean,
  Tooltip,
  Switch,
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
} from 'types'
import { PropsWithChildren } from 'react'
import { Controller, useFieldArray } from 'react-hook-form'
import { Inbox, MinusCircle } from 'lucide-react'
import { API, API_URL } from 'types/constants'
import useListOption, { ListOptionProps } from '@/hooks/useListOption'
import { toArrayOptionString, toObjectOption } from '@/lib/utils'
import CreatableSelect from 'react-select/creatable'
import { produce } from 'immer'
import ImageUpload, { UploadProviderProps } from '@components/image-upload'
import useUploadImage, { uploadUtils } from '@/hooks/useUploadImage'
import { Create, Edit } from '@components/crud'
import { ChakraCurrencyInput } from '@components/ui/ChakraCurrencyInput'
import useDebounceFn from '@/hooks/useDebounceFn'
import { QuestionIcon } from '@chakra-ui/icons'
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
  productResponse: ReturnType<typeof useOne<IProduct>>
  variant: IVariant | undefined
  handleFormSubmit: () => void
  paramProductId: string | null
  productId: string | undefined
  product: {
    response: ReturnType<typeof useOne<IProduct>>
    param: string | null
    id: string | undefined
    data: IProduct | undefined
  }
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
    watch,
    formState: { dirtyFields },
    saveButtonProps: saveProps,
    refineCore: {
      onFinish,
      queryResult: { data: { data: variant } = { data: undefined } } = {},
    },
  } = formMethods

  const paramProductId = useConst(searchParams.get('productId'))
  const watchId = watch(`product`)?.value?.id
  const productId = useMemo(() => {
    console.count('product id memo ran')
    return variant?.product?.id ?? paramProductId ?? watchId
  }, [variant?.product?.id, paramProductId, watchId])

  const productResponse = useOne<IProduct>({
    resource: productResource.resource,
    id: +productId,
    queryOptions: {
      enabled: !!productId && ENABLE_FETCHED,
    },
    meta: {
      query: {
        projection: productResource.projection.specifications,
      },
    },
  })

  const handleFormSubmit = handleSubmit(async (formValues: IVariantField) => {
    const {
      id,
      images,
      files,
      specifications,
      specificationGroup,
      product: { value: product },
      ...values
    } = formValues

    const handleSpecifications = () =>
      specifications &&
      specifications.map((item) => {
        const values = item?.options.map(({ value }) => ({
          ...value,
        }))
        return { name: item?.label, values }
      })

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
      const formSpecs = dirtyFields.specifications && handleSpecifications()
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
    productResponse,
    paramProductId,
    productId,
    variant,
    product: {
      response: productResponse,
      param: paramProductId,
      id: productId,
      data: productResponse.data?.data,
    },
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
      saveButtonProps={saveButtonProps}>
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
      <div className=' col-span-2'>
        <VariantForm.Product />
        <VariantForm.SKU />
        <VariantForm.Price />
        <VariantForm.Specification />
        <VariantForm.SpecDefault />
      </div>
    </div>
  )
}
VariantForm.Product = function Product() {
  const {
    paramProductId,
    control,
    resetField,
    refineCore: { id },
    formState: { errors },
    productResponse: { data: { data: product } = {} },
  } = useFormProvider()

  const inputDisabled = !!paramProductId || !!id
  const { data: { data: products } = {} } = useList<
    IProduct & { variantCount: number }
  >({
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

  const options = useMemo(() => {
    return (
      products
        ?.map(({ id, name, variantCount }) =>
          toObjectOption(name, { id: id ?? '', name, variantCount }),
        )
        .filter((item) => item.value.variantCount > 1) ?? []
    )
  }, [products])

  useEffect(() => {
    console.count('use effect product ran')
    if (product) {
      const option = options.find(
        ({ value: { id, variantCount } }) =>
          variantCount > 1 && product.id === id,
      )
      !!option &&
        resetField('product', {
          defaultValue: option,
        })
    }
  }, [product, resetField, options])
  return (
    <>
      <FormControl isInvalid={!!errors.product}>
        <FormLabel>Tên sản phẩm</FormLabel>

        <Controller
          render={({ field }) => (
            <Select
              options={options}
              {...field}
              isDisabled={inputDisabled}
              formatOptionLabel={({ value: { name, variantCount } }) => (
                <p className='flex items-center gap-2'>
                  <span>{name}</span>{' '}
                  <span className=' text-xs text-center text-zinc-500 bg-gray-50 rounded-full w-4 h-4'>
                    {variantCount}
                  </span>
                </p>
              )}
            />
          )}
          control={control}
          name={`product`}
          rules={{
            required: 'Chọn một sản phẩm để thêm biến thể.',
          }}
        />
        <FormErrorMessage>{errors.product?.message as string}</FormErrorMessage>
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
  } = useFormProvider()
  const [checkSKU, isValidatingSKU] = useDebounceFn(validateSKUExists, 300)
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
  } = useFormProvider()
  return (
    <FormControl
      mb='3'
      isInvalid={!!(errors as any)?.price}>
      <FormLabel>Giá tiền</FormLabel>
      <InputGroup>
        <InputLeftElement
          pointerEvents='none'
          color='gray.300'
          fontSize='1.2em'>
          $
        </InputLeftElement>
        <ChakraCurrencyInput
          pl='10'
          {...register(`price`, {
            required: 'Yêu cầu nhập giá tiền',
            validate: (v) => v > 0 || 'Giá tiền không hợp lệ',
            valueAsNumber: true,
          })}
          onValueChange={(value) => {
            if (value) setValue(`price`, +value)
          }}
        />
      </InputGroup>
      <FormErrorMessage>
        {(errors as any)?.price?.message as string}
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
    setValue(`images`, images)
    return (
      images?.map((url) => ({
        url,
        name: uploadUtils.getName('variants', url) ?? '',
      })) ?? []
    )
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
  const {
    action,
    resetField,
    product: { data: product },
  } = useFormProvider()

  const productSpecs = product?.specifications ?? []
  useEffect(() => {
    console.log('useEffect ran')
    if (action === 'edit') return

    const specifications = product?.specifications ?? []
    const formSpecs = specifications
      .filter((item) => item.values.length > 1)
      .flatMap((item) => ({
        label: item.name,
        options: [],
      }))
    setTimeout(() => {
      resetField(`specificationGroup`, {
        defaultValue: toArrayOptionString(formSpecs.map((item) => item.label)),
      })
      resetField(`specifications`, {
        defaultValue: formSpecs,
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
    product: { data: product },
    variant,
  } = useFormProvider()

  const buttonRef = useRef(null)

  const { fields, append, remove } = useFieldArray({
    name: 'specifications',
    control: control,
  })

  const isDisabled = true
  const { data: { data: namesData } = {} } = useCustom<string[]>({
    url: findDistinctNames,
    method: 'get',
    queryOptions: {
      enabled: !isDisabled && ENABLE_FETCHED,
    },
  })

  const onAppend = useCallback(
    (value: string, shouldFocus: boolean = true) => {
      setValue(
        `specificationGroup`,
        produce(getValues(`specificationGroup`) ?? [], (draft) => {
          draft.push({
            label: value,
            value: value,
          })
        }),
      )
      append(
        {
          label: value,
          options: [],
        },
        { shouldFocus },
      )
    },
    [append, getValues, setValue],
  )
  const onRemove = (index: number) => {
    // console.log('index', index)
    setValue(
      `specificationGroup`,
      produce(getValues(`specificationGroup`) ?? [], (draft) => {
        draft.splice(index, 1)
      }),
    )
    remove(index)
    console.log('fields.length', fields.length)
  }

  const productSpecs = useMemo(
    () => product?.specifications ?? [],
    [product?.specifications],
  )
  useEffect(() => {
    // console.count('use layout effect specification product ran')
    if (action === 'edit') return
    const formSpecs = productSpecs
      ?.filter((item) => item.values.length > 1)
      .map((item) => item.name)
    const reset = () => {
      console.log('reset ran')
      //   resetField(`specificationGroup`, { defaultValue: [] })
      resetField(`specifications`, { defaultValue: [] })
      formSpecs.forEach((item) => onAppend(item, false))
    }
    reset()
  }, [productSpecs, action, resetField, onAppend])

  //   useEffect(() => {
  //     console.count('productSpecs triggered changed')
  //   }, [productSpecs])

  //   useEffect(() => {
  //     console.log('product triggered changed')
  //   }, [product])

  const variantSpecs = variant?.specifications
  useEffect(() => {
    if (action === 'create' || !variantSpecs) return
    console.log('useEffect variant spec ran')
    const formSpecs = variantSpecs
      .filter((item) =>
        productSpecs.some(
          (spec) => spec.name === item.name && spec.values.length > 1,
        ),
      )
      .map((item) => ({
        label: item.name,
        options: [toObjectOption(item.value, item)],
      }))
    console.log('formSpecs', formSpecs)
    setTimeout(() => {
      //   resetField(`specificationGroup`, {
      //     defaultValue: toArrayOptionString(formSpecs.map((item) => item.label)),
      //   })
      resetField(`specifications`, {
        defaultValue: formSpecs,
      })
    }, 0)
  }, [productSpecs, variantSpecs, action, resetField])
  if (!fields.length) return <></>
  return (
    <>
      <div>
        <FormLabel>Thông số tuỳ chọn</FormLabel>
        <div className='border rounded-lg p-4'>
          <div className=''>
            <div className='header flex'>
              <p className='flex-grow'>Tên thông số</p>
              <p className='flex-grow'>Chi tiết</p>
            </div>
            <div className='body flex flex-col'>
              {fields.map((field, idx) => (
                <VariantForm.Specification.Row
                  key={field.id}
                  index={idx}
                  name={field.label}
                />
              ))}
            </div>
          </div>
        </div>
        <VariantForm.OtherVariant />
      </div>
    </>
  )
} as React.FC & {
  Row: React.FC<{
    name: string | undefined
    index: number
    onRemove?: () => void
  }>
}

VariantForm.OtherVariant = function OtherVariants() {
  const {
    product: { data: product },
    watch,
  } = useFormProvider()
  const { data: { data: variants } = {} } = useCustom<IVariant[]>({
    url: productResource.getVariants(product?.id),
    method: 'get',
    queryOptions: {
      enabled: !!product,
    },
    config: {
      query: {
        projection: variantResource.projection.withSpecs,
      },
    },
  })

  const specsChange = watch(`specifications`)

  const otherVariant = useMemo(() => {
    specsChange?.some((option) => !!option)
  }, [specsChange])
  return (
    <>
      <div>{JSON.stringify(specsChange)}</div>
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

VariantForm.Specification.Row = function Row({ index, onRemove, name = '' }) {
  const { resource, findDistinctByName } = API['specifications']()
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormProvider()
  // const isDisabled = action === "edit";

  const isDisabled = false
  const {} = useBoolean()
  const { data: { data: specsData = [] } = {} } = useCustom<ISpecification[]>({
    url: findDistinctByName(name ?? ''),
    method: 'get',
    queryOptions: {
      enabled: !isDisabled && ENABLE_FETCHED,
    },
    meta: {
      resource,
    },
  })

  const options = useMemo(() => {
    return specsData.map((item) => toObjectOption(item.value, item))
  }, [specsData])

  const append = (input: string) => {
    setValue(`specifications.${index}.options`, [
      {
        label: input,
        value: {
          name: name,
          value: input,
        },
      },
    ])
  }
  return (
    <div>
      <div className='flex border p-4 gap-2'>
        <div className='flex-grow grid grid-cols-4 gap-2'>
          <FormLabel>{name ?? ''}</FormLabel>
          <FormControl
            isInvalid={true}
            className='col-span-3'>
            <Controller
              render={({ field }) => (
                <CreatableSelect
                  {...field}
                  isDisabled={isDisabled}
                  options={options}
                  menuPosition='fixed'
                  onCreateOption={append}
                />
              )}
              name={
                `specifications.${index}.options` as `specifications.0.options`
              }
              control={control}
              rules={{
                required: true,
              }}
            />
            <FormErrorMessage>
              {errors.specifications?.[index]?.message}
            </FormErrorMessage>
          </FormControl>
        </div>
        {!!onRemove && (
          <div className='min-w-[50px]'>
            <Button
              className=''
              onClick={onRemove}
              colorScheme='red'
              isDisabled={isDisabled}>
              <MinusCircle />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
