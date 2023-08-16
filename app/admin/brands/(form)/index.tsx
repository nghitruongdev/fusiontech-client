/** @format */

import useDebounceFn from '@/hooks/useDebounceFn'
import useCrudNotification from '@/hooks/useCrudNotification'
import useUploadImage, { uploadUtils } from '@/hooks/useUploadImage'
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  InputRightElement,
  Spinner,
} from '@chakra-ui/react'
import { SaveButton } from '@components/buttons'
import { Create, Edit } from '@components/crud'
import ImageUpload, { UploadProviderProps } from '@components/image-upload'
import { Action, useOnError } from '@refinedev/core'
import { useForm } from '@refinedev/react-hook-form'
import { HttpError } from 'http-errors'
import {
  BaseSyntheticEvent,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { IBrand, IBrandField } from 'types'
import { API, API_URL } from 'types/constants'
import { ERRORS } from 'types/messages'
import { useBoolean, useDebounce } from 'usehooks-ts'
import { slugifyName } from '@/lib/slug-utils'
import { cleanValue } from '@/lib/utils'
import { validateBrandNameExists } from './utils'

type ContextProps = {
  action: Action
  brand: IBrand | undefined
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
      queryResult: { data: { data: brand } = { data: undefined } } = {},
    },
    formState: { dirtyFields, isSubmitting, isValidating },
  } = formProps

  const saveProps = {
    isLoading: isSubmitting,
    disabled: formLoading || isSubmitting || isValidating,
    onClick: (e: BaseSyntheticEvent) => {
      handleSubmit(async ({ id, file, ...value }) => {
        const handleImage = async () => {
          if (action === 'edit' && dirtyFields.image) {
            const removedImage = brand?.image
            removedImage && removeImages([removedImage])
          }
          return file && (await uploadImages([file]))[0]
        }

        const image = (await handleImage())?.url

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
      }}>
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
    <Create
      isLoading={formLoading}
      saveButtonProps={saveButtonProps}>
      {children}
    </Create>
  )
}

Form.Body = function Body() {
  const {
    action,
    register,
    formState: { errors },
    brand,
  } = Form.useContext()
  const isEdit = action === 'edit'
  const { onDefaultError: onError } = useCrudNotification()

  const [checkValue, isChecking] = useDebounceFn(
    validateBrandNameExists.bind(null, brand, onError),
    300,
  )

  return (
    <div className='grid grid-cols-4 gap-4'>
      <div className='max-h-[300px] min-h-[200px] p-4'>
        <Form.Image />
      </div>
      <div className='col-span-3 gap-4'>
        {isEdit && (
          <FormControl
            mb='3'
            isInvalid={!!(errors as any)?.id}>
            <FormLabel>Id</FormLabel>
            <Input
              disabled
              type='number'
              {...register('id')}
            />
            <FormErrorMessage>
              {(errors as any)?.id?.message as string}
            </FormErrorMessage>
          </FormControl>
        )}
        <FormControl
          mb='3'
          isInvalid={!!(errors as any)?.name}>
          <FormLabel>Tên thương hiệu</FormLabel>
          <InputGroup>
            <Input
              type='text'
              {...register('name', {
                required: ERRORS.brands.name.required,
                // validate: async (value) => await checkValue(value.trim()),
                setValueAs: (value) => value && cleanValue(value),
              })}
            />
            <InputRightElement>
              {isChecking && <Spinner color='blue.600' />}
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>
            {(errors as any)?.name?.message as string}
          </FormErrorMessage>
        </FormControl>
        <Form.Slug />
        {/* <FormControl mb="3" isInvalid={!!(errors as any)?.description}>
          <FormLabel>Mô tả</FormLabel>
          <Textarea {...register('description', {})} />
          <FormErrorMessage>
            {(errors as any)?.description?.message as string}
          </FormErrorMessage>
        </FormControl> */}
      </div>
    </div>
  )
}

Form.Slug = function BrandSlug() {
  const {
    register,
    trigger,
    getValues,
    setValue,
    formState: { errors },
  } = Form.useContext()

  return (
    <FormControl
      mb='3'
      isInvalid={!!errors?.slug}>
      <FormLabel>
        Slug
        <Button
          variant={'link'}
          onClick={async () => {
            const nameValid = await trigger(`name`)
            if (!nameValid) return
            setValue(`slug`, slugifyName(getValues(`name`)))
          }}>
          Tạo tự động
        </Button>
      </FormLabel>
      <Input
        type='text'
        {...register('slug', {
          required: 'Vui lòng nhập slug.',
          deps: ['name'],
        })}
      />
      <FormErrorMessage>{errors?.slug?.message}</FormErrorMessage>
    </FormControl>
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

  const imageUrl = brand?.image
  const initialUrls = useMemo(() => {
    console.count('usememo initialUrl ran')
    const name = imageUrl ? uploadUtils.getName('brands', imageUrl) : ''
    return imageUrl ? [{ name, url: imageUrl }] : []
  }, [imageUrl])

  return (
    <FormControl
      w='full'
      h='full'>
      <ImageUpload
        onFilesChange={onFilesChange}
        onRemoveUrl={onRemove}
        isMulti={false}
        {...(brand?.image && { initialUrls: initialUrls })}
      />
    </FormControl>
  )
}

export { Form as BrandForm }
