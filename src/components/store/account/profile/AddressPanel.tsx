import { useBoolean } from '@chakra-ui/react'
import { Edit } from 'lucide-react'

export const AddressPanel = () => {
  const [isShow, { on: show, off: close, toggle }] = useBoolean()
  const isDefaultExists = true
  return (
    <div className={`min-w-[230px]`}>
      <div className={`flex justify-between items-center mb-2`}>
        <h2 className="text-xl font-bold">Địa chỉ mặc định</h2>
        {isDefaultExists && (
          <Edit
            className="w-5 h-5 text-gray-400 cursor-pointer"
            onClick={toggle}
          />
        )}
      </div>
      <AddressContent showModal={isShow} />
    </div>
  )
}

const AddressContent = ({ showModal }: { showModal: boolean }) => {
  if (!showModal) {
    return (
      <form className="mt-2">
        <div className="mb-4 ">
          <label htmlFor="fullName" className="block mb-1 text-sm ">
            Tỉnh/Thành phố
          </label>
          <input
            type="text"
            id="fullName"
            readOnly
            className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2"
            // {...register('Full name', { required: true })}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="fullName" className="block mb-1 text-sm ">
            Quận/Huyện
          </label>
          <input
            type="text"
            id="fullName"
            readOnly
            className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2"
            // {...register('Full name', { required: true })}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="fullName" className="block mb-1 text-sm ">
            Phường xã
          </label>
          <input
            type="text"
            id="fullName"
            readOnly
            className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2"
            // {...register('Full name', { required: true })}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="fullName" className="block mb-1 text-sm ">
            Địa chỉ cụ thể
          </label>
          <input
            type="text"
            id="fullName"
            readOnly
            className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2"
            // {...register('Full name', { required: true })}
          />
        </div>
      </form>
    )
  } else
    return (
      <>
        <div className="fixed inset-0 flex items-center justify-center  bg-black bg-opacity-50 z-50">
          <form className="flex flex-col w-1/3 p-4 bg-white rounded-lg ">
            <h2 className="text-xl font-bold mb-4">
              Thông tin người nhận hàng
            </h2>
            <div className="mb-4 ">
              <label htmlFor="fullName" className="block mb-1 text-sm ">
                Họ và tên
              </label>
              <input
                type="text"
                id="fullName"
                className="w-full  border border-gray-300 rounded-md px-3 py-2"
                // {...register('Full name', { required: true })}
              />
            </div>
            <div className="mb-4 ">
              <label htmlFor="phoneNumber" className="block mb-1 text-sm ">
                Số điện thoại
              </label>
              <input
                type="text"
                id="phoneNumber"
                className="w-full  border border-gray-300 rounded-md px-3 py-2"
                // {...register('Full name', { required: true })}
              />
            </div>
            <h2 className="text-xl font-bold mb-4">Địa chỉ nhận hàng</h2>
            <div className="flex space-x-2">
              <div className="mb-4 ">
                <label htmlFor="phoneNumber" className="block mb-1 text-sm ">
                  Tỉnh/Thành phố
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  className="w-full  border border-gray-300 rounded-md px-3 py-2"
                  // {...register('Full name', { required: true })}
                />
              </div>
              <div className="mb-4 ">
                <label htmlFor="phoneNumber" className="block mb-1 text-sm ">
                  Quận/Huyện
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  className="w-full  border border-gray-300 rounded-md px-3 py-2"
                  // {...register('Full name', { required: true })}
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <div className="mb-4 ">
                <label htmlFor="phoneNumber" className="block mb-1 text-sm ">
                  Phường/Xã
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  className="w-full  border border-gray-300 rounded-md px-3 py-2"
                  // {...register('Full name', { required: true })}
                />
              </div>
              <div className="mb-4 ">
                <label htmlFor="phoneNumber" className="block mb-1 text-sm ">
                  Địa chỉ cụ thể
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  className="w-full  border border-gray-300 rounded-md px-3 py-2"
                  // {...register('Full name', { required: true })}
                />
              </div>
            </div>
            <div className="flex space-x-2 justify-end mt-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                type="submit"
                // onClick={handleUpdateUser}
              >
                Hủy bỏ
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                type="submit"
                // onClick={handleUpdateUser}
              >
                Lưu địa chỉ
              </button>
            </div>
          </form>
        </div>
      </>
    )
}
