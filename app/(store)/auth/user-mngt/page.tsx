/** @format */

'use client'
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useBoolean,
} from '@chakra-ui/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { HttpError, useTranslate } from '@refinedev/core'
import { verifyPasswordResetCode } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { firebaseAuth } from '@/providers/firebaseAuthProvider'
import AuthPage from '../AuthPage'
import AuthErrorCatch from '../error'
import { AppError } from 'types/error'
import Link from 'next/dist/client/link'
import Image from 'next/image'
import { loginImg } from '@public/assets/images'
type PasswordForm = {
  password: string
  confirmPassword: string
}
const UpdatePasswordPage = () => {
  const params = useSearchParams()
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordForm>({})

  const translate = useTranslate()

  const mode = params.get('mode')
  const actionCode = params.get('oobCode') ?? ''
  const continueUrl = params.get('continueUrl')
  const lang = params.get('lang') || 'en'
  const router = useRouter()
  const [showForm, { on: showFormOn }] = useBoolean()
  const [showSuccess, { on: showSuccessOn }] = useBoolean()
  const [error, setError] = useState<AppError>()
  // Handle the user management action.

  useEffect(() => {
    //todo: if not auth or no action code, redirect to the home page

    if (!!!actionCode || !!!mode) {
      router.replace('/')
      return
    }

    const verifyAction = async () => {
      try {
        const result = await verifyPasswordResetCode(
          firebaseAuth.auth,
          actionCode,
        )
        //show the login form
        showFormOn()
      } catch (error) {
        console.log('error', error)

        // const updateError = new Error(
        // );
        // updateError.name = "Đường dẫn không hợp lệ.";
        setError({
          name: 'Đường dẫn không hợp lệ.',
          message:
            'Đường dẫn không hợp lệ hoặc đã hết hạn. Vui lòng tạo một yêu cầu mới.',
        })
      }
    }
    verifyAction()
  }, [])

  const submitHandler = async (data: PasswordForm) => {
    console.log('data', data)
    const result = await firebaseAuth.updatePassword?.({
      type: 'reset',
      actionCode: actionCode,
      password: data.password,
    })

    if (result?.success) {
      showSuccessOn()
    }

    console.log('update result', result)
  }

  if (error) return <AuthErrorCatch error={error} />

  // todo: chưa có showSuccess
  if (showSuccess) {
    return (
      <>
        <Image
          src={loginImg}
          alt='Login icon'
          width='150'
        />
        <p>Đã cập nhật mật khẩu mới thành công.</p>
        <p>Bây giờ bạn có thể sử dụng mật khẩu mới để đăng nhập.</p>
        <Link href='/auth/login'>
          <Button
            mt='6'
            type='submit'
            width='full'
            colorScheme='brand'>
            {translate(
              'pages.backLogin.buttons.submit',
              'Quay trở lại đăng nhập',
            )}
          </Button>
        </Link>
      </>
    )
  }
  if (showForm)
    return (
      <AuthPage title={'Đặt lại mật khẩu'}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <FormControl
            mb='3'
            isInvalid={!!errors?.password}>
            <FormLabel htmlFor='password'>
              {translate(
                'pages.updatePassword.fields.password',
                'Mật khẩu mới',
              )}
            </FormLabel>
            <Input
              id='password'
              type='password'
              placeholder='Password'
              {...register('password', {
                required: true,
                pattern: {
                  value: /^.{8,}$/,
                  message: 'Mật khẩu phải có ít nhất 8 ký tự.',
                },
              })}
            />
            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
          </FormControl>

          <FormControl
            mb='3'
            isInvalid={!!errors?.confirmPassword}>
            <FormLabel htmlFor='confirmPassword'>
              {translate(
                'pages.updatePassword.fields.confirmPassword',
                'Xác nhận mật khẩu',
              )}
            </FormLabel>
            <Input
              id='Xác nhận mật khẩu'
              type='password'
              placeholder='Confirm Password'
              {...register('confirmPassword', {
                required: true,
                validate: (val: any) => {
                  if (watch('password') != val) {
                    return translate(
                      'pages.updatePassword.errors.confirmPasswordNotMatch',
                      'Mật khẩu không trùng khớp!',
                    )
                  }
                  return
                },
              })}
            />
            <FormErrorMessage>
              {`${errors.confirmPassword?.message}`}
            </FormErrorMessage>
          </FormControl>

          <Button
            mt='6'
            type='submit'
            width='full'
            colorScheme='brand'>
            {translate('pages.updatePassword.buttons.submit', 'Cập nhật')}
          </Button>
        </form>
      </AuthPage>
    )
}
export default UpdatePasswordPage
