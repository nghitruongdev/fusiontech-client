/** @format */

'use client'

import { HttpError, useCustom, useOne } from '@refinedev/core'
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  Heading,
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
} from '@chakra-ui/react'
import { useForm } from '@refinedev/react-hook-form'
import { useRouter, useSearchParams } from 'next/navigation'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import Select, { ActionMeta, MultiValue } from 'react-select'
import {
  FirebaseImage,
  IProduct,
  ISpecification,
  IVariant,
  IVariantField,
  Option,
} from 'types'
import { PropsWithChildren } from 'react'
import { Controller, UseFieldArrayReturn, useFieldArray } from 'react-hook-form'
import { Inbox, MinusCircle } from 'lucide-react'
import { API, API_URL } from 'types/constants'
import useListOption, { ListOptionProps } from '@/hooks/useListOption'
import { useDebounce } from 'usehooks-ts'
import { waitPromise } from '@/lib/promise'
import useCancellable from '@/hooks/useCancellable'
import {
  isValidNewOption,
  toArrayOptionString,
  toObjectOption,
} from '@/lib/utils'
import CreatableSelect from 'react-select/creatable'
import { produce } from 'immer'
import ImageUpload, { UploadProviderProps } from '@components/image-upload'
import useUploadImage, { uploadUtils } from '@/hooks/useUploadImage'
import { Create, Edit } from '@components/crud'
import { ChakraCurrencyInput } from '@components/ui/ChakraCurrencyInput'
const productResource = API.products()
const variantResource = API.variants()
const ENABLE_FETCHED = true
type FormProps = {
  action: 'create' | 'edit'
}

export const VariantForm = ({ action }: FormProps) => {
  return (
    <VariantForm.Provider action={action}>
      <div className='grid grid-cols-3 gap-4'>
        <div className=' col-span-1 flex flex-col '>
          <div className='flex justify-center mb-5'>
            <VariantForm.Images />
          </div>
          <VariantForm.SpecDefault />
        </div>
        <div className=' col-span-2'>
          <VariantForm.Product />
          <VariantForm.SKU />
          <VariantForm.Price />
          {/* <VariantForm.Options /> */}
          <VariantForm.Specification />
        </div>
      </div>
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
      onMutationSuccess(data, variables, context) {
        console.log('on mutation success')
        setTimeout(router.back, 500)
      },
    },
  })
  const {
    control,
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
  const productId = useMemo(
    () => variant?.product?.id ?? paramProductId ?? watchId,
    [variant?.product?.id, paramProductId, watchId],
  )

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

  //done: check if sku is not exists
  //TODO: convert images to images attribute
  //FIXME: check if save button props redirect correctly
  //IGNORE: check if there are other variants that are the same
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

    // const value = {
    //     sku,
    //     price,
    //     product: {
    //         id: product.id,
    //     },
    // };

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
    // imagesField,
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
  if (isEdit)
    return (
      <Edit
        isLoading={isLoading}
        saveButtonProps={saveButtonProps}>
        {children}
      </Edit>
    )
}

