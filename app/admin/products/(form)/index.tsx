/** @format */

import { useForm } from '@refinedev/react-hook-form'
import React, {
  BaseSyntheticEvent,
  FormEvent,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  Text,
  Box,
  Textarea,
  Avatar,
  useConst,
  Slider,
  SliderMark,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Popover,
  ButtonGroup,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Switch,
  InputRightElement,
  InputGroup,
  Spinner,
  EditableInput,
  Editable,
  EditablePreview,
  useEditableControls,
  IconButton,
  forwardRef,
  EditableProps,
} from '@chakra-ui/react'
import {
  FirebaseImage,
  IBrand,
  ICategory,
  IProduct,
  IProductField,
  ISpecification,
  Option,
} from 'types'
import { PropsWithChildren } from 'react'
import SelectPopout from '@components/ui/SelectPopout'
import useListOption, { ListOptionProps } from '@/hooks/useListOption'
import { Controller, FieldArrayWithId, useFieldArray } from 'react-hook-form'
import {
  HttpError,
  OpenNotificationParams,
  useCustom,
  useCustomMutation,
} from '@refinedev/core'
import { Inbox, MinusCircle } from 'lucide-react'
import {
  toObjectOption,
  toArrayOptionString,
  isValidNewOption,
  toOptionString,
  cleanValue,
  toRecord,
} from '@/lib/utils'
import { useDialog } from '@components/ui/DialogProvider'
import CreatableSelect from 'react-select/creatable'
import Select, {
  GroupBase,
  MultiValueGenericProps,
  components,
} from 'react-select'
import { produce } from 'immer'
import InlineEditable from '@components/ui/InlineEditable'
import { ActionMeta, MultiValue } from 'react-select'
import ImageUpload, { UploadProviderProps } from '@components/image-upload'
import useUploadImage, { uploadUtils } from '@/hooks/useUploadImage'
import { API, REG_SLUG_PATTERN } from 'types/constants'
import { Create, Edit } from '@components/crud'
import { useRouter } from 'next/navigation'
import { errorNotification } from 'src/lib/notifications'
import { Tooltip, useColorModeValue } from '@chakra-ui/react'
import { QuestionIcon } from '@chakra-ui/icons'
import { ERRORS } from 'types/messages'
import useDebounceFn from '@/hooks/useDebounceFn'
import { validateProductNameExists, validateProductSlugExists } from './utils'
import useCrudNotification, {
  onError,
  onSuccess,
} from '@/hooks/useCrudNotification'
import { Badge } from '@components/ui/shadcn/badge'

