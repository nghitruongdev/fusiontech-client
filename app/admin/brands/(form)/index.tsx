import useUploadImage from '@/hooks/useUploadImage'
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from '@chakra-ui/react'
import { Create, Edit } from '@components/crud'
import ImageUpload, { UploadProviderProps } from '@components/image-upload'
import { Action } from '@refinedev/core'
import { useForm } from '@refinedev/react-hook-form'
import { HttpError } from 'http-errors'
import {
  BaseSyntheticEvent,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
} from 'react'
import { IBrand, IBrandField } from 'types'

type ContextProps = {
  action: Action
  brand: IBrand | null | undefined
} & ReturnType<typeof useForm<IBrand, HttpError, IBrandField>>

export const Form = ({ action }: { action: ContextProps['action'] }) => {
  return (
    <Form.Provider action={action}>
      <Form.Body />
    </Form.Provider>
  )
}

Form.Context = createContext<ContextProps | null>(null)

Form.useContext = () => {
  const context = useContext(Form.Context)
  if (!context) {
    throw new Error('FormContext.Provider is missing')
  }
  return {
    ...context,
  }
}

Form.Provider = function Provider({
  action,
  children,
}: PropsWithChildren<{ action: ContextProps['action'] }>) {
  const { uploadImages, removeImages } = useUploadImage({
    resource: 'brands',
  })

  const formProps = useForm<IBrand, HttpError, IBrandField>({
    refineCoreProps: {
      redirect: 'show',
    },
  })
  const {
    handleSubmit,
    refineCore: {
      formLoading,
      onFinish,
      queryResult: { data: { data: brand } = { data: null } } = {},
    },
    formState: { dirtyFields },
  } = formProps

  const saveProps = {
    disabled: formLoading,
    onClick: (e: BaseSyntheticEvent) => {
      console.log('custom onClick')
      handleSubmit(async ({ id, file, ...value }) => {
        const handleImage = async () => {
          if (action === 'edit' && dirtyFields.image) {
            const removedImage = brand?.image
            removedImage && removeImages([removedImage])
          }
          return file && (await uploadImages([file]))[0]
        }

        const image = await handleImage()

        const result = await onFinish({
          ...value,
          ...(image && { image }),
        })
        console.log('result', result)
      })(e)
    },
  }
  return (
    <Form.Context.Provider
      value={{
        ...formProps,
        action,
        brand,
        saveButtonProps: saveProps,
      }}
    >
      <Form.Container>{children}</Form.Container>
    </Form.Context.Provider>
  )
}

Form.Container = function Container({ children }: PropsWithChildren) {
  const {
    action,
    refineCore: { formLoading },
    saveButtonProps,
  } = Form.useContext()

  const isEdit = action === 'edit'
  if (isEdit)
    return (
      <Edit
        isLoading={formLoading}
        saveButtonProps={saveButtonProps}
        // canDelete={soldData && (soldData.data as unknown as number) == 0}
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

Form.Body = function Body() {
  const {
    action,
    register,
    formState: { errors },
  } = Form.useContext()
  const isEdit = action === 'edit'

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="max-h-[300px] min-h-[200px] p-4">
        <Form.Image />
      </div>
      <div className="col-span-3 gap-4">
        {isEdit && (
          <FormControl mb="3" isInvalid={!!(errors as any)?.id}>
            <FormLabel>Id</FormLabel>
            <Input disabled type="number" {...register('id')} />
            <FormErrorMessage>
              {(errors as any)?.id?.message as string}
            </FormErrorMessage>
          </FormControl>
        )}
        <FormControl mb="3" isInvalid={!!(errors as any)?.name}>
          <FormLabel>Tên danh mục</FormLabel>
          <Input
            type="text"
            {...register('name', {
              required: 'Vui lòng nhập tên danh mục.',
            })}
          />
          <FormErrorMessage>
            {(errors as any)?.name?.message as string}
          </FormErrorMessage>
        </FormControl>
        {/* <FormControl mb="3" isInvalid={!!(errors as any)?.slug}>
          <FormLabel>Slug</FormLabel>
          <Input
            type="text"
            {...register('slug', {
              required: 'Vui lòng nhập slug.',
            })}
          />
          <FormErrorMessage>
            {(errors as any)?.slug?.message as string}
          </FormErrorMessage>
        </FormControl> */}
        {/* <FormControl mb="3" isInvalid={!!(errors as any)?.description}>
          <FormLabel>Mô tả danh mục</FormLabel>
          <Textarea {...register('description', {})} />
          <FormErrorMessage>
            {(errors as any)?.description?.message as string}
          </FormErrorMessage>
        </FormControl> */}
      </div>
    </div>
  )
}

Form.Image = function Image() {
  const { brand, setValue } = Form.useContext()
  const onFilesChange: UploadProviderProps['onFilesChange'] = useCallback(
    (files: File[]) => setValue('file', files[0]),
    [setValue],
  )
  onFilesChange.isCallback = true

  const onRemove: UploadProviderProps['onRemoveUrl'] = useCallback(() => {
    setValue(`image`, null, {
      shouldDirty: true,
    })
  }, [setValue])
  onRemove.isCallback = true

  return (
    <FormControl w="full" h="full">
      <ImageUpload
        onFilesChange={onFilesChange}
        onRemoveUrl={onRemove}
        isMulti={false}
        {...(brand?.image && { initialUrls: [brand.image] })}
      />
    </FormControl>
  )
}

export { Form as BrandForm }
