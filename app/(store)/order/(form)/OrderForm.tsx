"use client";
import React, { useState } from 'react';

const OrderManagement = () => {


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
        status: 'Chưa thanh toán',
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
                      <td className="px-4 py-4 text-blue-500">{order.orderCode}</td>
                      <td className="px-4 py-4">{order.purchaseDate}</td>
                      <td className="px-4 py-4">{order.products.join(', ')}</td>
                      <td className="px-4 py-4">{order.totalPrice}</td>
                      <td className="px-4 py-4 text-blue-500">{order.status}</td>
                  </tr>
                  ))}
              </tbody>
          </table>
        </div>
 
        
   
    </div>
  );
};

export default OrderManagement;
