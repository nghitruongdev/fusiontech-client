import { useForm } from '@refinedev/react-hook-form'
import React, {
  FormEvent,
  createContext,
  useCallback,
  useContext,
  useEffect,
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
import useListOption from '@/hooks/useListOption'
import { Controller, FieldArrayWithId, useFieldArray } from 'react-hook-form'
import { HttpError, useCustom } from '@refinedev/core'
import { Inbox, MinusCircle } from 'lucide-react'
import {
  toObjectOption,
  toArrayOptionString,
  isValidNewOption,
} from '@/lib/utils'
import { useDialog } from '@components/ui/DialogProvider'
import CreatableSelect from 'react-select/creatable'
import { produce } from 'immer'
import InlineEditable from '@components/ui/InlineEditable'
import { ActionMeta, MultiValue } from 'react-select'
import ImageUpload, { UploadProviderProps } from '@components/image-upload'
import useUploadImage from '@/hooks/useUploadImage'
import { API } from 'types/constants'
import { Create, Edit } from '@components/crud'

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
    },
    defaultValues: {
      features: [],
    },
    shouldFocusError: true,
  })
  const {
    handleSubmit,
    saveButtonProps,
    refineCore: { queryResult, onFinish },
    reset,
    formState: { dirtyFields },
  } = formMethods

  useEffect(() => {
    const product = queryResult?.data?.data
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
  }, [queryResult?.data?.data, reset])

  const product = queryResult?.data?.data

  const saveProps = {
    ...saveButtonProps,
    onClick: () => {
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

            return [...productImages, ...uploadedUrls]
          }

          const handleFormSubmit = async () => {
            const brandId = dirtyFields.brand && brand && brand.value.id
            const categoryId =
              dirtyFields.category && category && category.value.id
            const formFeatures = dirtyFields.features && handleFeatures()
            const formSpecs =
              dirtyFields.specifications && handleSpecifications()
            const formImages = dirtyFields.files && (await handleImages())
            console.log('formImages', formImages)
            const formValues = Object.entries(value).reduce(
              (acc, [key, val]) => {
                const asKey = key as keyof typeof value
                if (dirtyFields[asKey]) acc[asKey] = val
                return acc
              },
              {} as typeof value,
            )

            const submitValues = {
              ...formValues,
              ...(brandId && { brand: { id: brandId } }),
              ...(categoryId && { category: { id: categoryId } }),
              ...(formFeatures && { features: formFeatures }),
              ...(formSpecs && { specifications: formSpecs }),
              ...(formImages && { images: formImages }),
            }

            try {
              onFinish(submitValues as any)
              console.log('result', submitValues)
            } catch (err) {
              console.log(err)
            }
          }
          await handleFormSubmit()
        },
      )()
    },
  }
  return (
    <FormContext.Provider
      value={{
        ...formMethods,
        saveButtonProps: saveProps,
        action,
        product,
      }}
    >
      <ProductForm.Container>{children}</ProductForm.Container>
    </FormContext.Provider>
  )
}
const { countProductSold } = API['products']()

export const ProductForm = ({ action }: { action: ContextProps['action'] }) => {
  return (
    <ProductFormProvider action={action}>
      <div className="bg-white flex gap-5 min-h-[350px]">
        <div className="w-1/3 grid gap-4 ">
          <div className="w-full min-w-1/3 mb-10">
            <ProductForm.Images />
          </div>
        </div>
        <div className="flex-grow flex flex-col">
          <ProductForm.Id />
          <ProductForm.Name />
          <ProductForm.Slug />
          <div className="flex">
            <ProductForm.Brand />
            <ProductForm.Category />
          </div>
          <ProductForm.Summary />
        </div>
      </div>
      <div className=" space-y-4">
        <ProductForm.Features />
        <ProductForm.Specifications />
        <ProductForm.Description />
      </div>
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
        canDelete={soldData && (soldData.data as unknown as number) == 0}
      >
        {children}
      </Edit>
    )

  return (
    <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
      {children}
    </Create>
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
    <FormControl mb="5" isInvalid={!!(errors as any)?.id}>
      <Text
        top="-15px"
        left="5px"
        p="0 12px"
        bg="#fff"
        transformOrigin="top left"
        transition="all .2s ease-out"
        color="#999"
        pointerEvents="none"
        pos="absolute"
        w="fit-content"
        h="fit-content"
        zIndex="2"
      >
        Id
      </Text>
      <Input type="number" {...register('id')} value={id} isDisabled />
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
  } = useProductFormContext()

  return (
    <Box mb="10">
      <Box pos="relative">
        <FormControl mb="3" isInvalid={!!(errors as any)?.name}>
          <Text
            top="-15px"
            left="5px"
            p="0 12px"
            bg="#fff"
            transformOrigin="top left"
            transition="all .2s ease-out"
            color="#999"
            pointerEvents="none"
            pos="absolute"
            w="fit-content"
            h="fit-content"
            zIndex="2"
          >
            Tên:
          </Text>
          <Input
            type="text"
            {...register('name', {
              required: 'This field is required',
            })}
            w="100%" // Thêm thuộc tính w="100%" để làm cho phần input dài ra
          />
          <FormErrorMessage>
            {(errors as any)?.name?.message as string}
          </FormErrorMessage>
        </FormControl>
      </Box>
    </Box>
  )
}