type ContextProps = {
  action: 'create' | 'edit'
  product: IProduct | undefined
} & ReturnType<typeof useForm<IProduct, HttpError, IProductField>>
const FormContext = createContext<ContextProps | null>(null)
const useProductFormContext = () => {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error('EditProductFormContext.Provider is missing')
  }
  return {
    ...context,
  }
}
const ProductFormProvider = ({
  action,
  children,
}: PropsWithChildren<{ action: ContextProps['action'] }>) => {
  const {
    projection: { specifications: attributes },
  } = API['products']()
  const { push } = useRouter()
  const { uploadImages, removeImages } = useUploadImage({
    resource: 'products',
  })
  const formMethods = useForm<IProduct, HttpError, IProductField>({
    refineCoreProps: {
      meta: {
        query: {
          projection: attributes,
        },
      },
      redirect: false,
    },
    defaultValues: {
      features: [],
    },
    shouldFocusError: true,
  })
  const {
    handleSubmit,
    saveButtonProps,
    refineCore: {
      onFinish,
      queryResult: { data: { data: product } = { data: undefined } } = {},
    },
    reset,
    formState: { dirtyFields },
  } = formMethods

  useEffect(() => {
    if (product) {
      const { features, specifications, name, slug, summary, description } =
        product

      let formFeature
      if (features) {
        formFeature = features.map((item) => ({
          value: item,
        }))
      }
      reset({
        name,
        slug,
        summary,
        description,
        features: formFeature,
      })
    }
  }, [product, reset])

  const saveProps = {
    ...saveButtonProps,
    onClick: (e: BaseSyntheticEvent) => {
      handleSubmit(
        async ({
          brand,
          category,
          features,
          specifications,
          specificationGroup,
          id,
          images,
          files,
          ...value
        }) => {
          const handleFeatures = () =>
            !features || !features.length
              ? undefined
              : features.filter((item) => !!item).map(({ value }) => value)
          const handleSpecifications = () =>
            specifications &&
            specifications.map((item) => {
              const values = item?.options.map(({ value }) => ({
                ...value,
              }))
              return { name: item?.label, values }
            })

          const handleImages = async () => {
            const productImages = [...(product?.images ?? [])]

            const removed = () =>
              (images ?? [])
                .map((image, idx) =>
                  !image ? productImages.splice(idx, 1)[0] : null,
                )
                .filter((item) => !!item)
                .map((item) => item as FirebaseImage)
            const [uploadedUrls] = await Promise.all([
              uploadImages(files),
              dirtyFields.images && removeImages(removed()),
            ])

            return [...productImages, ...uploadedUrls.map(({ url }) => url)]
          }

          const handleFormSubmit = async () => {
            const brandId = dirtyFields.brand && brand && brand.value.id
            const categoryId =
              dirtyFields.category && category && category.value.id
            const formFeatures = dirtyFields.features && handleFeatures()
            const formSpecs =
              dirtyFields.specifications && handleSpecifications()
            const formImages = dirtyFields.files && (await handleImages())
            const formValues = Object.entries(value).reduce(
              (acc, [key, val]) => {
                const asKey = key as keyof typeof value
                if (dirtyFields[asKey]) acc[asKey] = val
                return acc
              },
              {} as { [key: string]: any },
            )

            const submitValues = {
              ...formValues,
              ...(brandId && { brand: { id: brandId } }),
              ...(categoryId && { category: { id: categoryId } }),
              ...(formFeatures && { features: formFeatures }),
              ...(formSpecs && { specifications: formSpecs }),
              ...(formImages && { images: formImages }),
            }
            console.log('submitValues', submitValues)
            return
            try {
              const result = await onFinish(submitValues as any)
              console.log('result', result)
            } catch (err) {
              console.log('Error in try catch onFinish', err)
            }
          }
          await handleFormSubmit()
        },
      )(e)
    },
  }
  return (
    <FormContext.Provider
      value={{
        ...formMethods,
        saveButtonProps: saveProps,
        action,
        product,
      }}>
      <ProductForm.Container>{children}</ProductForm.Container>
    </FormContext.Provider>
  )
}
const { countProductSold } = API['products']()

export const ProductForm = ({ action }: { action: ContextProps['action'] }) => {
  return (
    <ProductFormProvider action={action}>
      <ProductForm.Body />
    </ProductFormProvider>
  )
}

ProductForm.Container = function Container({ children }: PropsWithChildren) {
  const {
    action,
    product,
    refineCore: { formLoading },
    saveButtonProps,
  } = useProductFormContext()
  const { data: soldData } = useCustom({
    method: 'get',
    url: countProductSold(product?.id ?? ''),
    queryOptions: {
      enabled: !!product,
    },
  })
  const isEdit = action === 'edit'
  if (isEdit)
    return (
      <Edit
        isLoading={formLoading}
        saveButtonProps={saveButtonProps}
        canDelete={soldData && (soldData.data as unknown as number) == 0}>
        {children}
      </Edit>
    )

  return (
    <Create
      isLoading={formLoading}
      saveButtonProps={saveButtonProps}>
      {children}
    </Create>
  )
}

