"use client";
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import UserOptions from "./(form)/UserCategory";
import OrderManagement from "./(form)/OrderForm";
import OrderDetail from "./(form)/OrderDetail"
import { Router } from 'next/router';
import {FaRegUserCircle,
    FaClipboardList,
    FaRegListAlt,
    FaMapMarkedAlt,
    FaRegBell,
    FaRegEnvelope,
    FaSearchLocation
     } from "react-icons/fa";
const UserOptionsPage = () => {

    const username = 'ReallllToo'
    const imageUrl = 'https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes-thumbnail.png';
    
    return (
        <BrowserRouter>
        <div className="bg-gray-50">

            <div className="min-h-screen flex w-4/5 mx-auto max-w-7xl">
                <div className=" w-1/4 p-4 ">
                <div className="items-center">
            <div className='flex items-center'>
                <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img src={imageUrl} alt="User" className="w-full h-full object-cover" />
                </div>
                <div className="flex-col items-start ml-2">
                    <h4>Tài khoản của:</h4>
                    <h3 className="text-lg font-semibold">{username}</h3>
                </div>
            </div>         
            <div className="">
                <ul className="mt-3 space-y-3 ">
                    <li className="flex items-center hover:bg-gray-100 hover:text-blue-700 hover:font-semibold">
                        <FaRegUserCircle className='text-gray-400'/>
                        <button className='ml-2'>Thông tin tài khoản</button>
                    </li>
                    <li className="flex items-center hover:bg-gray-100 hover:text-blue-700 hover:font-semibold">
                        <FaRegListAlt className='text-gray-400'/>
                        <button className="ml-2">
                            <Link to="/order-form">Quản lý đơn hàng</Link>
                        </button>
                    </li>
                    <li className="flex items-center hover:bg-gray-100 hover:text-blue-700 hover:font-semibold">
                        <FaSearchLocation className='text-gray-400'/>
                        <button className="ml-2">Sổ địa chỉ</button>
                    </li>
                    <li className="flex items-center hover:bg-gray-100 hover:text-blue-700 hover:font-semibold">
                        <FaRegBell className='text-gray-400'/>
                        <button className="ml-2">Thông báo</button>
                    </li>
                    <li className="flex items-center hover:bg-gray-100 hover:text-blue-700 hover:font-semibold">
                        <FaRegEnvelope className='text-gray-400'/>
                        <button className="ml-2">Bản tin</button>
                    </li>
                </ul>
            </div>
        </div>
                    
                </div>
                <div className="w-3/4  p-4 ">
                                        

                        <Routes>
                            <Route path="/order-form" element={<OrderManagement />} />
                            <Route path="/order-detail" element={<OrderDetail />} />
                        </Routes>
                    
                </div>
            </div>
        </div>
        </BrowserRouter>
    );
};
export default UserOptionsPage;
