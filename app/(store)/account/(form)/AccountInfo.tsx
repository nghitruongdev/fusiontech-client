import { useState } from "react";
import React from 'react';
import {FaRegEdit} from "react-icons/fa";
function AccountInfomation() {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleEditClick = () => {
    setIsEditOpen(!isEditOpen);
  };
  return (
    <div className="flex">
      <div className="w-2/3 p-4 bg-white rounded-lg">
        <h2 className="text-xl font-semibold">Thông tin tài khoản</h2>
        <form className="mt-2">
          <div className="mb-4">
            <label htmlFor="fullName" className="block mb-1 text-sm ">Họ và tên:</label>
            <input type="text" id="fullName" className="w-full border border-gray-300 rounded-md px-3 py-2" />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1 text-sm ">Email:</label>
            <input type="email" id="email" className="w-full border border-gray-300 rounded-md px-3 py-2" />
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block mb-1 text-sm ">Số điện thoại:</label>
            <input type="tel" id="phone" className="w-full border border-gray-300 rounded-md px-3 py-2" />
          </div>
          <div className="mb-4">
            <label htmlFor="birthdate" className="block mb-1 text-sm ">Ngày sinh:</label>
            <input type="date" id="birthdate" className="w-full border border-gray-300 rounded-md px-3 py-2" />
          </div>
          <div className="mb-4">
            <label htmlFor="gender" className="block mb-1 text-sm ">Giới tính:</label>
            <select id="gender" className="w-full border border-gray-300 rounded-md px-3 py-2">
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
            </select>
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Cập nhật</button>
        </form>
      </div>
      <div className=" w-1/3 p-4 bg-white ml-4 rounded-lg h-fit">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Địa chỉ mặc định</h2>
        <FaRegEdit className="w-5 h-5 text-gray-400 cursor-pointer" onClick={handleEditClick} />
      </div>
      {!isEditOpen ? (
        <form className="mt-2">
          <div className="mb-4">
            <label htmlFor="city" className="block mb-1 text-sm ">Tỉnh/Thành phố</label>
            <input type="text" id="city" className="w-full border border-gray-300 rounded-md px-3 py-2"disabled />
          </div>
          <div className="mb-4">
            <label htmlFor="district" className="block mb-1 text-sm ">Quận/Huyện</label>
            <input type="text" id="district" className="w-full border border-gray-300 rounded-md px-3 py-2"disabled />
          </div>
          <div className="mb-4">
            <label htmlFor="ward" className="block mb-1 text-sm ">Phường/Xã</label>
            <input type="text" id="ward" className="w-full border border-gray-300 rounded-md px-3 py-2"disabled />
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="block mb-1 text-sm ">Địa chỉ cụ thể</label>
            <input type="text" id="address" className="w-full border border-gray-300 rounded-md px-3 py-2"disabled />
          </div>
        </form>
      ) : (
        <div className="fixed inset-0 flex items-center justify-center mt-40 bg-black bg-opacity-50">
          <div className=" w-1/3 p-4 bg-white rounded-lg">
            <form>
              <h2 className="text-xl font-semibold mb-4">Thông tin người nhận hàng</h2>
              <div className="mb-4">
                <label htmlFor="city" className="block mb-1 text-sm ">Họ tên</label>
                <input type="text" id="name" className="w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div className="mb-4">
                <label htmlFor="city" className="block mb-1 text-sm ">Số điện thoại</label>
                <input type="text" id="phone" className="w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div className="mb-4">
                <label htmlFor="city" className="block mb-1 text-sm ">Email</label>
                <input type="text" id="phone" className="w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <hr />
              <h2 className="text-xl font-semibold mb-4 mt-4">Địa chỉ nhận hàng</h2>
            
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block mb-1 text-sm">Thành phố:</label>
                  <input type="text" id="city" className="w-full border border-gray-300 rounded-md px-3 py-2"  />
                </div>
                <div>
                  <label htmlFor="district" className="block mb-1 text-sm">Quận:</label>
                  <input type="text" id="district" className="w-full border border-gray-300 rounded-md px-3 py-2"  />
                </div>
                <div>
                  <label htmlFor="ward" className="block mb-1 text-sm">Phường:</label>
                  <input type="text" id="ward" className="w-full border border-gray-300 rounded-md px-3 py-2"  />
                </div>
                <div>
                  <label htmlFor="address" className="block mb-1 text-sm">Địa chỉ cụ thể:</label>
                  <input type="text" id="address" className="w-full border border-gray-300 rounded-md px-3 py-2"  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button className="border border-blue-700 bg-white text-blue-700 px-4 py-2 rounded-md text-sm"onClick={handleEditClick}>Hủy bỏ</button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md ml-2 text-sm">Lưu thông tin</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}

export default AccountInfomation;