ProductForm.Slug = function Slug() {
  const {
    register,
    formState: { errors },
  } = useProductFormContext()

  return (
    <Box mb="10">
      <Box pos="relative">
        <FormControl mb="3" isInvalid={!!(errors as any)?.name}>
          <Text
            top="-15px"
            left="5px"
            p="0 12px"
            bg="#fff"
            transformOrigin="top left"
            transition="all .2s ease-out"
            color="#999"
            pointerEvents="none"
            pos="absolute"
            w="fit-content"
            h="fit-content"
            zIndex="2"
          >
            Đường dẫn (slug)
          </Text>
          <Input
            type="text"
            {...register('slug', {
              required: 'This field is required',
            })}
            w="100%" // Thêm thuộc tính w="100%" để làm cho phần input dài ra
          />
          <FormErrorMessage>
            {(errors as any)?.name?.message as string}
          </FormErrorMessage>
        </FormControl>
      </Box>
    </Box>
  )
}

ProductForm.Summary = function Summary() {
  const {
    register,
    formState: { errors },
  } = useProductFormContext()

  return (
    <div className="">
      <Box pos="relative">
        <FormControl mb="3" isInvalid={!!(errors as any)?.summary}>
          <Text
            top="-15px"
            left="5px"
            p="0 12px"
            bg="#fff"
            transformOrigin="top left"
            transition="all .2s ease-out"
            color="#999"
            pointerEvents="none"
            pos="absolute"
            w="fit-content"
            h="fit-content"
            zIndex="2"
          >
            Mô tả sản phẩm
          </Text>
          <Textarea
            {...register('summary', {
              required: 'This field is required',
            })}
            // h="269px"
          />
          <FormErrorMessage>
            {(errors as any)?.summary?.message as string}
          </FormErrorMessage>
        </FormControl>
      </Box>
    </div>
  )
}

ProductForm.Brand = function Brand() {
  const { resource } = API['brands']()
  const { action, product, setValue } = useProductFormContext()

  const { options } = useListOption<IBrand>({
    resource,
    pagination: {
      mode: 'off',
    },
    toOption: (item) => toObjectOption(item.name, item),
    queryOptions: {
      enabled: action === 'create' || !!product,
    },
  })

  useEffect(() => {
    const brandId = product?.brand?.id
    if (!brandId) {
      return
    }
    const selected = options.find((item) => item.value.id == +brandId)
    if (selected) setValue('brand', selected)
  }, [product?.brand?.id, options, setValue])

  const { control } = useProductFormContext()
  return (
    <Box mb="10">
      <Box pos="relative">
        <Text
          top="-25px"
          left="-10px"
          p="0 12px"
          // bg="#fff"
          transformOrigin="top left"
          transition="all .2s ease-out"
          color="#999"
          pointerEvents="none"
          pos="absolute"
          w="fit-content"
          h="fit-content"
          zIndex="2"
        >
          Thương hiệu:
        </Text>
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
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Text noOfLines={2}>{label}</Text>
                  <Avatar
                    ml="5"
                    size="sm"
                    variant="filled"
                    name={label}
                    src={logo?.url}
                  />
                </Box>
              )
            },
          }}
        />
      </Box>
    </Box>
  )
}

ProductForm.Category = function Category() {
  const { resource } = API['categories']()
  const { action, product, control, setValue, getValues } =
    useProductFormContext()
  const { confirm } = useDialog()
  const { options } = useListOption<ICategory>({
    resource,
    pagination: {
      mode: 'off',
    },
    toOption: (item) => toObjectOption(item.name, item),
    queryOptions: {
      enabled: action === 'create' || !!product,
    },
  })

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
    const id = product?.category?.id
    if (!id) {
      return
    }
    const selected = options.find((item) => item.value.id == id)
    if (selected) setValue('category', selected)
  }, [product?.category?.id, options, setValue])
  return (
    <>
      <Box mb="10" ml="10">
        <Box pos="relative">
          <Text
            top="-25px"
            left="-10px"
            p="0 12px"
            // bg="#fff"
            transformOrigin="top left"
            transition="all .2s ease-out"
            color="#999"
            pointerEvents="none"
            pos="absolute"
            w="fit-content"
            h="fit-content"
            zIndex="2"
          >
            Danh mục:
          </Text>

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
        </Box>
      </Box>
    </>
  )
}

