/** @format */

import useDebounceFn from '@/hooks/useDebounceFn'
import useCrudNotification from '@/hooks/useCrudNotification'
import useUploadImage, { uploadUtils } from '@/hooks/useUploadImage'
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  InputRightElement,
  Spinner,
  Textarea,
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
import { IVoucher } from 'types'
import { API, API_URL } from 'types/constants'
import { ERRORS } from 'types/messages'
import { useBoolean, useDebounce } from 'usehooks-ts'
import { AppError } from '../../../../types/error'

type ContextProps = {
  action: Action
  voucher: IVoucher | undefined
} & ReturnType<typeof useForm<IVoucher, HttpError, IVoucher>>

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
  // const { uploadImages, removeImages } = useUploadImage({
  //   resource: 'brands',
  // })

  const formProps = useForm<IVoucher, AppError, IVoucher>({
    refineCoreProps: {
      redirect: 'show',
    },
  })
  const {
    handleSubmit,
    refineCore: {
      formLoading,
      onFinish,
      queryResult: { data: { data: voucher } = { data: undefined } } = {},
    },
    formState: { dirtyFields, isSubmitting, isValidating },
  } = formProps

  // const saveProps = {
  //   isLoading: isSubmitting,
  //   disabled: formLoading || isSubmitting || isValidating,
  //   onClick: (e: BaseSyntheticEvent) => {
  //     handleSubmit(async ({ id, file, ...value }) => {
  //       const handleImage = async () => {
  //         if (action === 'edit' && dirtyFields.image) {
  //           const removedImage = brand?.image
  //           removedImage && removeImages([removedImage])
  //         }
  //         return file && (await uploadImages([file]))[0]
  //       }

  //       const image = (await handleImage())?.url

  //       const result = await onFinish({
  //         ...value,
  //         ...(image && { image }),
  //       })
  //       console.log('result', result)
  //     })(e)
  //   },
  // }
  return (
    <Form.Context.Provider
      value={{
        ...formProps,
        action,
        voucher,
        // saveButtonProps: saveProps,
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

type onError = ReturnType<typeof useCrudNotification>['onDefaultError']
const validateName = async (
  voucher: IVoucher | undefined,
  onError: onError,
  code: string,
) => {
  const { findByCode } = API['vouchers']()
  const { exists, required } = ERRORS.vouchers.code
  if (!code) return required
  const sendRequest = async () => {
    const response = await fetch(`${API_URL}/${findByCode(code)}`)

    if (!response.ok) {
      if (response.status === 404) return true
      console.error('validate name is not ok')
      return false
    }
    const data = (await response.json()) as IVoucher
    if (data) {
      if (!voucher) return exists

      if (data.id !== voucher.id) return exists
    }
    return true
  }
  try {
    return await sendRequest()
  } catch (err) {
    onError(err as Error)
    return false
  }
}
Form.Body = function Body() {
  const {
    action,
    register,
    formState: { errors },
    voucher,
  } = Form.useContext()
  const isEdit = action === 'edit'
  const { onDefaultError: onError } = useCrudNotification()

  const [checkValue, isChecking] = useDebounceFn(
    validateName.bind(null, voucher, onError),
    300,
  )

  return (
    <div className='grid grid-cols-3 gap-4'>
      <div className='col-span-3 gap-4'>
        {isEdit && (
          <FormControl
            mb='3'
            isInvalid={!!errors?.id}>
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
          isInvalid={!!errors?.code}>
          <FormLabel>Code</FormLabel>
          <InputGroup>
            <Input
              type='text'
              {...register('code', {
                required: ERRORS.vouchers.code.required,
                validate: async (value) =>
                  !!value && (await checkValue(value?.trim())),
                setValueAs: (value) => value && value.trim(),
              })}
            />
            <InputRightElement>
              {isChecking && <Spinner color='blue.600' />}
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>{errors?.code?.message}</FormErrorMessage>
        </FormControl>

        <FormControl
          mb='3'
          isInvalid={!!errors?.discount}>
          <FormLabel>discount</FormLabel>
          <Input
            type='number'
            {...register('discount', {
              required: 'Vui lòng nhập discount.',
            })}
          />
          <FormErrorMessage>{errors.discount?.message}</FormErrorMessage>
        </FormControl>

        <FormControl
          mb='3'
          isInvalid={!!errors?.minOrderAmount}>
          <FormLabel>minOrderAmount</FormLabel>
          <Input
            type='number'
            {...register('minOrderAmount', {
              required: 'Vui lòng nhập minOrderAmount.',
            })}
          />
          <FormErrorMessage>{errors.minOrderAmount?.message}</FormErrorMessage>
        </FormControl>

        <FormControl
          mb='3'
          isInvalid={!!errors?.maxDiscountAmount}>
          <FormLabel>maxDiscountAmount</FormLabel>
          <Input
            type='number'
            {...register('maxDiscountAmount', {
              required: 'Vui lòng nhập maxDiscountAmount.',
            })}
          />
          <FormErrorMessage>
            {errors.maxDiscountAmount?.message as string}
          </FormErrorMessage>
        </FormControl>

        <FormControl
          mb='3'
          isInvalid={!!errors?.startDate}>
          <FormLabel>startDate</FormLabel>
          <Input
            type='datetime-local'
            {...register('startDate', {
              required: 'Vui lòng nhập startDate.',
            })}
          />
          <FormErrorMessage>
            {errors.startDate?.message as string}
          </FormErrorMessage>
        </FormControl>

        <FormControl
          mb='3'
          isInvalid={!!errors?.expirationDate}>
          <FormLabel>expirationDate</FormLabel>
          <Input
            type='datetime-local'
            {...register('expirationDate', {
              required: 'Vui lòng nhập expirationDate.',
            })}
          />
          <FormErrorMessage>
            {(errors as any)?.expirationDate?.message as number}
          </FormErrorMessage>
        </FormControl>

        <FormControl
          mb='3'
          isInvalid={!!errors?.limitUsage}>
          <FormLabel>limitUsage</FormLabel>
          <Input
            type='number'
            {...register('limitUsage', {
              required: 'Vui lòng nhập limitUsage.',
            })}
          />
          <FormErrorMessage>
            {errors.limitUsage?.message as string}
          </FormErrorMessage>
        </FormControl>

        <FormControl
          mb='3'
          isInvalid={!!errors?.userLimitUsage}>
          <FormLabel>userLimitUsage</FormLabel>
          <Input
            type='number'
            {...register('userLimitUsage', {
              required: 'Vui lòng nhập discount.',
            })}
          />
          <FormErrorMessage>
            {(errors as any)?.userLimitUsage?.message as number}
          </FormErrorMessage>
        </FormControl>

        <FormControl
          mb='3'
          isInvalid={!!errors.description}>
          <FormLabel>Mô tả danh mục</FormLabel>
          <Textarea {...register('description', {})} />
          <FormErrorMessage>
            {(errors as any)?.description?.message as string}
          </FormErrorMessage>
        </FormControl>
      </div>
    </div>
  )
}

// Form.Image = function Image() {
//   const { brand, setValue } = Form.useContext()
//   const onFilesChange: UploadProviderProps['onFilesChange'] = useCallback(
//     (files: File[]) => setValue('file', files[0]),
//     [setValue],
//   )
//   onFilesChange.isCallback = true

//   const onRemove: UploadProviderProps['onRemoveUrl'] = useCallback(() => {
//     setValue(`image`, null, {
//       shouldDirty: true,
//     })
//   }, [setValue])
//   onRemove.isCallback = true

//   const imageUrl = brand?.image
//   const initialUrls = useMemo(() => {
//     console.count('usememo initialUrl ran')
//     const name = imageUrl ? uploadUtils.getName('brands', imageUrl) : ''
//     return imageUrl ? [{ name, url: imageUrl }] : []
//   }, [imageUrl])

//   return (
//     <FormControl
//       w='full'
//       h='full'>
//       <ImageUpload
//         onFilesChange={onFilesChange}
//         onRemoveUrl={onRemove}
//         isMulti={false}
//         {...(brand?.image && { initialUrls: initialUrls })}
//       />
//     </FormControl>
//   )
// }

export { Form as VoucherForm }
