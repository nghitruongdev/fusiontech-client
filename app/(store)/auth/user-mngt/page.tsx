/** @format */

'use client'
import {
  Button,
  FormControl,
  FormErrorMessage,
  useBoolean,
} from '@chakra-ui/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useCustomMutation, useTranslate, useUpdate } from '@refinedev/core'
import { verifyPasswordResetCode, applyActionCode } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { firebaseAuth } from '@/providers/firebaseAuthProvider'
import AuthPage from '../AuthPage'
import AuthErrorCatch from '../error'
import { AppError } from 'types/error'
import Link from 'next/dist/client/link'
import Image from 'next/image'
import { loginImg } from '@public/assets/images'
import PasswordInput from '@components/ui/PasswordInput'
import { cn } from 'components/lib/utils'
import { useCountdown, useIsMounted } from 'usehooks-ts'
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
  const { mutate } = useCustomMutation()
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

    const verifyEmail = async () => {
      try {
        await applyActionCode(firebaseAuth.auth, actionCode)
        //todo: send request to database to update isVerified field
        // mutate({
        //   url: '',
        //   method: 'patch',
        //   values: {
        //     id: firebaseAuth.auth.currentUser?.uid,
        //     verified: true,
        //   },
        // })
      } catch (err) {
        console.log('error', err)
      }
      setError({
        name: 'Đường dẫn không hợp lệ.',
        message:
          'Đường dẫn không hợp lệ hoặc đã hết hạn. Vui lòng tạo một yêu cầu mới.',
        statusCode: 400,
      })
    }
    const verifyPasswordResetAction = async () => {
      try {
        const result = await verifyPasswordResetCode(
          firebaseAuth.auth,
          actionCode,
        )
      } catch (error) {
        console.log('error', error)

        // const updateError = new Error(
        // );
        // updateError.name = "Đường dẫn không hợp lệ.";
        setError({
          name: 'Đường dẫn không hợp lệ.',
          message:
            'Đường dẫn không hợp lệ hoặc đã hết hạn. Vui lòng tạo một yêu cầu mới.',
          statusCode: 400,
        })
      }
    }

    switch (mode) {
      case 'verifyEmail':
        verifyEmail()
        break
      case 'resetPassword':
        verifyPasswordResetAction()
    }
  }, [actionCode, mode, router, showFormOn])

  const submitHandler = async (data: PasswordForm) => {
    console.log('data', data)
    const result = await firebaseAuth.updatePassword?.({
      type: 'reset',
      actionCode: actionCode,
      password: data.password,
    })
    //localhost:3000/auth/user-mngt?mode=action&oobCode=code
    http: if (result?.success) {
      showSuccessOn()
    }

    console.log('update result', result)
  }

  if (error) return <AuthErrorCatch error={error} />

  // todo: chưa có showSuccess
  if (showSuccess) {
    return <SuccessMessage />
  }
  if (showForm)
    return (
      <AuthPage title={'Đặt lại mật khẩu'}>
        <form
          onSubmit={handleSubmit(submitHandler)}
          className='grid gap-4 w-full mt-4'>
          <FormControl isInvalid={!!errors?.password}>
            {/* <FormLabel htmlFor='password'>
              {translate(
                'pages.updatePassword.fields.password',
                'Mật khẩu mới',
              )}
            </FormLabel> */}
            <PasswordInput
              id='password'
              type='password'
              h={12}
              placeholder='Mật khẩu'
              {...register('password', {
                required: 'Nhập mật khẩu mới',
                pattern: {
                  value: /^.{8,}$/,
                  message: 'Mật khẩu phải có ít nhất 8 ký tự.',
                },
              })}
            />
            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors?.confirmPassword}>
            {/* <FormLabel htmlFor='confirmPassword'>
              {translate(
                'pages.updatePassword.fields.confirmPassword',
                'Xác nhận mật khẩu',
              )}
            </FormLabel> */}
            <PasswordInput
              id='Xác nhận mật khẩu'
              type='password'
              h={12}
              placeholder='Xác nhận mật khẩu'
              showHelperText={true}
              {...register('confirmPassword', {
                required: 'Vui lòng xác nhận mật khẩu',
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

          <button
            // disabled={isLoading || !!errorState}
            type='submit'
            className={cn(
              'bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 mt-4 rounded-lg w-full h-12 shadow-sm',
              'disabled:cursor-not-allowed',
            )}>
            {translate('pages.updatePassword.buttons.submit', 'Cập nhật')}
          </button>
        </form>
      </AuthPage>
    )
}

const SuccessMessage = () => {
  const translate = useTranslate()
  const router = useRouter()
  const [countDown, { startCountdown }] = useCountdown({
    countStart: 5,
    intervalMs: 1000,
  })
  const isMounted = useIsMounted()

  useEffect(() => {
    if (isMounted()) {
      router.prefetch('/auth/login')
      startCountdown()
    }
  }, [isMounted, router, startCountdown])
  useEffect(() => {
    if (countDown === 0) {
      router.replace('/auth/login')
    }
  }, [countDown, router])
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
          //   type='submit'
          width='full'
          colorScheme='blue.600'
          variant={'link'}>
          {translate(
            'pages.backLogin.buttons.submit',
            `Quay lại trang đăng nhập trong ${countDown}`,
          )}
        </Button>
      </Link>
    </>
  )
}
export default UpdatePasswordPage
