'use client'

import { HttpError, useCustom, useOne } from '@refinedev/core'
import { Create, Edit } from '@refinedev/chakra-ui'
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Image,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Heading,
  SkeletonText,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Spinner,
} from '@chakra-ui/react'
import { useForm } from '@refinedev/react-hook-form'
import { useRouter, useSearchParams } from 'next/navigation'
import React, {
  createContext,
  useContext,
  useEffect,
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
import {
  Controller,
  FieldArrayWithId,
  UseFieldArrayReturn,
  useFieldArray,
} from 'react-hook-form'
import { Inbox, MinusCircle } from 'lucide-react'
import { API, API_URL } from 'types/constants'
import useListOption from '@/hooks/useListOption'
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
import { join } from 'path'
import ImageUpload, { UploadProviderProps } from '@components/image-upload'
import useUploadImage from '@/hooks/useUploadImage'

const productResource = API.products()
const variantResource = API.variants()

type FormProps = {
  action: 'create' | 'edit'
}

export const VariantForm = ({ action }: FormProps) => {
  return (
    <ContextProvider action={action}>
      <div className="grid grid-cols-3 gap-4">
        <div className=" border-r">
          <VariantForm.Images />
        </div>
        <div className=" col-span-2">
          <VariantForm.Product />
          <Heading as="h5">Tên sản phẩm</Heading>
          <>Lorem ipsum dolor, sit amet consectetur adipisicing elit.</>
          <VariantForm.SKU />
          <VariantForm.Price />
          {/* <VariantForm.Options /> */}
          <VariantForm.Specification />
          <Heading as="h5">Mô tả</Heading>
          <>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit.
            Consequatur laborum, quisquam deserunt, ad commodi ab aspernatur
            repellat in dicta quae reiciendis est quia, suscipit minus ducimus
            ipsum sunt praesentium. Ratione!
          </>
        </div>
      </div>
    </ContextProvider>
  )
}

type ContextProps = {
  productResponse: ReturnType<typeof useOne<IProduct>>
  imagesField?: UseFieldArrayReturn<IVariantField, 'images', 'id'>
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

const ContextProvider = ({
  children,
  ...props
}: PropsWithChildren<FormProps>) => {
  const searchParams = useSearchParams()
  const paramProductId = searchParams.get('productId')
  const router = useRouter()
  const { uploadImages, removeImages } = useUploadImage({ type: 'variants' })
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
    refineCore: { onFinish, queryResult },
  } = formMethods
  const imagesField = useFieldArray({
    control,
    name: 'images',
  })
  const variant = queryResult?.data?.data
  const productId =
    variant?.product?.id ?? paramProductId ?? watch('product')?.value.id

  const productResponse = useOne<IProduct>({
    resource: productResource.resource,
    id: +productId,
    queryOptions: {
      enabled: !!productId,
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

VariantForm.Container = ({ children }: PropsWithChildren) => {
  const {
    action,
    formState: { isLoading },
    saveButtonProps,
  } = useFormProvider()
  const isCreate = action === 'create'
  const isEdit = action === 'edit'

  if (isCreate)
    return (
      <Create isLoading={isLoading} saveButtonProps={saveButtonProps}>
        {children}
      </Create>
    )
  if (isEdit)
    return (
      <Edit isLoading={isLoading} saveButtonProps={saveButtonProps}>
        {children}
      </Edit>
    )
}

VariantForm.Product = () => {
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

  const { options } = useListOption<IProduct>({
    toOption: (item) => ({ label: item.name, value: item }),
    resource: productResource.resource,
    pagination: {
      mode: 'off',
    },
    queryOptions: {
      enabled: !inputDisabled,
    },
  })
  useEffect(() => {
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
  }, [product, options])
  return (
    <>
      <FormControl isInvalid={!!errors.product}>
        <p>Sản phẩm</p>

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

VariantForm.SKU = () => {
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

  useEffect(() => {
    if (!debounceSKU) {
      setIsFieldValidating(false)
      return
    }
    checkSkuDB(debounceSKU)
  }, [debounceSKU])
  return (
    <FormControl mb="3" isInvalid={!!(errors as any)?.sku}>
      <FormLabel>Mã SKU</FormLabel>
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          color="gray.300"
          fontSize="1.2em"
        >
          $
        </InputLeftElement>
        <Input
          type="text"
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
            <Spinner size={'sm'} speed="0.5s" color="green.500" />
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

VariantForm.Price = () => {
  const {
    formState: { errors },
    register,
  } = useFormProvider()

  return (
    <FormControl mb="3" isInvalid={!!(errors as any)?.price}>
      <FormLabel>Giá tiền</FormLabel>
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          color="gray.300"
          fontSize="1.2em"
        >
          $
        </InputLeftElement>

        <Input
          type="number"
          {...register('price', {
            required: 'This field is required',
            valueAsNumber: true,
            validate: (v) => v > 0 || 'Giá tiền không được nhỏ hơn 0',
          })}
        />
      </InputGroup>

      <FormErrorMessage>
        {(errors as any)?.price?.message as string}
      </FormErrorMessage>
    </FormControl>
  )
}

VariantForm.Images = () => {
  const { setValue, variant } = useFormProvider()

  const onFilesChange: UploadProviderProps['onFilesChange'] = (files) => {
    setValue(`files`, files, {
      shouldDirty: true,
    })
  }
  const onUrlRemove: UploadProviderProps['onRemoveUrl'] = (index) => {
    setValue(`images.${index}`, null, {
      shouldDirty: true,
    })
    console.warn('have not implement delete image url')
  }
  const images = variant?.images
  useEffect(() => {
    if (!images) return
    setValue(`images`, images)
  }, [variant?.images])
  return (
    <ImageUpload
      initialUrls={variant?.images}
      onFilesChange={onFilesChange}
      onRemoveUrl={onUrlRemove}
    />
  )
}

// function ViewMoreImageModal() {
//     const { isOpen, onOpen, onClose } = useDisclosure();
//     const {
//         imagesField: { fields, remove },
//     } = useFormContextProvider();
//     return (
//         <>
//             <Button onClick={onOpen}>....</Button>
//             <Modal isOpen={isOpen} onClose={onClose} size="lg">
//                 <ModalOverlay />
//                 <ModalContent>
//                     <ModalHeader>Hình ảnh sản phẩm</ModalHeader>
//                     <ModalCloseButton />
//                     <ModalBody>
//                         <div className="flex gap-2 flex-wrap">
//                             {fields.map(({ id, image }) => (
//                                 <Image
//                                     key={id}
//                                     src={image}
//                                     boxSize={"200px"}
//                                     objectFit={"contain"}
//                                 />
//                             ))}
//                         </div>
//                     </ModalBody>
//                 </ModalContent>
//             </Modal>
//         </>
//     );
// }

VariantForm.Specification = () => {
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
        console.log('option', option)
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

  const variantSpecs = variant?.specifications
  useEffect(() => {
    if (action === 'create' || !variantSpecs) return
    const specifications = variantSpecs
    console.log('useEffect spec ran')
    const formSpecs = specifications
      .filter((item) =>
        productSpecs.some(
          (spec) => spec.name === item.name && spec.values.length > 1,
        ),
      )
      .map((item) => ({
        label: item.name,
        options: [toObjectOption(item.value, item)],
      }))
    setTimeout(() => {
      resetField(`specificationGroup`, {
        defaultValue: toArrayOptionString(formSpecs.map((item) => item.label)),
      })
      resetField(`specifications`, {
        defaultValue: formSpecs,
      })
    }, 0)
  }, [variant?.specifications])

  return (
    <>
      <div>
        <FormLabel>Thông số tuỳ chọn</FormLabel>
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
                    <SpecificationRow
                      key={field.id}
                      index={idx}
                      name={field.label}
                      onRemove={onRemove.bind(this, idx)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {!!productSpecs.length && (
        <div className="">
          <FormLabel>Thông số mặc định</FormLabel>
          {productSpecs.map(({ name, values }) => (
            <div key={name} className="flex gap-2">
              <p>{name}</p>
              <p>{values.map((val) => val.value).join('/ ')}</p>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

const SpecificationRow = ({
  index,
  onRemove,
  name = '',
}: {
  name: string | undefined
  index: number
  onRemove?: () => void
}) => {
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
  const [options, setOptions] = useState<Option<ISpecification>[]>([])
  const { data: { data: specsData } = {} } = useCustom<ISpecification[]>({
    url: findDistinctByName(name ?? ''),
    method: 'get',
    queryOptions: {
      enabled: !isDisabled,
    },
    meta: {
      resource,
    },
  })

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

  useEffect(() => {
    if (!specsData) return
    setOptions(
      specsData.map(({ id, name, value }) =>
        toObjectOption(value, { id, name, value }),
      ),
    )
  }, [specsData])

  return (
    <div className="flex border p-4 gap-2">
      <div className="flex-grow grid grid-cols-3 gap-2">
        <p>{name ?? ''}</p>
        <FormControl isInvalid={true} className="col-span-2">
          <Controller
            render={({ field }) => (
              <CreatableSelect
                {...field}
                isDisabled={isDisabled}
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
      <div className="min-w-[50px]">
        {!!onRemove && (
          <Button
            className=""
            onClick={onRemove}
            colorScheme="red"
            isDisabled={isDisabled}
          >
            <MinusCircle />
          </Button>
        )}
      </div>
    </div>
  )
}