VariantForm.Product = function Product() {
  const {
    paramProductId,
    control,
    variant,
    resetField,
    setValue,
    refineCore: { id },
    formState: { errors },
    productResponse: { data: { data: product } = {} },
  } = useFormProvider()

  const inputDisabled = !!paramProductId || !!id
  const toOption: ListOptionProps<IProduct>['toOption'] = useCallback(
    (item) => ({ label: item.name, value: item }),
    [],
  )
  toOption.isCallback = true
  const { options } = useListOption<IProduct>({
    toOption,
    resource: productResource.resource,
    pagination: {
      mode: 'off',
    },
    queryOptions: {
      enabled: !inputDisabled && ENABLE_FETCHED,
    },
  })
  useEffect(() => {
    console.count('use effect product ran')
    if (product) {
      resetField('product', {
        defaultValue: {
          label: product.name,
          value: product,
        } as any,
      })
    }
    if (paramProductId) {
    }
  }, [product, options, paramProductId, resetField])
  return (
    <>
      <FormControl isInvalid={!!errors.product}>
        <FormLabel>Tên sản phẩm</FormLabel>

        <Controller
          render={({ field }) => (
            <Select
              options={options as any}
              {...field}
              isDisabled={inputDisabled}
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

VariantForm.SKU = function SKU() {
  const { existsBySku, findBySku } = variantResource
  const {
    formState: { errors, isValidating },
    register,
    watch,
    variant,
    getValues,
    getFieldState,
    trigger,
    setError,
  } = useFormProvider()
  const [checkSku, setCheckSku] = useState<string | null>(null)
  const debounceSKU = useDebounce(checkSku, 500)
  const [isFieldValidating, setIsFieldValidating] = useState<boolean>(false)
  const { cancellablePromise, cancel } = useCancellable()
  const checkSkuDB = async (sku: string) => {
    console.count('checkSKuDB ran')
    if (!sku) {
      setCheckSku(null)
      setIsFieldValidating(false)
      return
    }
    const response = await fetch(`${API_URL}/${findBySku(sku)}`)

    if (!response.ok) {
      setError('sku', {
        message: 'Không thể kiểm tra SKU - 500',
      })
    } else {
      const result = (await response.json()) as IVariant
      if (result) {
        if (result)
          setError('sku', {
            message: 'Mã SKU đã tồn tại',
          })
      }
    }
    setIsFieldValidating(false)
    setCheckSku(null)
    console.log('turn off field validating')
  }

  const validateSKUExists = async (sku: string) => {
    if (!sku) return false
    setIsFieldValidating(true)
    await waitPromise(300)
    let message: string = ''
    const response = await fetch(`${API_URL}/${findBySku(sku.trim())}`)
    if (response.status === 404) {
      setIsFieldValidating(false)
      return true
    }
    if (response.ok) {
      const result = await response.json()
      if (result) {
        if (variant?.id && variant.id === result.id) {
          setIsFieldValidating(false)
          return true
        }
        message = 'Mã SKU đã tồn tại'
      }
    }
    setIsFieldValidating(false)
    return message ?? true
  }

  //   useEffect(() => {
  //     if (!debounceSKU) {
  //       setIsFieldValidating(false)
  //       return
  //     }
  //     checkSkuDB(debounceSKU)
  //   }, [debounceSKU])
  return (
    <FormControl
      mb='3'
      mt='3'
      isInvalid={!!(errors as any)?.sku}>
      <FormLabel>Mã SKU</FormLabel>
      <InputGroup>
        <InputLeftElement
          pointerEvents='none'
          color='gray.300'
          fontSize='1.2em'>
          $
        </InputLeftElement>
        <Input
          type='text'
          {...register('sku', {
            required: 'This field is required',
            onChange: (e) => {},
            validate: async (value) => {
              return await validateSKUExists(value)
              // cancel();
              // setCheckSku(null);
              // return (await cancellablePromise((res, rej) => {
              //     setIsFieldValidating(true);
              //     setCheckSku(value);
              //     console.log(
              //         "isFieldValidating inside promise",
              //         isFieldValidating,
              //     );
              //     if (!isFieldValidating) return res(true);
              // })) as any;
              // console.count("validate called");
              // return await new Promise(async (res) => {
              //     await new Promise((validatingRes) => {
              //         setIsFieldValidating(() => {
              //             setTimeout(validatingRes, 300);
              //             return true;
              //         });
              //     });
              //     setCheckSku(value);
              //     console.log(
              //         "isFieldValidating inside promise",
              //         isFieldValidating,
              //     );
              //     if (!isFieldValidating) return res(true);
              // });
            },
          })}
        />
        <InputRightElement>
          {isFieldValidating && (
            <Spinner
              size={'sm'}
              speed='0.5s'
              color='green.500'
            />
          )}
          {/* {formSta('sku').} */}

          {/* <CheckIcon color="green.500" /> */}
        </InputRightElement>
      </InputGroup>
      <FormErrorMessage>
        {(errors as any)?.sku?.message as string}
      </FormErrorMessage>
    </FormControl>
  )
}

VariantForm.Price = function Price() {
  const {
    action,
    formState: { errors },
    register,
    setValue,
    watch,
    variant,
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

VariantForm.SpecDefault = function Specification({}) {
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

  const productSpecs = product?.specifications ?? []
  useEffect(() => {
    if (action === 'edit') return

    const specifications = productSpecs
    console.log('useEffect spec ran')
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
  }, [product?.specifications])

  return (
    <>
      {!!productSpecs.length && (
        <div className=''>
          <FormLabel>Thông số mặc định</FormLabel>
          {/* {productSpecs.map(({ name, values }) => (
            <div key={name} className="flex gap-2">
              <p>{name}</p>
              <p>{values.map((val) => val.value).join('/ ')}</p>
            </div>
          ))} */}
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

  const isDisabled = false
  const { data: { data: namesData } = {} } = useCustom<string[]>({
    url: findDistinctNames,
    method: 'get',
    queryOptions: {
      enabled: !isDisabled && ENABLE_FETCHED,
    },
  })
  const nameOptions = useMemo(() => {
    console.count('usememo nameoptions ran')
    return (namesData && toArrayOptionString(namesData)) ?? []
  }, [namesData])

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
    console.log('index', index)
    setValue(
      `specificationGroup`,
      produce(getValues(`specificationGroup`) ?? [], (draft) => {
        draft.splice(index, 1)
      }),
    )
    remove(index)
    console.log('fields.length', fields.length)
  }

  const handleChange = (
    newValue: MultiValue<Option<string>>,
    meta: ActionMeta<Option<string>>,
  ) => {
    console.count('handle change ran')
    const { action, option, removedValue } = meta
    switch (action) {
      case 'select-option':
      case 'create-option':
        const label = (option as Option<string>).label.trim()
        onAppend(label)
        break
      case 'pop-value':
      case 'remove-value':
        const index = fields.findIndex(
          (field) => field.label === (removedValue as Option<string>).label,
        )
        onRemove(index)
    }
  }
  const productSpecs = useMemo(
    () => product?.specifications ?? [],
    [product?.specifications],
  )
  useEffect(() => {
    console.count('use layout effect specification product ran')
    if (action === 'edit') return
    const formSpecs = productSpecs
      ?.filter((item) => item.values.length > 1)
      .map((item) => item.name)
    const reset = () => {
      console.log('reset ran')
      resetField(`specificationGroup`, { defaultValue: [] })
      resetField(`specifications`, { defaultValue: [] })
      formSpecs.forEach((item) => onAppend(item, false))
    }
    reset()
  }, [productSpecs, action, resetField, onAppend])

  useEffect(() => {
    console.count('productSpecs triggered changed')
  }, [productSpecs])
  useEffect(() => {
    console.log('product triggered changed')
  }, [product])

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
      resetField(`specificationGroup`, {
        defaultValue: toArrayOptionString(formSpecs.map((item) => item.label)),
      })
      resetField(`specifications`, {
        defaultValue: formSpecs,
      })
    }, 0)
  }, [productSpecs, variantSpecs, action, resetField])
  return (
    <>
      <div>
        <button
          onClick={() => {
            resetField(`specifications`, {
              defaultValue: [],
            })
          }}>
          Hello there
        </button>

        <FormLabel>Thông số tuỳ chọn</FormLabel>
        <div className='border rounded-lg p-4'>
          <div className=''>
            <div className=''>
              <Controller
                render={({ field }) => (
                  <CreatableSelect
                    {...field}
                    options={nameOptions}
                    // isValidNewOption={(input, values, options) => {
                    //   console.log('isValidNew option ran')
                    //   const array = [...values, ...options].map(
                    //     (item) => item.label,
                    //   )
                    //   return isValidNewOption(input, array)
                    // }}
                    onChange={handleChange}
                    isDisabled={isDisabled}
                    isClearable={false}
                    isMulti
                  />
                )}
                name={`specificationGroup`}
                control={control}
              />
            </div>
            {!fields.length && (
              <>
                <div className='h-[300px] border flex items-center justify-center'>
                  <div
                    className='flex flex-col gap-2 items-center justify-center'
                    ref={buttonRef}>
                    <Inbox className=' w-28 h-28 text-gray-500' />
                    <p className=' text-muted-foreground text-sm'>
                      Không có dữ liệu
                    </p>
                  </div>
                </div>
              </>
            )}
            {!!fields.length && (
              <>
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
                      onRemove={onRemove.bind(null, idx)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
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

VariantForm.Specification.Row = function Row({ index, onRemove, name = '' }) {
  const { resource, findDistinctByName } = API['specifications']()
  const {
    action,
    control,
    getValues,
    setValue,
    formState: { errors },
    watch,
  } = useFormProvider()
  // const isDisabled = action === "edit";
  const isDisabled = false
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
    // console.count('useMemo spec option ran')
    return specsData.map(({ id, name, value }) =>
      toObjectOption(value, { id, name, value }),
    )
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
    <div className='flex border p-4 gap-2'>
      <div className='flex-grow grid grid-cols-3 gap-2'>
        <p>{name ?? ''}</p>
        <FormControl
          isInvalid={true}
          className='col-span-2'>
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
              // validate: (value) => {
              //     return !!value.length;
              // },
            }}
          />
          <FormErrorMessage>
            {JSON.stringify(errors.specifications?.[index]?.message)}
          </FormErrorMessage>
        </FormControl>
      </div>
      <div className='min-w-[50px]'>
        {!!onRemove && (
          <Button
            className=''
            onClick={onRemove}
            colorScheme='red'
            isDisabled={isDisabled}>
            <MinusCircle />
          </Button>
        )}
      </div>
    </div>
  )
}