ProductForm.Description = function Description() {
  const {
    register,
    formState: { errors },
  } = useProductFormContext()
  return (
    <Box>
      <Box pos="relative">
        <FormControl mb="3" isInvalid={!!(errors as any)?.description}>
          <Text
            top="-15px"
            left="5px"
            p="0 12px"
            bg="#fff"
            transformOrigin="top left"
            transition="all .2s ease-out"
            color="#999"
            pointerEvents="none"
            pos="absolute"
            w="fit-content"
            h="fit-content"
            zIndex="2"
          >
            Bài đăng
          </Text>

          <Textarea
            {...register('description', {
              required: 'This field is required',
            })}
            h="224px"
          />
          <FormErrorMessage>
            {(errors as any)?.description?.message as string}
          </FormErrorMessage>
        </FormControl>
      </Box>
    </Box>
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

  useEffect(() => {
    const images = product?.images
    if (!images) return
    setValue(`images`, images)
  }, [product?.images, setValue])
  return (
    <ImageUpload
      initialUrls={product?.images}
      onFilesChange={onFilesChange}
      onRemoveUrl={onUrlRemove}
    />
  )
}

ProductForm.Specifications = function Specifications({}) {
  const { findDistinctNames } = API['specifications']()
  const { action, setValue, getValues, resetField, control, product } =
    useProductFormContext()

  const buttonRef = useRef(null)

  const { fields, append, remove } = useFieldArray({
    name: 'specifications',
    control: control,
  })
  const isDisabled = action === 'edit'
  const [nameOptions, setNameOptions] = useState<Option<string>[]>([])
  const { data: { data: namesData } = {} } = useCustom<string[]>({
    url: findDistinctNames,
    method: 'get',
    queryOptions: {
      enabled: !isDisabled,
    },
  })
  useEffect(() => {
    if (!namesData) return
    setNameOptions(toArrayOptionString(namesData))
  }, [namesData])

  const onAppend = (value: string) => {
    setValue(
      `specificationGroup`,
      produce(getValues(`specificationGroup`) ?? [], (draft) => {
        draft.push({
          label: value,
          value: value,
        })
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

  const handleChange = (
    newValue: MultiValue<Option<string>>,
    meta: ActionMeta<Option<string>>,
  ) => {
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
  }

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
      <div className="border rounded-lg p-4">
        <div className="">
          <div className="">
            <Controller
              render={({ field }) => (
                <CreatableSelect
                  {...field}
                  options={nameOptions}
                  isValidNewOption={(input, values, options) => {
                    const array = [...values, ...options].map(
                      (item) => item.label,
                    )
                    return isValidNewOption(input, array)
                  }}
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
              <div className="h-[300px] border flex items-center justify-center">
                <div
                  className="flex flex-col gap-2 items-center justify-center"
                  ref={buttonRef}
                >
                  <Inbox className=" w-28 h-28 text-gray-500" />
                  <p className=" text-muted-foreground text-sm">
                    Không có dữ liệu
                  </p>
                </div>
              </div>
            </>
          )}
          {!!fields.length && (
            <>
              <div className="header flex">
                <p className="flex-grow">Tên thông số</p>
                <p className="flex-grow">Chi tiết</p>
              </div>
              <div className="body flex flex-col">
                {fields.map((field, idx) => (
                  // <SpecificationRow
                  //   key={field.id}
                  //   index={idx}
                  //   field={field}
                  //   onRemove={onRemove.bind(null, idx)}
                  // />
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

        {/* <Button colorScheme="blackAlpha" onClick={onAppend}>
                        <Plus />
                    </Button> */}
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

ProductForm.Specifications.Row = function SpecificationRow({
  index,
  onRemove,
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

  const [options, setOptions] = useState<Option<ISpecification>[]>([])
  const { data: { data: data } = {} } = useCustom<ISpecification[]>({
    url: findDistinctByName(rowField?.label ?? ''),
    method: 'get',
    queryOptions: {
      enabled: !isDisabled,
    },
    meta: {
      resource,
    },
  })
  useEffect(() => {
    if (!data) return
    setOptions(
      data.map(({ id, name, value }) =>
        toObjectOption(name, { id, name, value }),
      ),
    )
  }, [data])

  const getName = () => {
    return getValues(`specifications.${index}.label`)
  }

  const append = (input: string) => {
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

  return (
    <div className="flex border p-4 gap-2">
      <div className="flex-grow grid grid-cols-3 gap-2">
        <p>{rowField?.label ?? getName()}</p>
        <FormControl isInvalid={true} className="col-span-2">
          <Controller
            render={({ field }) => (
              <CreatableSelect
                {...field}
                isMulti
                isDisabled={isDisabled}
                // onChange={handleOnChange}
                options={options}
                menuPosition="fixed"
                onCreateOption={append}
              />
            )}
            name={
              `specifications.${index}.options` as `specifications.0.options`
            }
            control={control}
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
      <div className="min-w-[50px]">
        <Button
          className=""
          onClick={onRemove}
          colorScheme="red"
          isDisabled={isDisabled}
        >
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
          pos="relative"
          className="min-h-[200px] rounded-lg border flex flex-col gap-2"
        >
          <div>
            <form onSubmit={addFeatureHandler}>
              <Input
                type="text"
                ref={inputRef}
                placeholder="Thêm tính năng nổi bật 🌟"
                required
              />
            </form>
          </div>
          <div className="max-h-[400px] overflow-scroll">
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
                      <hr className="mx-8" />
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
