/** @format */

import * as create from '@components/crud/create'
import { Edit } from '@components/crud/edit'
import { useForm } from '@refinedev/react-hook-form'
import { HttpError } from 'http-errors'
import {
  BaseSyntheticEvent,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
} from 'react'
import { IUser, IUserForm } from 'types'
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  FormErrorIcon,
  Select,
  InputRightElement,
  Spinner,
  InputGroup,
} from '@chakra-ui/react'
import { ckMerge } from '@/lib/chakra-merge'
import { API } from 'types/constants'
import ReactSelect from 'react-select'
import { ERRORS } from 'types/messages'
import { cleanValue, getDateFromPast } from '@/lib/utils'
import ImageUpload, { UploadProviderProps } from '@components/image-upload'
import useUploadImage, { uploadUtils } from '@/hooks/useUploadImage'
import Image from 'next/image'
import useCrudNotification, {
  onError,
  onSuccess,
} from '@/hooks/useCrudNotification'
import { BaseType, EMAIL_PATTERN, PHONE_PATTERN } from '@/lib/validate-utils'
import useDebounceFn from '@/hooks/useDebounceFn'
import { validateUserEmailExists, validateUserPhoneExists } from './utils'
import { useHeaders } from '@/hooks/useHeaders'

const USER_MESSAGE = ERRORS['users']
type ContextProps = {
  action: 'create' | 'edit'
  user: IUser | null | undefined
} & ReturnType<typeof useForm<IUser, HttpError, IUserForm>>