ProductForm.Body = function Body() {
  return (
    <>
      <div className='bg-white flex gap-5 min-h-[350px]'>
        <div className='w-1/3 grid gap-4 '>
          <div className='w-full min-w-1/3 mb-10'>
            <ProductForm.Images />
          </div>
        </div>
        <div className='flex-grow flex flex-col'>
          <ProductForm.Id />
          <ProductForm.Name />
          <ProductForm.Slug />
          <div className='flex mb-5 justify-around'>
            <ProductForm.Brand />
            <ProductForm.Category />
            <ProductForm.Discount />
          </div>
          <div className='flex'>
            <ProductForm.Status />
          </div>

          <div className='mt-10'>
            <ProductForm.Summary />
          </div>
        </div>
      </div>
      <div className=' space-y-4'>
        <ProductForm.Features />
        <ProductForm.Specifications />
        <ProductForm.Description />
      </div>
    </>
  )
}

ProductForm.Id = function Id() {
  const {
    register,
    formState: { errors },
    refineCore: { id },
  } = useProductFormContext()
  if (!id) return <></>
  return (
    <FormControl isInvalid={!!(errors as any)?.id}>
      <FormLabel>Id</FormLabel>
      <Input
        type='number'
        {...register('id')}
        value={id}
        isDisabled
      />
      <FormErrorMessage>
        {(errors as any)?.id?.message as string}
      </FormErrorMessage>
    </FormControl>
  )
}

ProductForm.Name = function Name() {
  const {
    register,
    formState: { errors },
    refineCore: { queryResult },
  } = useProductFormContext()
  const { onDefaultError } = useCrudNotification()
  const [validateDebounce, isChecking] = useDebounceFn(
    validateProductNameExists,
    300,
  )

  const { required } = ERRORS.products.name
  return (
    <FormControl
      mb='3'
      isInvalid={!!errors?.name}>
      <FormLabel>Tên</FormLabel>
      <InputGroup>
        <Input
          type='text'
          {...register('name', {
            required,
            validate: async (value) =>
              await validateDebounce(
                value,
                queryResult?.data?.data,
                onDefaultError,
              ),
            setValueAs: (value) => cleanValue(value),
          })}
        />
        <InputRightElement>
          {isChecking && <Spinner color='blue.600' />}
        </InputRightElement>
      </InputGroup>
      <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
    </FormControl>
  )
}

ProductForm.Slug = function Slug() {
  const {
    register,
    formState: { errors },
    refineCore: { queryResult },
  } = useProductFormContext()
  const { onDefaultError } = useCrudNotification()

  const [validateDebounce, isChecking] = useDebounceFn(
    validateProductSlugExists,
    300,
  )
  return (
    <FormControl isInvalid={!!errors?.slug}>
      <div className='flex items-center'>
        <FormLabel className='flex-shrink-0'>Đường dẫn (slug)</FormLabel>
        <QuestionIcon /> Tự động tạo bởi hệ thống nếu để trống
      </div>
      <InputGroup>
        <Input
          type='text'
          placeholder='ten-san-pham-viet-thuong-khong-dau'
          {...register('slug', {
            pattern: {
              value: REG_SLUG_PATTERN,
              message: 'Đường dẫn không hợp lệ',
            },
            validate: async (value) =>
              await validateDebounce(
                value,
                queryResult?.data?.data,
                onDefaultError,
              ),
            setValueAs: (value) => value?.trim(),
          })}
        />
        <InputRightElement>
          {isChecking && <Spinner color='blue.600' />}
        </InputRightElement>
      </InputGroup>

      <FormErrorMessage>{errors?.slug?.message}</FormErrorMessage>
    </FormControl>
  )
}

