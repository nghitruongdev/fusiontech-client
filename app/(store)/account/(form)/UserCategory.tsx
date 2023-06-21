"use client";
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import {FaRegUserCircle,
        FaClipboardList,
        FaRegListAlt,
        FaMapMarkedAlt,
        FaRegBell,
        FaRegEnvelope,
        FaSearchLocation,
        FaRegHeart
         } from "react-icons/fa";
import OrderManagement from "./OrderForm";
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
function UserOptions() {
    const [selectedItem, setSelectedItem] = useState('');

    const handleItemClick = (item:string) => {
        setSelectedItem(item);
    };

    const username = 'ReallllToo'
    const imageUrl = 'https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes-thumbnail.png';
    return (
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
                    <li className={`flex items-center ${selectedItem === 'account' ? ' text-blue-700 font-semibold' : 'hover:bg-gray-100 hover:text-blue-700 hover:font-semibold'}`}>
                        <FaRegUserCircle className='text-gray-400' />
                        <button className='ml-2' onClick={() => handleItemClick('account')}>
                            <Link to="/account/account-infomation">Thông tin tài khoản</Link>
                        </button>
                    </li>
                    <li className={`flex items-center ${selectedItem === 'order' ? ' text-blue-700 font-semibold' : 'hover:bg-gray-100 hover:text-blue-700 hover:font-semibold'}`}>
                        <FaRegListAlt className='text-gray-400' />
                        <button className="ml-2" onClick={() => handleItemClick('order')}>
                            <Link to="/account/order-form">Quản lý đơn hàng</Link>
                        </button>
                    </li>
                    <li className={`flex items-center ${selectedItem === 'favorite' ? ' text-blue-700 font-semibold' : 'hover:bg-gray-100 hover:text-blue-700 hover:font-semibold'}`}>
                        <FaRegHeart className='text-gray-400' />
                        <button className="ml-2" onClick={() => handleItemClick('favorite')}>
                            <Link to="/account/favorite">Sản phẩm yêu thích</Link>
                        </button>
                    </li>
                    <li className={`flex items-center ${selectedItem === 'notification' ? ' text-blue-700 font-semibold' : 'hover:bg-gray-100 hover:text-blue-700 hover:font-semibold'}`}>
                        <FaRegBell className='text-gray-400' />
                        <button className="ml-2" onClick={() => handleItemClick('notification')}>Thông báo</button>
                    </li>
                    <li className={`flex items-center ${selectedItem === 'newsletter' ? ' text-blue-700 font-semibold' : 'hover:bg-gray-100 hover:text-blue-700 hover:font-semibold'}`}>
                        <FaRegEnvelope className='text-gray-400' />
                        <button className="ml-2" onClick={() => handleItemClick('newsletter')}>Bản tin</button>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default UserOptions;
