import { Create } from '@components/crud/create'
import { Edit } from '@components/crud/edit'
import { Action, useCustom } from '@refinedev/core'
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
} from '@chakra-ui/react'
import { ckMerge } from '@/lib/chakra-merge'
import { API } from 'types/constants'
import ReactSelect from 'react-select'
import { ERRORS } from 'types/messages'
import { getDateFromPast } from '@/lib/utils'
import ImageUpload, { UploadProviderProps } from '@components/image-upload'
import useUploadImage from '@/hooks/useUploadImage'

const { existsByEmail, existsByPhoneNumber } = API['users']()
const USER_MESSAGE = ERRORS['users']
type ContextProps = {
  action: Action
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
  const formProps = useForm<IUser, HttpError, IUserForm>()
  const {
    refineCore: {
      formLoading,
      onFinish,
      queryResult: { data: { data: user } = { data: null } } = {},
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

        const image = await handleImage()

        await onFinish({ ...value, image })
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
    user,
    formState: { errors },
    register,
  } = Form.useContext()
  return (
    <>
      <Form.Avatar />
      <Form.Id />
      <Form.Email />
      <Form.FirstName />
      <Form.LastName />
      <Form.Phone />
      <Form.Gender />
      <Form.Birthday />
      <Form.Roles />
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
    <FormControl mb="3" isInvalid={!!errors.id}>
      <FormLabel>Id</FormLabel>
      <Input disabled type="number" {...register('id')} />
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
    <FormControl mb="3" isRequired isInvalid={!!errors.firstName}>
      <FormLabel>Tên</FormLabel>
      <Input
        {...register('firstName', {
          required: USER_MESSAGE.firstName.required,
        })}
        type="text"
        placeholder="Nhập tên của bạn"
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
    <FormControl mb="3" isRequired isInvalid={!!errors.lastName}>
      <FormLabel>Họ</FormLabel>
      <Input
        {...register('lastName', {
          required: USER_MESSAGE.lastName.required,
        })}
        type="text  "
        placeholder="Nhập họ của bạn"
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
    formState: { errors },
  } = Form.useContext()
  const onPhoneChange = async (phone: string) => {
    // Kiểm tra sự tồn tại của phone number
    const response = await fetch(existsByPhoneNumber(phone))
    const result = await response.json()
    if (result) {
      setError('phoneNumber', {
        type: 'manual',
        message: USER_MESSAGE.phoneNumber.exists,
      })
    } else {
      clearErrors('phoneNumber')
      return true
    }
  }
  return (
    <FormControl mb="3" isRequired isInvalid={!!errors.phoneNumber}>
      <FormLabel>Số điện thoại</FormLabel>
      <Input
        {...register('phoneNumber', {
          required: 'Vui lòng nhập số điện thoại.',
          pattern: {
            value: /^\d+$/,
            message: 'Số điện thoại không hợp lệ.',
          },
          minLength: {
            value: 10,
            message: 'Số điện thoại phải có ít nhất 10 số.',
          },
          maxLength: {
            value: 10,
            message: 'Số điện thoại không được vượt quá 10 số.',
          },
          validate: (value) => {
            value && onPhoneChange(value)
            return true
          },
        })}
        type="number"
        placeholder="Nhập số điện thoại"
        _placeholder={{ fontSize: 'sm' }}
        className={ckMerge(`bg-gray-50 placeholder:text-sm`)}
      />
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
    formState: { errors },
  } = Form.useContext()

  const onEmailChange = async (email: string) => {
    // Kiểm tra sự tồn tại của email
    const response = await fetch(existsByEmail(email))
    if (!response.ok) {
      console.warn('have not handle repsonse not ok')
    }
    const result = (await response.json()) as boolean
    if (result) {
      setError('email', {
        type: 'manual',
        message: 'Email đã tồn tại.',
      })
    } else {
      clearErrors('email')
      return true
    }
  }

  return (
    <FormControl mb="3" isRequired isInvalid={!!errors.email}>
      <FormLabel>Địa chỉ E-mail</FormLabel>
      <Input
        {...register('email', {
          required: 'Vui lòng nhập địa chỉ email.',
          pattern: {
            value: /^\S+@\S+$/i,
            message: 'Email không hợp lệ.',
          },
          validate: (value) => {
            value && onEmailChange(value)
            return true
          },
        })}
        type="email"
        placeholder="Nhập địa chỉ email"
        _placeholder={{ fontSize: 'sm' }}
        className={ckMerge(`bg-gray-50 placeholder:text-sm`)}
      />
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
    <FormControl mb="3" isInvalid={!!errors.gender} isRequired>
      <FormLabel>Giới tính</FormLabel>
      <Select defaultValue={'MALE'} {...register(`gender`)}>
        <option value="MALE" defaultChecked>
          Nam
        </option>
        <option value="FEMALE">Nữ</option>
        <option value="OTHER">Khác</option>
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
    <FormControl mb="3" isInvalid={!!errors.dateOfBirth} isRequired>
      <FormLabel>Ngày sinh</FormLabel>
      <Input
        type="date"
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
      { label: 'Người dùng', value: 'user' },
      { label: 'Quản trị viên', value: 'admin' },
    ]
  }, [])
  return (
    <FormControl mb="3" isInvalid={!!errors.formRoles}>
      <FormLabel>Vai trò</FormLabel>
      <ReactSelect isMulti options={roleOptions} />
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

  return (
    <FormControl rounded={'full'}>
      <div className="">
        <ImageUpload
          isMulti={false}
          {...(user?.photoUrl && { initialUrls: [{ url: user.photoUrl }] })}
          {...(user?.image && { initialUrls: [user.image] })}
        />
      </div>
    </FormControl>
  )
}

export { Form as UserForm }
