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
import PasswordInput from '@components/ui/PasswordInput'
import { cn } from 'components/lib/utils'
import useMyToast from '@/hooks/useToast'
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth'

type PasswordForm = {
  oldPassword: string
  newPassword: string
  confirmNewPassword: string
}
const ChangePasswordPage = () => {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordForm>({})

  const translate = useTranslate()
  const [currentPasswordError, setCurrentPasswordError] = useState<
    string | null
  >(null)
  const router = useRouter()

  // Tạo một instance của useToast()
  const toast = useMyToast()
  const changePasswordSubmit = async (data: PasswordForm) => {
    try {
      const user = firebaseAuth.auth.currentUser

      if (user !== null) {
        const userEmail = user.email
        if (userEmail !== null) {
          // Sử dụng reauthenticateWithCredential để xác thực lại người dùng
          try {
            const credential = EmailAuthProvider.credential(
              userEmail,
              data.oldPassword,
            )
            await reauthenticateWithCredential(user, credential)
          } catch (error) {
            setCurrentPasswordError('Mật khẩu hiện tại không chính xác')
            return
          }
          // Nếu xác thực thành công, đặt lại trạng thái lỗi
          setCurrentPasswordError(null)
          // Cập nhật mật khẩu mới
          const result = await updatePassword(user, data.newPassword)

          // Cập nhật mật khẩu thành công
          toast
            .ok({
              title: 'Thành công',
              message: 'Đổi mật khẩu thành công',
            })
            .fire()
          // Chuyển hướng về trang chủ
          router.push('/') // Thay đổi đường dẫn tùy theo cấu hình của bạn
        } else {
          // Không có email của người dùng
          console.error('Không tìm thấy email của người dùng')
        }
      } else {
        // Không có người dùng đang đăng nhập
        console.error('Không tìm thấy thông tin người dùng')
      }
    } catch (error) {
      // Xác thực không thành công hoặc cập nhật mật khẩu thất bại
      setCurrentPasswordError('Mật khẩu hiện tại không đúng')
      console.error(error)
    }
  }
  return (
    <AuthPage title={'Đổi mật khẩu'}>
      <form
        onSubmit={handleSubmit(changePasswordSubmit)}
        className='grid gap-4 w-full mt-4'>
        <FormControl
          isInvalid={!!errors?.oldPassword || !!currentPasswordError}>
          <PasswordInput
            id='oldPassword'
            type='password'
            h={12}
            placeholder='Mật khẩu hiện tại'
            {...register('oldPassword', {
              required: 'Nhập mật khẩu hiện tại',
              pattern: {
                value: /^.{8,}$/,
                message: 'Mật khẩu phải có ít nhất 8 ký tự.',
              },
            })}
          />
          <FormErrorMessage>
            {currentPasswordError || errors.oldPassword?.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors?.newPassword}>
          <PasswordInput
            id='newPassword'
            type='password'
            h={12}
            placeholder='Mật khẩu mới'
            {...register('newPassword', {
              required: 'Nhập mật khẩu mới',
              pattern: {
                value: /^.{8,}$/,
                message: 'Mật khẩu phải có ít nhất 8 ký tự.',
              },
            })}
          />
          <FormErrorMessage>{errors.newPassword?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors?.confirmNewPassword}>
          <FormLabel htmlFor='confirmPassword'></FormLabel>
          <PasswordInput
            id='confirmPassword '
            type='password'
            h={12}
            placeholder='Xác nhận mật khẩu mới'
            showHelperText={true}
            {...register('confirmNewPassword', {
              required: 'Vui lòng xác nhận mật khẩu mới',
              validate: (val: any) => {
                if (watch('newPassword') != val) {
                  return translate(
                    'pages.updatePassword.errors.confirmPasswordNotMatch',
                    'Xác nhận mật khẩu không trùng khớp!',
                  )
                }
                return
              },
            })}
          />
          <FormErrorMessage>
            {`${errors.confirmNewPassword?.message}`}
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
export default ChangePasswordPage
