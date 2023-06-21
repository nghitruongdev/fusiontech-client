"use client";
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import UserOptions from "./(form)/UserCategory";
import OrderManagement from "./(form)/OrderForm";
import OrderDetail from "./(form)/OrderDetail"
import AccountInfomation from './(form)/AccountInfo';
import Favorite from './(form)/Favorite';
import { Router } from 'next/router';

const UserOptionsPage = () => {

    return (
        <BrowserRouter>
            <div className="bg-gray-50">

                <div className="min-h-screen flex w-4/5 mx-auto max-w-7xl">
                    <div className=" w-1/4 p-4 ">
                        <UserOptions/>
                        
                    </div>
                    <div className="w-3/4  p-4 ">              
                        <Routes>
                            <Route path="/account/order-form" element={<OrderManagement />} />
                            <Route path="/account/order-detail" element={<OrderDetail />} />
                            <Route path="/account/account-infomation" element={<AccountInfomation/>} />
                            <Route path="/account/favorite" element={<Favorite />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </BrowserRouter>
        
    );
};
export default UserOptionsPage;
