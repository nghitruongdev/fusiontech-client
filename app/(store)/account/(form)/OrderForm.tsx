"use client";
import React, { useState, useEffect,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBoxOpen } from "react-icons/fa";
const OrderManagement = () => {


  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/account/order-detail');
  };

  const orders = [
    {
      id: 1,
      orderCode: 'DH001',
      purchaseDate: '2023-06-10',
      products: ['Ram 16g', 'Laptop MSI Bravo 15'],
      totalPrice: 100000,
      status: 'Đã thanh toán',
    },
    {
        id: 2,
        orderCode: 'DH002',
        purchaseDate: '2023-06-10',
        products: ['Iphone 14'],
        totalPrice: 500,
        status: 'Đã thanh toán',
      },
      {
        id: 3,
        orderCode: 'DH003',
        purchaseDate: '2023-06-10',
        products: ['CPU'],
        totalPrice: 100,
        status: 'Đã hoàn thành',
      },
      {
        id: 4,
        orderCode: 'DH004',
        purchaseDate: '2023-06-10',
        products: ['CHIP'],
        totalPrice: 100,
        status: 'Đã hoàn thành',
      }

  ];
  
  

    const [selectedOption, setSelectedOption] = useState('');
  
    const handleOptionClick = (option:string) => {
      setSelectedOption(option);
    };
  
    const filteredOrders = orders.filter((order) => order.status === selectedOption);
  
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
      // Chọn nút button khi trang web được tải (nếu buttonRef.current tồn tại)
      if (buttonRef.current) {
        buttonRef.current.click();
      }
    }, []);


  return (
    <div className="">
        <div className="flex justify-between mb-4">
            <div className=''>
                <h1 className="text-xl font-semibold">Quản lý đơn hàng</h1>
            </div>  
            <div className="">
                <button
                    className={`${
                    selectedOption === 'Chưa thanh toán' ? 'bg-gray-100 text-blue-700' : 'bg-white text-gray-500'
                    } px-2 py-2 rounded-l-sm text-sm`}
                    ref={buttonRef}
                    onClick={() => handleOptionClick('Chưa thanh toán')}
                    
                >
                Chờ thanh toán
                </button>
                <button
                    className={`${
                    selectedOption === 'Đã thanh toán' ? 'bg-gray-100 text-blue-700' : 'bg-white text-gray-500'
                    } px-4 py-2 text-sm`}
                    onClick={() => handleOptionClick('Đã thanh toán')}
                >
                Chờ giao hàng
                </button>
                <button
                    className={`${
                    selectedOption ==='Đã hoàn thành' ? 'bg-gray-100 text-blue-700' : 'bg-white text-gray-500'
                    } px-4 py-2 rounded-r-sm text-sm`}
                    onClick={() => handleOptionClick('Đã hoàn thành')}
                >
                Đã hoàn thành
                </button>
            </div>   
        </div>
        <div className="h-screen bg-white rounded-lg overflow-y-auto">
          {filteredOrders.length === 0 ? (
            <div className="flex justify-center items-center mt-20">
              <div className="flex flex-col items-center">
                <FaBoxOpen className="w-40 h-40 text-gray-300" />
                <p className="text-center py-4">Bạn không có đơn hàng nào</p>
              </div>
          </div>  
          ) : (
            <table className="text-center  w-full">
                <thead>
                    <tr>
                    <th className="px-4 py-4">Mã đơn hàng</th>
                    <th className="px-4 py-4">Ngày mua</th>
                    <th className="px-4 py-4">Sản phẩm</th>
                    <th className="px-4 py-4">Tổng tiền (VND)</th>
                    <th className="px-4 py-4">Trạng thái</th>
                    </tr>    
                </thead>
                <tbody>
                    {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-t">
                        <td className="px-4 py-4 text-blue-500"onClick={handleClick}>{order.orderCode} </td>
                        <td className="px-4 py-4">{order.purchaseDate}</td>
                        <td className="px-4 py-4">{order.products.join(', ')}</td>
                        <td className="px-4 py-4">{order.totalPrice}</td>
                        <td className="px-4 py-4 text-blue-500">{order.status}</td>
                    </tr>
                    ))}
                </tbody>
            </table>
          )}
        </div>
 
        
   
    </div>
  );
};

export default OrderManagement;