ProductForm.Summary = function Summary() {
  const {
    register,
    formState: { errors },
  } = useProductFormContext()
  return (
    <FormControl isInvalid={!!(errors as any)?.summary}>
      <FormLabel>Mô tả ngắn</FormLabel>
      <Textarea {...register('summary', {})} />
      <FormErrorMessage>
        {(errors as any)?.summary?.message as string}
      </FormErrorMessage>
    </FormControl>
  )
}
ProductForm.Brand = function Brand() {
  const { resource } = API['brands']()
  const { action, product, setValue } = useProductFormContext()
  const { id: brandId } = product?.brand ?? {}
  const toOption: ListOptionProps<IBrand>['toOption'] = useCallback(
    (item) => toObjectOption(item.name, item),
    [],
  )
  toOption.isCallback = true

  const { options } = useListOption<IBrand>({
    resource,
    pagination: {
      mode: 'off',
    },
    toOption: toOption,
    queryOptions: {
      enabled: action === 'create' || !!product,
    },
  })

  useEffect(() => {
    if (!brandId) {
      return
    }
    const selected = options.find((item) => item.value.id == +brandId)
    if (selected) setValue('brand', selected)
  }, [brandId, options, setValue])

  const { control } = useProductFormContext()
  return (
    <FormControl>
      <FormLabel>Thương hiệu</FormLabel>
      <SelectPopout
        controller={{
          name: 'brand',
          control,
        }}
        stateLabel={{
          defaultEmpty: `Chọn thương hiệu`,
        }}
        props={{
          options: options,
          noOptionsMessage: 'Không có nhãn hàng.',
          formatOptionLabel: (data) => {
            const {
              label,
              value: { image: logo },
            } = data as Option<IBrand>
            return (
              <Box
                display='flex'
                justifyContent='space-between'
                alignItems='center'>
                <Text noOfLines={2}>{label}</Text>
                <Avatar
                  ml='5'
                  size='sm'
                  variant='filled'
                  name={label}
                  src={logo ?? ''}
                />
              </Box>
            )
          },
        }}
      />
    </FormControl>
  )
}

ProductForm.Category = function Category() {
  const { resource } = API['categories']()
  const { action, product, control, setValue, getValues } =
    useProductFormContext()
  const { confirm } = useDialog()
  const toOption: ListOptionProps<ICategory>['toOption'] = useCallback(
    (item) => toObjectOption(item.name, item),
    [],
  )
  toOption.isCallback = true
  const { options } = useListOption<ICategory>({
    resource,
    pagination: {
      mode: 'off',
    },
    toOption: toOption,
    queryOptions: {
      enabled: action === 'create' || !!product,
    },
    errorNotification: errorNotification,
  })
  const { id: categoryId } = product?.category ?? {}
  const onChangeCategory = async (category: Option<ICategory>) => {
    const currentId = getValues(`category.value.id`)
    const currentSpecs = getValues(`specifications`)
    setValue(`category`, category, {
      shouldDirty: true,
      shouldTouch: true,
    })

    if (action === 'edit') return
    if (
      currentSpecs &&
      currentSpecs.length &&
      currentId &&
      currentId === category.value.id
    ) {
      return
    }
    const categorySpecs = category.value.specifications
    if (!categorySpecs) return
    const updateSpecs = async () => {
      if (currentSpecs && currentSpecs.length) {
        const result = await confirm({
          message:
            'Bạn có muốn cập nhật lại thông số kỹ thuật theo danh mục đã chọn?',
          header: 'Thay đổi thông số kỹ thuật theo danh mục',
        })
        if (!result.status) {
          return
        }
      }

      const formSpecs = categorySpecs.map((item) => ({
        label: item,
        options: [],
      }))
      setValue(`specificationGroup`, toArrayOptionString(categorySpecs))
      setValue(`specifications`, formSpecs)
    }
    updateSpecs()
  }

  useEffect(() => {
    if (!categoryId) {
      return
    }
    const selected = options.find((item) => item.value.id == categoryId)
    if (selected) setValue('category', selected)
  }, [categoryId, options, setValue])
  return (
    <FormControl>
      <FormLabel>Danh mục</FormLabel>
      <SelectPopout
        controller={{
          name: 'category',
          control,
        }}
        stateLabel={{
          defaultEmpty: `Chọn danh mục`,
        }}
        props={{
          options: options,
          noOptionsMessage: 'Không có danh mục.',
          onChange: (newValue) => {
            onChangeCategory(newValue as Option<ICategory>)
          },
        }}
      />
    </FormControl>
  )
}

