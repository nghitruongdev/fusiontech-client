/** @format */

import { useAuthUser } from '@/hooks/useAuth/useAuthUser'
import { useState, useEffect } from 'react'
import useMyToast from '@/hooks/useToast'
import { useForm } from 'react-hook-form'
import { useHeaders } from '@/hooks/useHeaders'
import userApi from '@/client-api/userAPI'

export const ProfileForm = () => {
  const { getAuthHeader } = useHeaders()
  const { user, userProfile } = useAuthUser()
  const uid = userProfile?.id
  // Sử dụng Hook useState để lưu trạng thái thông tin người dùng trong form
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [gender, setGender] = useState<string>('')
  console.log(user?.uid)
  useEffect(() => {
    if (userProfile?.dateOfBirth) {
      setDateOfBirth(formatDate(userProfile.dateOfBirth))
    }
    if (userProfile?.phoneNumber) {
      setPhoneNumber(userProfile.phoneNumber)
    }
    if (userProfile?.gender) {
      setGender(userProfile.gender)
    }
  }, [userProfile])

  const toast = useMyToast()
  const updateUser = async (id: any, userData: any) => {
    try {
      const response = await userApi.updateUser(id, userData, getAuthHeader())
      const newUser = response.data // Đánh giá mới được trả về từ API
      toast
        .ok({
          title: 'Thành công',
          message: 'Cập nhật thông tin thành công',
        })
        .fire()
    } catch (error) {
      console.log('Lỗi khi cập nhật thông tin:', error)
      toast
        .fail({
          title: 'Thất bại',
          message: 'Cập nhật thông tin thất bại',
        })
        .fire()
    }
  }

  // gửi review khi user click button
  const handleUpdateUser = (event: any) => {
    event.preventDefault()
    const userData = {
      email: userProfile?.email,
      firebaseUid: user?.uid,
      firstName: userProfile?.fullName,
      phoneNumber: phoneNumber,
      dateOfBirth: dateOfBirth,
      gender: getValues('gender'),
    }
    updateUser(uid, userData)
  }

  const formatDate = (date: Date) => {
    const dateObject = new Date(date)
    const year = dateObject.getFullYear()
    const month = `${dateObject.getMonth() + 1}`.padStart(2, '0')
    const day = `${dateObject.getDate()}`.padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Sử dụng Hook useEffect để cập nhật giá trị dateOfBirth vào ô đầu vào khi component được tạo
  useEffect(() => {
    if (userProfile?.dateOfBirth) {
      setDateOfBirth(formatDate(userProfile.dateOfBirth))
    }
  }, [userProfile?.dateOfBirth])

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm()

  return (
    <>
      <h2 className='text-xl font-semibold'>Thông tin tài khoản</h2>
      <form className='mt-2'>
        <div className='mb-4'>
          <label
            htmlFor='fullName'
            className='block mb-1 text-sm '>
            Họ và tên:
          </label>
          <input
            type='text'
            id='fullName'
            value={userProfile?.fullName}
            readOnly
            className='w-full border border-gray-300 rounded-md px-3 py-2'
            {...register('Full name', { required: true })}
          />
        </div>
        <div className='mb-4'>
          <label
            htmlFor='email'
            className='block mb-1 text-sm '>
            Email:
          </label>
          <input
            type='email'
            id='email'
            value={userProfile?.email}
            readOnly
            className='w-full border border-gray-300 rounded-md px-3 py-2'
            {...register('Email', { required: true, pattern: /^\S+@\S+$/i })}
          />
        </div>
        <div className='mb-4'>
          <label
            htmlFor='phone'
            className='block mb-1 text-sm '>
            Số điện thoại:
          </label>
          <input
            type='text'
            id='phone'
            value={phoneNumber}
            className='w-full border border-gray-300 rounded-md px-3 py-2'
            {...register('phoneNumber', {
              required: true,
              min: 10,
              max: 11,
            })}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          {errors.phoneNumber && typeof errors.phoneNumber === 'string' && (
            <span className='text-red-500'>{errors.phoneNumber}</span>
          )}
        </div>
        <div className='mb-4'>
          <label
            htmlFor='birthdate'
            className='block mb-1 text-sm '>
            Ngày sinh:
          </label>
          <input
            type='date'
            id='birthdate'
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            className='w-full border border-gray-300 rounded-md px-3 py-2'
          />
        </div>
        <div className='mb-4'>
          <label
            htmlFor='gender'
            className='block mb-1 text-sm '>
            Giới tính:
          </label>
          <select
            id='gender'
            className='w-full border border-gray-300 rounded-md px-3 py-2'
            {...register('gender', { required: true })}
            onChange={(e) => setGender(e.target.value)}>
            <option
              value='MALE'
              selected={userProfile?.gender === 'MALE'}>
              Nam
            </option>
            <option
              value='FEMALE'
              selected={userProfile?.gender === 'FEMALE'}>
              Nữ
            </option>
            <option
              value='OTHER'
              selected={userProfile?.gender === 'OTHER'}>
              Khác
            </option>
          </select>
        </div>
        <button
          className='bg-blue-500 text-white px-4 py-2 rounded-md'
          type='submit'
          onClick={handleUpdateUser}>
          Cập nhật
        </button>
      </form>
    </>
  )
}
