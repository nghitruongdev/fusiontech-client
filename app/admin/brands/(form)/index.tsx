/** @format */

import useDebounceFn from '@/hooks/useDebounceFn'
import useCrudNotification, {
  onError,
  onSuccess,
} from '@/hooks/useCrudNotification'
import useUploadImage, { uploadUtils } from '@/hooks/useUploadImage'
import {
  Button,
  FormControl,
  FormErrorIcon,
  FormErrorMessage,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Tooltip,
} from '@chakra-ui/react'
import { Create, Edit } from '@components/crud'
import ImageUpload, { UploadProviderProps } from '@components/image-upload'
import { Action } from '@refinedev/core'
import { useForm } from '@refinedev/react-hook-form'
import {
  BaseSyntheticEvent,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
} from 'react'
import { IBrand, IBrandField } from 'types'
import { ERRORS } from 'types/messages'
import { slugifyName } from '@/lib/slug-utils'
import { cleanValue } from '@/lib/utils'
import { validateBrandNameExists, validateBrandSlugExists } from './utils'
import { SLUG_PATTERN } from '@/lib/validate-utils'
import { Info } from 'lucide-react'
import { AppError } from 'types/error'
import { ActionText } from 'types/constants'
import { useHeaders } from '@/hooks/useHeaders'

type ContextProps = {
  action: 'create' | 'edit'
  brand: IBrand | undefined
} & ReturnType<typeof useForm<IBrand, AppError, IBrandField>>

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

  const { getAuthHeader, _isHydrated } = useHeaders()
  const formProps = useForm<IBrand, AppError, IBrandField>({
    refineCoreProps: {
      redirect: 'list',
      //   queryOptions: {
      //     enabled: _isHydrated,
      //   },
      meta: {
        headers: {
          ...getAuthHeader(),
        },
      },
      errorNotification: onError,
      successNotification: onSuccess.bind(null, action),
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
      handleSubmit(async ({ file, ...value }) => {
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
    meta: {
      headers: {
        ...getAuthHeader(),
      },
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
    formState: { errors, isSubmitting },
    refineCore: { id },
    brand,
  } = Form.useContext()
  const isEdit = action === 'edit'
  const { onDefaultError: onError } = useCrudNotification()

  const [checkNameExists, isNameChecking] = useDebounceFn(
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
              defaultValue={id}
            />
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
                validate: async (value) => await checkNameExists(value),
                setValueAs: (value) => value && cleanValue(value),
              })}
            />
            <InputRightElement>
              {!isSubmitting && isNameChecking && <Spinner color='blue.600' />}
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>
            <FormErrorIcon />
            {(errors as any)?.name?.message as string}
          </FormErrorMessage>
        </FormControl>
        <Form.Slug />
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
    brand,
    formState: { errors, isSubmitting },
  } = Form.useContext()
  const { onDefaultError: onError } = useCrudNotification()

  const [checkSlugExists, isSlugChecking] = useDebounceFn(
    validateBrandSlugExists.bind(null, brand, onError),
    300,
  )
  return (
    <FormControl
      mb='3'
      isInvalid={!!errors?.slug}>
      <FormLabel>
        Đường dẫn (slug)
        <Button
          variant={'link'}
          fontSize={'sm'}
          ml='1'
          fontWeight={'normal'}
          rightIcon={
            <Tooltip label='Đường dẫn sẽ được tạo tự động từ tên. Cần chỉnh sửa nếu bị trùng lặp.'>
              <Icon as={Info} />
            </Tooltip>
          }
          onClick={async () => {
            const nameValid = await trigger(`name`)
            if (!nameValid) return
            setValue(`slug`, slugifyName(getValues(`name`)))
            trigger(`slug`)
          }}>
          Tạo tự động
        </Button>
      </FormLabel>
      <InputGroup>
        <Input
          type='text'
          {...register('slug', {
            required: 'Vui lòng nhập slug.',
            pattern: SLUG_PATTERN,
            validate: async (value) => await checkSlugExists(value),
            setValueAs: (value) => (value as string)?.trim().toLowerCase(),
            deps: ['name'],
          })}
        />
        <InputRightElement>
          {!isSubmitting && isSlugChecking && <Spinner color='blue.600' />}
        </InputRightElement>
      </InputGroup>
      <FormErrorMessage>
        <FormErrorIcon />
        {errors?.slug?.message}
      </FormErrorMessage>
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