ProductForm.Description = function Description() {
  const {
    register,
    formState: { errors },
  } = useProductFormContext()
  return (
    <FormControl
      mb='3'
      isInvalid={!!(errors as any)?.description}>
      <FormLabel>Bài đăng mô tả sản phẩm</FormLabel>
      <Textarea
        {...register('description')}
        h='224px'
      />
      <FormErrorMessage>
        {(errors as any)?.description?.message as string}
      </FormErrorMessage>
    </FormControl>
  )
}

ProductForm.Images = function Images() {
  const { setValue, getValues, product } = useProductFormContext()
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

  const initialUrls = useMemo(() => {
    const images = product?.images
    if (!images) return
    setValue(`images`, images)
    return images.map((image) => ({
      url: image,
      name: uploadUtils.getName('products', image),
    }))
  }, [product?.images, setValue])

  return (
    <ImageUpload
      initialUrls={initialUrls}
      onFilesChange={onFilesChange}
      onRemoveUrl={onUrlRemove}
    />
  )
}

const MultiValueLabel = ({
  data,
  selectProps,
  onInputBlur,
}: MultiValueGenericProps<Option<string>, true, GroupBase<Option<string>>> & {
  onInputBlur: (
    newValue: string,
    currentOption: Option<string>,
    values: Option<string>[],
  ) => void
}) => {
  const inputRef = useRef(data.value)
  useEffect(() => {
    console.log('data.value', data.value)
    inputRef.current = data.value
  }, [data.value])

  const handleOnBlur = (nextValue: string) => {
    const value = inputRef.current
    Array.isArray(selectProps.value) &&
      onInputBlur(value, data, selectProps.value)
  }

  return (
    <div>
      <ChakraEditable
        defaultValue={data.value}
        onKeyDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onBlur={handleOnBlur}
        onChange={(e) => (inputRef.current = e)}
      />
    </div>
  )
}

