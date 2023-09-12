/** @format */

import React, { useEffect, useMemo, useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import Link from 'next/link'
import AuthPage from '../AuthPage'
import {
  FormControl,
  FormErrorIcon,
  FormErrorMessage,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  useBoolean,
} from '@chakra-ui/react'
import { ckMerge } from '@/lib/chakra-merge'
import PasswordInput from '@components/ui/PasswordInput'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import { CredentialsRegister } from 'types/auth'
import { firebaseAuth } from '@/providers/firebaseAuthProvider'
import { AuthActionResponse } from '@refinedev/core/dist/interfaces'
import { useRouter, useSearchParams } from 'next/navigation'
import { IAuthProvider } from 'types/auth'
import { useRegister } from '@refinedev/core'
import useDebounceFn from '@/hooks/useDebounceFn'
import { cn } from 'components/lib/utils'
import { API, API_URL } from 'types/constants'

const { existsByPhoneNumber, existsByEmail } = API['users']()
const Form = () => {
  const formProps = useForm<CredentialsRegister>()

  //todo: sửa lại tất cả các field: register, placeholder, input name, input type,
  //todo: thêm validation rule
  //todo: thêm một cái errorState/ show toast thông báo lỗi
  //todo: viết code xử lý ở useRegisterFormContext ở cuối page
  //FIXME: -optional- fix layout form

  return (
    <AuthPage title={`Đăng ký thành viên FusionTech`}>
      <FormProvider {...formProps}>
        <div className='flex justify-center bg-white w-full mt-4'>
          <div className='w-full sm:w-4/5'>
            <div className='mb-4 space-y-4'>
              <Form.Email />
              <Form.Password />
              <Form.ConfirmPassword />
              <Form.FirstName />
              <Form.LastName />
              <Form.Phone />
              <Form.AgreeCheck />
            </div>
            {/* <Form.Subscription /> */}
            <Form.SubmitButton />
            <p className='text-center'>Hoặc</p>
            <hr className='my-4' />
            <Form.GoogleSignup />
            <Form.LoginLink />
          </div>
        </div>
      </FormProvider>
    </AuthPage>
  )
}

Form.FirstName = function FirstName() {
  const {
    register,
    formState: { errors },
  } = useRegisterFormContext()
  return (
    <FormControl
      className=''
      isRequired
      isInvalid={!!errors.firstName}>
      <Input
        {...register('firstName', {
          required: 'Vui lòng nhập tên của bạn.',
          setValueAs: (value) => value?.trim(),
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
  } = useRegisterFormContext()
  return (
    <FormControl
      className=''
      isRequired
      isInvalid={!!errors.lastName}>
      <Input
        {...register('lastName', {
          //   required: 'Vui lòng nhập họ của bạn.',
          setValueAs: (value) => value?.trim(),
        })}
        type='text'
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
    formState: { errors },
  } = useRegisterFormContext()
  const handlePhoneChange = async (phone: string) => {
    const exists = await (
      await fetch(`${API_URL}/${existsByPhoneNumber(phone)}`)
    ).json()
    console.log('exists.data', exists)
    return !!exists ? 'Số điện thoại đã được sử dụng' : true
  }
  const [onPhoneChange, isLoading] = useDebounceFn(handlePhoneChange, 500)

  return (
    <FormControl
      className=''
      isRequired
      isInvalid={!!errors.phoneNumber}>
      <InputGroup>
        <Input
          {...register('phoneNumber', {
            required: 'Vui lòng nhập số điện thoại',
            pattern: {
              value: /^0[\d]{9}$/,
              message: 'Số điện thoại không hợp lệ.',
            },
            validate: async (value) => {
              return await onPhoneChange(value)
            },
            setValueAs: (value) => value?.trim(),
          })}
          type='tel'
          placeholder='Nhập số điện thoại'
          _placeholder={{ fontSize: 'sm' }}
          className={ckMerge(`bg-gray-50 placeholder:text-sm`)}
        />
        <InputRightElement>
          {isLoading && <Spinner color='blue.600' />}
        </InputRightElement>
      </InputGroup>

      {errors.phoneNumber?.message && (
        <FormErrorMessage>
          <FormErrorIcon />
          {errors.phoneNumber?.message}
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
  } = useRegisterFormContext()
  const handleEmailChange = async (email: string) => {
    const error = errors?.email?.message
    if (error) return error
    const exists = await (
      await fetch(`${API_URL}/${existsByEmail(email)}`)
    ).json()
    return exists ? 'Địa chỉ email đã được sử dụng' : true
  }
  const [onEmailChange, isLoading] = useDebounceFn(handleEmailChange, 300)

  return (
    <FormControl
      className=''
      isRequired
      isInvalid={!!errors.email}>
      <InputGroup>
        <Input
          {...register('email', {
            required: 'Vui lòng nhập địa chỉ email.',
            pattern: {
              value: /^\S+@\S+$/i,
              message: 'Email không hợp lệ.',
            },
            validate: async (value) => {
              return await onEmailChange(value)
            },
            setValueAs: (value) => value?.trim(),
          })}
          type='text'
          placeholder='Nhập địa chỉ email'
          _placeholder={{ fontSize: 'sm' }}
          className={ckMerge(`bg-gray-50 placeholder:text-sm`)}
        />
        <InputRightElement>
          {isLoading && <Spinner color='blue.600' />}
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

Form.Password = function Password() {
  const {
    register,
    formState: { errors },
  } = useRegisterFormContext()
  return (
    <FormControl
      className=''
      isRequired
      isInvalid={!!errors.password}>
      <PasswordInput
        {...register('password', {
          required: 'Mật khẩu không được để trống',
          minLength: {
            value: 8,
            message: 'Mật khẩu phải có ít nhất 8 ký tự.',
          },
        })}
        placeholder='Nhập mật khẩu'
        _placeholder={{ fontSize: 'sm' }}
        className={ckMerge(`bg-gray-50 placeholder:text-sm`)}
      />
      {errors.password?.message && (
        <FormErrorMessage>
          <FormErrorIcon />
          {errors.password?.message}
        </FormErrorMessage>
      )}
    </FormControl>
  )
}

Form.ConfirmPassword = function ConfirmPassword() {
  const {
    register,
    getValues,
    formState: { errors },
  } = useRegisterFormContext()
  return (
    <FormControl
      className=''
      isRequired
      isInvalid={!!errors.confirmPassword}>
      <PasswordInput
        {...register('confirmPassword', {
          required: 'Xác nhận mật khẩu không được để trống',
          validate: (value: string) =>
            value === getValues('password') || 'Xác nhận mật khẩu không khớp.',
        })}
        placeholder='Xác nhận mật khẩu'
        _placeholder={{ fontSize: 'sm' }}
        className={ckMerge(`bg-gray-50 placeholder:text-sm`)}
      />
      {errors.confirmPassword?.message && (
        <FormErrorMessage>
          <FormErrorIcon />
          {errors.confirmPassword?.message}
        </FormErrorMessage>
      )}
    </FormControl>
  )
}

Form.AgreeCheck = function Aggree() {
  const {
    register,
    formState: { errors },
  } = useRegisterFormContext()
  return (
    <label className='inline-flex items-center'>
      <input
        type='checkbox'
        className='form-radio text-blue-500'
        {...register(`agree`, {
          required: true,
        })}
      />
      <span
        className={cn(
          `ml-2 text-zinc-600 text-sm`,
          errors.agree && 'text-red-500',
        )}>
        Tôi đồng ý với các điều khoản bảo mật cá nhân
      </span>
    </label>
  )
}

// Form.Subscription = function Subscription() {
//   return (
//     <div className="mb-4">
//       <label className="inline-flex items-center">
//         <input type="checkbox" className="form-radio text-blue-500" />
//         <span className="ml-2">Đăng ký nhận bản tin khuyến mãi qua email</span>
//       </label>
//     </div>
//   )
// }

Form.SubmitButton = function SubmitButton() {
  const {
    onFormSubmit,
    handleSubmit,
    formState: { isSubmitting, isLoading },
  } = useRegisterFormContext()

  return (
    <div className='flex flex-col items-center mb-4'>
      <button
        disabled={isSubmitting}
        onClick={handleSubmit(onFormSubmit)}
        type='button'
        className={cn(
          'bg-blue-500 text-white font-semibold text-md px-4 py-2 rounded-md w-full h-12 shadow-md',
          isSubmitting &&
            'pointer-events-none flex items-center justify-center gap-4 select-none',
        )}>
        Đăng ký ngay {isSubmitting && <Spinner colorScheme='whiteAlpha' />}
      </button>
    </div>
  )
}

Form.GoogleSignup = function GoogleSignup() {
  const { onGoogleSignup } = useRegisterFormContext()

  return (
    <div className='flex my-4'>
      <button
        onClick={onGoogleSignup}
        className='bg-white text-black px-4 py-2 rounded-lg w-full border border-gray-400 flex items-center justify-center'>
        <FcGoogle className='w-8 h-8 mr-2' />
        <span>Đăng ký bằng Google</span>
      </button>
    </div>
  )
}

Form.LoginLink = function LoginLink() {
  return (
    <div className='flex justify-center mb-4'>
      <p>Bạn đã có tài khoản? </p>
      <Link
        href='/auth/login'
        className='text-red-500 font-semibold ml-2'>
        Đăng nhập ngay
      </Link>
    </div>
  )
}

const useRegisterFormContext = () => {
  const formMethods = useFormContext<CredentialsRegister>()
  const { formState, reset, setFocus } = formMethods
  const [isRedirecting, { on: onRedirecting }] = useBoolean()
  const router = useRouter()
  const params = useSearchParams()
  const callbackParam = params.get('callbackUrl')
  const callbackUrl = useMemo(
    () => (callbackParam ? decodeURIComponent(callbackParam) : '/'),
    [callbackParam],
  )
  useEffect(() => {
    router.prefetch(callbackUrl)
  }, [callbackUrl, router])
  const [errorState, setErrorState] = useState('')

  const { mutateAsync } = useRegister<CredentialsRegister>()

  const onGoogleSignup = async () => {
    reset(undefined, {
      keepDirtyValues: true,
      keepValues: true,
      keepIsValid: true,
      keepErrors: false,
    })
    const result = await firebaseAuth.login({
      providerName: 'google.com',
    })
    handlePostSuccess(result)
  }

  const onFormSubmit = async (value: CredentialsRegister) => {
    try {
      console.log('value', value)
      const result = await mutateAsync({
        ...value,
        providerName: IAuthProvider.credentials,
      })
      handlePostSuccess(result)
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error('Error during registration:', error)
      setErrorState('Đã xảy ra lỗi trong quá trình đăng ký.')
    }
  }

  //todo: redirect page to callbackUrl when sign up successfully like login page
  const handlePostSuccess = (data: AuthActionResponse) => {
    console.log('data', data)
    const { success, error } = data as AuthActionResponse
    if (success) {
      onRedirecting()
      router.push(callbackUrl)
      return
    }
    if (error) {
      setErrorState(`${error?.message}`)
      reset(undefined, {
        keepValues: true,
        keepTouched: false,
      })
      setFocus('email')
    }
  }

  return {
    ...formMethods,
    onGoogleSignup,
    onFormSubmit,
  }
}
export { Form as RegisterForm }
