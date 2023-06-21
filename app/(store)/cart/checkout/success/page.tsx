  import Link from "next/link";
  import {
    successfulImg,
    successful2Img
  } from "public/assets/images";
  import Image from "next/image";
  import React from "react";

  const SuccessPage = () => {
      const orderDetails = {
        orderId: '123456',
        user: 'ReallllToo',
        total: '2000000',
        paymentMethod: 'Paypal',
        date:'16/06/2023 12:00:00 AM',
        items: [
          {id: '1', variant: 'Product 1', quantity: 1 },
          {id: '2', variant: 'Product 2', quantity: 3 },
          {id: '3', variant: 'Product 3', quantity: 2 },
        ]
        };
      return (
        <div className="bg-white flex items-center justify-center h-screen">
          <div className="w-1/3 p-8 ">
            <Image src={successful2Img} alt="successful" className=" mb-8 w-1/3 h-auto mx-auto" />
            <h2 className="text-4xl font-semibold mb-2 text-center">Thanh toán thành công!</h2>
            <p className="text-gray-500 mb-6 text-lg text-center">Cảm ơn bạn đã mua hàng.</p>

            <div className="orderItem space-y-2">
              <div className="flex justify-between ">
                  <span className="font-semibold ">Mã đơn hàng:</span>
                  <span className="text-center">{orderDetails.orderId}</span>
              </div>
              <div className="flex justify-between ">
                  <span className="font-semibold text-right">Tên người dùng:</span>
                  <span>{orderDetails.user}</span>
              </div>
              <div className="flex justify-between ">
                  <span className="font-semibold">Phương thức thanh toán:</span>
                  <span>{orderDetails.paymentMethod}</span>
              </div>
              <div className="flex justify-between ">
                <span className="font-semibold">Ngày thanh toán:</span>
                <span>{orderDetails.date}</span>
              </div>
            </div>
            <div className="flex justify-center mt-6"> {/* Thêm lớp mt-6 để tạo khoảng cách */}
              <button className="rounded-md bg-blue-600 hover:bg-blue-700 px-4 py-3 mt-3 text-white text-base font-semibold">
                Trở về trang chủ
              </button>
            </div>
          </div>
        </div>


      );
  };
  export default SuccessPage;