ProductForm.Specifications = function Specifications({}) {
  const { findDistinctNames } = API['specifications']()
  const { action, setValue, getValues, resetField, control, product, watch } =
    useProductFormContext()

  const buttonRef = useRef(null)

  const { fields, append, remove } = useFieldArray({
    name: 'specifications',
    control: control,
  })
  const isDisabled = action === 'edit'
  const { data: { data: namesData } = {} } = useCustom<string[]>({
    url: findDistinctNames,
    method: 'get',
    queryOptions: {
      enabled: !isDisabled,
    },
  })

  const nameOptions = useMemo(
    () => (namesData ? toArrayOptionString(namesData) : []),
    [namesData],
  )
  const onAppend = (value: string) => {
    setValue(
      `specificationGroup`,
      produce(getValues(`specificationGroup`) ?? [], (draft) => {
        draft.push(toOptionString(value))
      }),
    )
    append({
      label: value,
      options: [],
    })
  }
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

  const handleSelectChange = (
    onChange: (...event: any[]) => void,
    newValue: MultiValue<Option<string>>,
    meta: ActionMeta<Option<string>>,
  ) => {
    console.log('newValue, meta', newValue, meta)
    const { action, option, removedValue } = meta

    switch (action) {
      case 'select-option':
      case 'create-option':
        onAppend((option as Option<string>).label.trim())
        break
      case 'pop-value':
      case 'remove-value':
        const index = fields.findIndex(
          (field) => field.label === (removedValue as Option<string>).label,
        )
        onRemove(index)
    }
    onChange(newValue, meta)
  }

  const { updateName } = API['specifications']()
  const { mutateAsync } = useCustomMutation({})
  const onUpdateName = (
    newValue: string,
    currentOption: Option<string>,
    values: Option<string>[],
  ) => {
    const value = cleanValue(currentOption.value)
    const cleanNewValue = cleanValue(newValue)
    const updateNameDBHandler = async (newValues: Option<string>[]) => {
      !currentOption.__isNew__ &&
        (await mutateAsync(
          {
            url: updateName(value, cleanNewValue),
            method: 'patch',
            values: {},
            errorNotification: onError,
            successNotification: onSuccess,
          },
          {
            onSuccess: () => {},
          },
        ))
      setValue(`specificationGroup`, newValues)
    }

    if (value === cleanNewValue) return
    const record = toRecord(values, 'label' as keyof Option<string>)
    const key = value as keyof Option<string>
    if (!cleanNewValue)
      return (
        delete record[key] &&
        setValue(`specificationGroup`, Object.values(record))
      )

    record[key] = toOptionString(cleanNewValue)
    updateNameDBHandler(Object.values(record))
  }

  //reset form when product is fetched
  useEffect(() => {
    console.warn('Change product specification use effect')
    const specs = product?.specifications
    if (!specs) return
    const formSpecs = specs.map((spec) => ({
      label: spec.name,
      options: spec.values.map((value) => toObjectOption(value.value, value)),
    }))
    console.log('formSpecs', formSpecs)
    setTimeout(() => {
      resetField(`specifications`, {
        defaultValue: formSpecs,
      })
      resetField(`specificationGroup`, {
        defaultValue: toArrayOptionString(formSpecs.map((item) => item.label)),
      })
    }, 300)
  }, [product, resetField])
  return (
    <>
      <FormLabel>Thông số kỹ thuật</FormLabel>
      <div className='border rounded-lg p-4'>
        <div className=''>
          <div className=''>
            {/* <CreatableSelect
              ref={selectRef}
              components={{ MultiValueLabel }}
              value={selectOptions}
              onChange={(newValues) => {
                setSelectOptions(newValues)
              }}
              isMulti
              isClearable={false}
              options={nameOptions}
              styles={{
                multiValue(base, props) {
                  return {
                    ...base,
                    backgroundColor: '#f3f4f6',
                    //   backgroundColor: 'transparent',
                  }
                },
              }}
              isOptionSelected={(value, options) =>
                options.some((item) => item.value === value.value)
              }
            /> */}
            <Controller
              render={({ field }) => (
                <>
                  <CreatableSelect
                    components={{
                      MultiValueLabel: (props) => (
                        <MultiValueLabel
                          {...props}
                          onInputBlur={onUpdateName}
                        />
                      ),
                    }}
                    ref={field.ref}
                    value={field.value}
                    isMulti
                    isClearable={false}
                    options={nameOptions}
                    onChange={handleSelectChange.bind(null, field.onChange)}
                    styles={{
                      multiValue(base, props) {
                        return {
                          ...base,
                          backgroundColor: '#f3f4f6',
                        }
                      },
                    }}
                    isOptionSelected={(value, options) =>
                      options.some((item) => item.value === value.value)
                    }
                  />
                  {JSON.stringify(field.value)}
                </>
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
                  <ProductForm.Specifications.Row
                    key={field.id}
                    index={idx}
                    field={field}
                    onRemove={onRemove.bind(null, idx)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
} as React.FC & {
  Row: React.FC<{
    index: number
    field?: FieldArrayWithId<IProductField, 'specifications', 'id'>
    onRemove: () => void
  }>
}

type SpecOption = Option<ISpecification>

ProductForm.Specifications.Row = function SpecificationRow({
  index,
  onRemove: onRemoveRow,
  field: rowField,
}) {
  const { resource, findDistinctByName } = API['specifications']()
  const {
    action,
    control,
    getValues,
    setValue,
    formState: { errors },
    watch,
  } = useProductFormContext()
  const isDisabled = action === 'edit'

  //fetch spec values by name
  const { data: { data } = {} } = useCustom<ISpecification[]>({
    url: findDistinctByName(rowField?.label ?? ''),
    method: 'get',
    queryOptions: {
      enabled: !isDisabled,
    },
    meta: {
      resource,
    },
  })

  const options = useMemo(
    () => data?.map((item) => toObjectOption(item.value, item)) ?? [],
    [data],
  )

  const getName = () => {
    return getValues(`specifications.${index}.label`)
  }

  const append = (input: string) => {
    console.log('on create new option')
    const updated = produce(
      getValues(`specifications.${index}.options`),
      (draft) => {
        draft.push({
          label: input,
          value: {
            name: getName(),
            value: input,
          },
        })
      },
    )
    setValue(`specifications.${index}.options`, updated)
  }

  const groupNames = watch(`specificationGroup`)

  return (
    <div className='flex border p-4 gap-2'>
      <div className='flex-grow grid grid-cols-3 gap-2'>
        {/* <Controller
          name={`specificationGroup.${index}.label`}
          control={control}
          render={({ field }) => (
            <Editable
              {...field}
              onChange={(nextValue) => {
                setValue(`specificationGroup.${index}`, {
                  label: nextValue,
                  value: nextValue,
                })
              }}>
              <EditablePreview />
              <EditableInput />
            </Editable>
          )}
        /> */}
        <p>{groupNames?.[index]?.label}</p>

        {/* <p>{rowField?.label ?? getName()}</p> */}
        <FormControl
          isInvalid={!!errors.specifications?.[index]?.options}
          className='col-span-2'>
          <Controller
            name={
              `specifications.${index}.options` as `specifications.0.options`
            }
            control={control}
            render={({ field }) => (
              <CreatableSelect
                {...field}
                isMulti
                isDisabled={isDisabled}
                options={options}
                menuPosition='fixed'
                // onChange={handleChange}
                onCreateOption={append}
                isOptionSelected={(option, selected) => {
                  return selected.some((item) => item.label === option.label)
                }}
                isValidNewOption={(input, values, options) => {
                  const array = [...values, ...options].map(
                    (item) => item.label,
                  )
                  return isValidNewOption(input, array)
                }}
              />
            )}
            rules={{
              required: true,
              validate: (value) => {
                return !!value.length
              },
            }}
          />
          <FormErrorMessage>
            {errors.specifications?.[index]?.options?.message}
          </FormErrorMessage>
        </FormControl>
      </div>
      <div className='min-w-[50px]'>
        <Button
          className=''
          onClick={onRemoveRow}
          colorScheme='red'
          isDisabled={isDisabled}>
          <MinusCircle />
        </Button>
      </div>
    </div>
  )
}

ProductForm.Features = function Features() {
  const { product, control, reset } = useProductFormContext()

  const { fields, remove, prepend, append } = useFieldArray({
    control,
    name: 'features',
  })

  const addFeatureHandler = (e: FormEvent) => {
    e.preventDefault()
    if (!inputRef.current) {
      throw new Error('Input is missing')
    }
    append({ value: inputRef.current.value })
    inputRef.current.value = ''
  }
  const deleteFeatureHandler = (idx: number) => {
    remove(idx)
  }
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <>
      <Box>
        <FormLabel>Tính năng nổi bật</FormLabel>
        <Box
          pos='relative'
          className='min-h-[200px] rounded-lg border flex flex-col gap-2'>
          <div>
            <form onSubmit={addFeatureHandler}>
              <Input
                type='text'
                ref={inputRef}
                placeholder='Thêm tính năng nổi bật 🌟'
                required
              />
            </form>
          </div>
          <div className='max-h-[400px] overflow-scroll'>
            {fields.map((feat, idx) => {
              // <div className="bg-blue-500 text-white">
              return (
                <Controller
                  key={feat.id}
                  render={({ field, fieldState, formState }) => (
                    <>
                      <InlineEditable
                        editableProps={{
                          placeholder: 'Thêm tính năng nổi bật 🌟',
                          defaultValue: field.value,
                          size: 'sm',
                          pr: '8',
                          ...field,
                        }}
                        inputProps={{
                          size: 'sm',
                        }}
                        remove={deleteFeatureHandler.bind(this, idx)}
                        value={field.value}
                      />
                      <hr className='mx-8' />
                    </>
                  )}
                  name={`features.${idx}.value` as const}
                  control={control}
                />
              )
            })}
          </div>
          {/* <IconButton
                    onClick={addFeatureHandler}
                    icon={<PlusCircle />}
                    aria-label="Add new feature button"
                /> */}
        </Box>
      </Box>
    </>
  )
}

ProductForm.Active = function ProductActive() {
  const { register } = useProductFormContext()
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

ProductForm.Status = function ProductStatus() {
  const { watch, control } = useProductFormContext()
  const { findProductStatus } = API['products']()
  const { data: { data: statuses } = {} } = useCustom<string[]>({
    url: findProductStatus,
    method: 'get',
  })
  return (
    <FormControl>
      <FormLabel>Trạng thái</FormLabel>
      <div className='grid grid-cols-3 gap-2'>
        <div className='w-[90%]'>
          <Select options={statuses} />
        </div>
        <ProductForm.Active />
      </div>
    </FormControl>
  )
}

ProductForm.Discount = function Discount() {
  return (
    <FormControl>
      <FormLabel>Giảm giá</FormLabel>
      <WalkthroughPopover />
    </FormControl>
  )
}

function WalkthroughPopover() {
  const { watch } = useProductFormContext()
  const initialFocusRef = React.useRef(null)
  const discount = watch(`discount`)
  return (
    <Popover
      initialFocusRef={initialFocusRef}
      placement='bottom'
      closeOnBlur={true}>
      <PopoverTrigger>
        <Button minW={'100px'}>{discount ?? 0}%</Button>
      </PopoverTrigger>
      <PopoverContent
        color='white'
        bg='blue.800'
        borderColor='blue.800'>
        <PopoverHeader
          pt={4}
          fontWeight='bold'
          border='0'>
          Điểu chỉnh giảm giá
        </PopoverHeader>
        <PopoverArrow bg='blue.800' />
        <PopoverCloseButton />
        <PopoverBody>
          <SliderThumbWithTooltip />
        </PopoverBody>
        <PopoverFooter
          border='0'
          display='flex'
          alignItems='center'
          justifyContent='flex-end'
          pb={4}></PopoverFooter>
      </PopoverContent>
    </Popover>
  )
}

function SliderThumbWithTooltip() {
  const { control, watch, getValues } = useProductFormContext()

  const [showTooltip, setShowTooltip] = React.useState(false)
  return (
    <Controller
      name='discount'
      control={control}
      render={({ field }) => (
        <Slider
          id='slider'
          min={0}
          max={100}
          colorScheme='teal'
          ref={field.ref}
          value={field.value ?? 0}
          onChange={field.onChange}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}>
          {[25, 50, 75].map((item) => (
            <SliderMark
              key={item}
              value={item}
              mt='1'
              ml='-2.5'
              fontSize='sm'>
              {`${item}%`}
            </SliderMark>
          ))}

          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <Tooltip
            hasArrow
            bg='teal.500'
            color='white'
            placement='top'
            isOpen={showTooltip}
            label={`${field.value ?? 0}%`}>
            <SliderThumb />
          </Tooltip>
        </Slider>
      )}
    />
  )
}

const ChakraEditable = forwardRef<EditableProps, 'div'>((props, ref) => (
  <Editable
    ref={ref}
    defaultValue='Rasengan ⚡️'
    isPreviewFocusable={true}
    selectAllOnFocus={false}
    {...props}>
    <Tooltip
      label='Click to edit'
      shouldWrapChildren={true}>
      <EditablePreview
        py={2}
        px={4}
        _hover={{
          background: useColorModeValue('gray.100', 'gray.700'),
        }}
      />
    </Tooltip>
    <Input
      py={2}
      px={4}
      as={EditableInput}
    />
    {/* <EditableControls /> */}
  </Editable>
))

function EditableControls() {
  const {
    isEditing,
    getSubmitButtonProps,
    getCancelButtonProps,
    getEditButtonProps,
  } = useEditableControls()

  // return isEditing ? (
  //   <ButtonGroup
  //     justifyContent='end'
  //     size='sm'
  //     w='full'
  //     spacing={2}
  //     mt={2}>
  //     <IconButton
  //       icon={<CheckIcon />}
  //       {...getSubmitButtonProps()}
  //     />
  //     <IconButton
  //       icon={<CloseIcon boxSize={3} />}
  //       {...getCancelButtonProps()}
  //     />
  //   </ButtonGroup>
  // ) : null
}
