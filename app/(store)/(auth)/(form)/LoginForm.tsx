"use client";
import React from "react";
import { loginImg } from "@public/assets/images";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
const LoginForm = () => {
    return (
        <div className="flex justify-center bg-white min-h-screen">
            <div className="w-2/4 px-20">
                <div className="flex justify-center mt-8">
                    <Image
                        src={loginImg} // Đường dẫn đến hình ảnh trên máy
                        alt="Login img"
                        className="w-56 h-auto"
                    />
                </div>
                <h2 className="text-xl text-center font-bold mb-4">
                    Đăng nhập tài khoản FusionTech
                </h2>
                <div className="mb-4">
                    <input
                        type="phone/mail"
                        placeholder="Nhập số điện thoại/ email"
                        className="bg-gray-50 w-full rounded-md px-4 py-2 mb-4 focus: border placeholder:font-normal placeholder:text-sm"
                    />
                    <input
                        type="password"
                        placeholder="Nhập mật khẩu"
                        className="bg-gray-50 w-full rounded-md px-4 py-2 mb-2 focus: border placeholder:font-normal placeholder:text-sm"
                    />
                    <Link
                        href={"/forgot-password"}
                        className=" text-sm text-gray-500"
                    >
                        Quên mật khẩu?
                    </Link>
                </div>

                <div className="flex flex-col items-center mb-4">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full h-12 shadow-md">
                        Đăng nhập
                    </button>
                </div>
                <div className="flex gap-4 items-center">
                    <hr className="flex-grow" />
                    <p className="text-center text-sm">Hoặc</p>
                    <hr className="flex-grow" />
                </div>
                <div className="flex my-4">
                    <button className="bg-white text-black px-4 py-2 rounded-lg w-full border border-gray-400 flex items-center justify-center">
                        <FcGoogle className="w-8 h-8 mr-2" />
                        <span>Đăng nhập bằng Google</span>
                    </button>
                </div>

                <div className="flex justify-center ">
                    <p>Bạn chưa có tài khoản? </p>
                    <Link
                        href="/register"
                        className="text-red-500 font-semibold ml-2"
                    >
                        Đăng ký ngay
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;

// const ForgetPasswordForm= () => {
//   return (

//   );
// };

// export default ForgetPasswordForm;