const Form = ({ action }: { action: ContextProps['action'] }) => {
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
    resource: 'users',
  })
  const { getAuthHeader, _isHydrated } = useHeaders()
  const formProps = useForm<IUser, HttpError, IUserForm>({
    refineCoreProps: {
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
    refineCore: {
      formLoading,
      onFinish,
      queryResult: { data: { data: user } = { data: undefined } } = {},
    },
    register,
    handleSubmit,
    setValue,
    formState: { errors, dirtyFields },
  } = formProps

  const saveProps = {
    disabled: formLoading,
    onClick(e: BaseSyntheticEvent) {
      handleSubmit(async ({ formRoles, imageFile, ...value }) => {
        const handleImage = async () => {
          if (action === 'edit' && dirtyFields.image) {
            const removedImage = user?.image
            removedImage && removeImages([removedImage])
          }
          return imageFile && (await uploadImages([imageFile]))[0]
        }

        const image = (await handleImage())?.url
        const submitValue = { ...value, ...(image && { image }) }
        await onFinish(submitValue)
      })(e)
    },
  }
  return (
    <Form.Context.Provider
      value={{
        ...formProps,
        saveButtonProps: saveProps,
        action,
        user,
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
    <create.Create
      isLoading={formLoading}
      saveButtonProps={saveButtonProps}>
      {children}
    </create.Create>
  )
}

Form.Body = function Body() {
  const {
    user,
    formState: { errors },
    register,
  } = Form.useContext()
  return (
    <>
      <div className='grid grid-cols-3'>
        <div className='flex flex-row justify-center '>
          <Form.Avatar />
        </div>
        <div className='col-span-2'>
          <Form.Id />
          <Form.Email />
          <Form.LastName />
          <Form.FirstName />
          <Form.Phone />
          <Form.Gender />
          <Form.Birthday />
          <Form.Roles />
        </div>
      </div>
    </>
  )
}

Form.Id = function Id() {
  const {
    user,
    formState: { errors },
    register,
  } = Form.useContext()
  if (!user) return <></>
  return (
    <FormControl
      mb='3'
      isInvalid={!!errors.id}>
      <FormLabel>Id</FormLabel>
      <Input
        disabled
        type='number'
        {...register('id')}
      />
      <FormErrorMessage>{errors.id?.message as string}</FormErrorMessage>
    </FormControl>
  )
}

Form.FirstName = function FirstName() {
  const {
    register,
    formState: { errors },
  } = Form.useContext()
  return (
    <FormControl
      mb='3'
      isRequired
      isInvalid={!!errors.firstName}>
      <FormLabel>Tên</FormLabel>
      <Input
        {...register('firstName', {
          required: USER_MESSAGE.firstName.required,
          setValueAs: cleanValue,
        })}
        type='text'
        placeholder='Nhập tên của bạn'
        _placeholder={{ fontSize: 'sm' }}
        className={ckMerge(`bg-gray-50 placeholder:text-sm`)}
      />
      {errors.firstName?.message && (
        <FormErrorMessage>
          <FormErrorIcon />
          {errors.firstName?.message}
        </FormErrorMessage>
      )}
    </FormControl>
  )
}

Form.LastName = function LastName() {
  const {
    register,
    formState: { errors },
  } = Form.useContext()
  return (
    <FormControl
      mb='3'
      isRequired
      isInvalid={!!errors.lastName}>
      <FormLabel>Họ</FormLabel>
      <Input
        {...register('lastName', {
          required: USER_MESSAGE.lastName.required,
          setValueAs: cleanValue,
        })}
        type='text  '
        placeholder='Nhập họ của bạn'
        _placeholder={{ fontSize: 'sm' }}
        className={ckMerge(`bg-gray-50 placeholder:text-sm`)}
      />
      {errors.lastName?.message && (
        <FormErrorMessage>
          <FormErrorIcon />
          {errors.lastName?.message}
        </FormErrorMessage>
      )}
    </FormControl>
  )
}

Form.Phone = function Phone() {
  const {
    register,
    setError,
    clearErrors,
    user,
    formState: { errors, isSubmitting },
  } = Form.useContext()
  const { required } = ERRORS.users.phoneNumber
  const { onDefaultError: onError } = useCrudNotification()
  const [validateExists, isChecking] = useDebounceFn(
    validateUserPhoneExists.bind(
      null,
      (user as BaseType) ?? undefined,
      onError,
    ),
    300,
  )
  return (
    <FormControl
      mb='3'
      isRequired
      isInvalid={!!errors.phoneNumber}>
      <FormLabel>Số điện thoại</FormLabel>
      <InputGroup>
        <Input
          {...register('phoneNumber', {
            required,
            pattern: PHONE_PATTERN,
            validate: async (value) => await validateExists(value),
          })}
          type='number'
          placeholder='Nhập số điện thoại'
          _placeholder={{ fontSize: 'sm' }}
          className={ckMerge(`bg-gray-50 placeholder:text-sm`)}
        />
        <InputRightElement>
          {!isSubmitting && isChecking && <Spinner color='blue.600' />}
        </InputRightElement>
      </InputGroup>

      {errors.phoneNumber?.message && (
        <FormErrorMessage>
          <FormErrorIcon />
          {errors.phoneNumber.message}
        </FormErrorMessage>
      )}
    </FormControl>
  )
}

Form.Email = function Email() {
  const {
    register,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
    user,
  } = Form.useContext()
  const { required } = ERRORS.users.email
  const { onDefaultError: onError } = useCrudNotification()
  const [validateExists, isChecking] = useDebounceFn(
    validateUserEmailExists.bind(
      null,
      (user as BaseType) ?? undefined,
      onError,
    ),
    300,
  )
  return (
    <FormControl
      mb='3'
      isRequired
      isInvalid={!!errors.email}>
      <FormLabel>Địa chỉ E-mail</FormLabel>
      <InputGroup>
        <Input
          {...register('email', {
            required,
            pattern: EMAIL_PATTERN,
            validate: async (value) => await validateExists(value),
            setValueAs: (value) =>
              !!value ? cleanValue(value).toLowerCase() : undefined,
          })}
          type='email'
          placeholder='Nhập địa chỉ email'
          _placeholder={{ fontSize: 'sm' }}
          className={ckMerge(`bg-gray-50 placeholder:text-sm`)}
        />
        <InputRightElement>
          {!isSubmitting && isChecking && <Spinner color='blue.600' />}
        </InputRightElement>
      </InputGroup>

      {errors.email?.message && (
        <FormErrorMessage>
          <FormErrorIcon />
          {errors.email?.message}
        </FormErrorMessage>
      )}
    </FormControl>
  )
}

Form.Gender = function Gender() {
  const {
    formState: { errors },
    register,
    watch,
  } = Form.useContext()
  return (
    <FormControl
      mb='3'
      isInvalid={!!errors.gender}
      isRequired>
      <FormLabel>Giới tính</FormLabel>
      <Select
        title='gender'
        defaultValue={'MALE'}
        {...register(`gender`)}>
        <option
          value='MALE'
          defaultChecked>
          Nam
        </option>
        <option value='FEMALE'>Nữ</option>
        <option value='OTHER'>Khác</option>
      </Select>
      {errors.gender?.message && (
        <FormErrorMessage>
          <FormErrorIcon />
          {errors.gender?.message}
        </FormErrorMessage>
      )}
    </FormControl>
  )
}

Form.Birthday = function Birthday() {
  const {
    formState: { errors },
    register,
  } = Form.useContext()

  return (
    <FormControl
      mb='3'
      isInvalid={!!errors.dateOfBirth}
      isRequired>
      <FormLabel>Ngày sinh</FormLabel>
      <Input
        type='date'
        {...register(`dateOfBirth`, {
          required: USER_MESSAGE.age.required,
          valueAsDate: true,
          max: {
            value: getDateFromPast(18).getTime(),
            message: USER_MESSAGE.age.valid,
          },
          min: {
            value: getDateFromPast(60).getTime(),
            message: USER_MESSAGE.age.valid,
          },
        })}
      />
      {errors.dateOfBirth?.message && (
        <FormErrorMessage>
          <FormErrorIcon />
          {errors.dateOfBirth?.message}
        </FormErrorMessage>
      )}
    </FormControl>
  )
}

Form.Roles = function Roles() {
  const {
    formState: { errors },
    register,
  } = Form.useContext()
  const roleOptions = useMemo(() => {
    return [
      // { label: 'Người dùng', value: 'user' },
      //   { label: 'Quản trị viên', value: 'admin' },
    ]
  }, [])
  return (
    <FormControl
      mb='3'
      isInvalid={!!errors.formRoles}>
      <FormLabel>Vai trò</FormLabel>
      <ReactSelect
        isMulti
        options={roleOptions}
      />
      {errors.formRoles?.message && (
        <FormErrorMessage>
          <FormErrorIcon />
          {errors.formRoles?.message}
        </FormErrorMessage>
      )}
    </FormControl>
  )
}

Form.Avatar = function Avatar() {
  const { user, setValue } = Form.useContext()

  const onFilesChange: UploadProviderProps['onFilesChange'] = useCallback(
    (files: File[]) => setValue('imageFile', files[0]),
    [setValue],
  )
  onFilesChange.isCallback = true

  const onRemove: UploadProviderProps['onRemoveUrl'] = useCallback(() => {
    setValue(`image`, null, {
      shouldDirty: true,
    })
    setValue(`photoUrl`, '', {
      shouldDirty: true,
    })
  }, [setValue])
  onRemove.isCallback = true

  const initialUrls = useMemo(
    () =>
      user?.image
        ? [
            {
              url: user.image,
              name: uploadUtils.getName('users', user.image) ?? '',
            },
          ]
        : [],
    [user?.image],
  )
  return (
    <div style={{ width: '250px', height: '300px', marginTop: '20px' }}>
      <ImageUpload
        isMulti={false}
        // {...(user?.photoUrl && { initialUrls: [{ url: user.photoUrl }] })}
        {...(user?.image && { initialUrls })}
      />
    </div>
  )
}

export { Form as UserForm }
