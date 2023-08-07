import { useAuthUser } from '@/hooks/useAuth/useAuthUser'
import { useCustom, useUpdate } from '@refinedev/core'
import { API } from 'types/constants'
import { API_URL } from 'types/constants'
import { useState, useEffect } from 'react'
import userApi from '@/api/userAPI'
import useMyToast from '@/hooks/useToast'
import { useForm } from 'react-hook-form'
export const ProfileForm = () => {
  const { user } = useAuthUser()
  const { resource, findByFirebaseId } = API['users']()
  const { data, status } = useCustom({
    url: `${API_URL}/${findByFirebaseId(user?.uid ?? '')}`,
    method: 'get',
    queryOptions: {
      enabled: !!user,
    },
  })

  // Sử dụng Hook useState để lưu trạng thái thông tin người dùng trong form
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [gender, setGender] = useState<string>('')
  console.log(data?.data)
  useEffect(() => {
    if (data?.data.dateOfBirth) {
      setDateOfBirth(formatDate(data?.data.dateOfBirth));
    }
    if (data?.data.phoneNumber) {
      setPhoneNumber(data.data.phoneNumber);
    }
    if (data?.data.gender) {
      setGender(data.data.gender);
    }
  }, [data?.data]);

  const toast = useMyToast()
  const updateUser = async (id: string, userData: any) => {
    try {
      const response = await userApi.updateUser(id, userData)
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
      email: data?.data.email,
      firebaseUid: user?.uid,
      firstName: data?.data.fullName,
      phoneNumber: phoneNumber,
      dateOfBirth: dateOfBirth,
      gender: getValues('gender'),
    }
    updateUser(user?.uid ?? '', userData)
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
    if (data?.data.dateOfBirth) {
      setDateOfBirth(formatDate(data?.data.dateOfBirth))
    }
  }, [data?.data.dateOfBirth])

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm()

  return (
    <>
      <h2 className="text-xl font-semibold">Thông tin tài khoản</h2>
      <form className="mt-2">
        <div className="mb-4">
          <label htmlFor="fullName" className="block mb-1 text-sm ">
            Họ và tên:
          </label>
          <input
            type="text"
            id="fullName"
            value={data?.data.fullName}
            readOnly
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            {...register('Full name', { required: true })}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-1 text-sm ">
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={data?.data.email}
            readOnly
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            {...register('Email', { required: true, pattern: /^\S+@\S+$/i })}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="phone" className="block mb-1 text-sm ">
            Số điện thoại:
          </label>
          <input
            type="number"
            id="phone"
            value={phoneNumber}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            {...register('phoneNumber', {
              required: true,
              min: 10,
              max: 10,
            })}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          {errors.phoneNumber && typeof errors.phoneNumber === 'string' && (
            <span className="text-red-500">{errors.phoneNumber}</span>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="birthdate" className="block mb-1 text-sm ">
            Ngày sinh:
          </label>
          <input
            type="date"
            id="birthdate"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="gender" className="block mb-1 text-sm ">
            Giới tính:
          </label>
          <select
            id="gender"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            {...register('gender', { required: true })}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="MALE" selected={data?.data.gender === 'MALE'}>
              Nam
            </option>
            <option value="FEMALE" selected={data?.data.gender === 'FEMALE'}>
              Nữ
            </option>
            <option value="OTHER" selected={data?.data.gender === 'OTHER'}>
              Khác
            </option>
          </select>
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          type="submit"
          onClick={handleUpdateUser}
        >
          Cập nhật
        </button>
      </form>
    </>
  )
}
