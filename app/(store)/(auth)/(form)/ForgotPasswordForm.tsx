import React from "react";
import { loginImg } from "@public/assets/images";
import Image from "next/image";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { ImMail4 } from "react-icons/im";
const ForgotPasswordForm = () => {
    const LoginClick = () => {
        //  navigate('/dangnhap/login-form');
    };

    return (
        <div className="flex justify-center bg-white min-h-screen">
            <div className="w-2/4 px-20">
                <div className="flex items-center mt-4">
                    <button className="bg-white rounded-md mr-2 hover:bg-blue-700 ">
                        <BiChevronLeft
                            className="w-8 h-8 text-gray-500 hover:text-white"
                            onClick={LoginClick}
                        />
                    </button>
                    <h1 className="text-2xl font-semibold">Quên mật khẩu</h1>
                </div>
                <div className="flex justify-center my-8">
                    <Image
                        src={loginImg} // Đường dẫn đến hình ảnh trên máy
                        alt="Login img"
                        className="w-56 h-auto"
                    />
                </div>
                <a className="text-gray-500 text-sm">
                    Gửi mã xác nhận để lấy lại mật khẩu
                </a>

                <div className="flex my-4">
                    <button className="bg-white text-black px-4 py-2 rounded-lg w-full border border-solid border-blue-500  flex items-center">
                        <ImMail4 className="mr-2 w-10 h-12 text-blue-500" />
                        <div className="flex flex-col text-left">
                            <span className="text-xs text-gray-500">
                                Qua email
                            </span>
                            <span className="font-semibold">
                                realllltoo@gmail.com
                            </span>
                        </div>
                    </button>
                </div>
                <div className="flex flex-col items-center mb-4">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full h-12 shadow-md">
                        Tiếp tục
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordForm;
