import React, { useState } from "react";
import { loginImg } from "@public/assets/images";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
const RegisterForm = () => {
    const [isChecked, setIsChecked] = useState(true);

    return (
        <div className="flex justify-center bg-white min-h-screen">
            <div className="w-2/4 px-20">
                {/* <div className="flex items-center mt-4">
                    <h1 className="text-2xl font-semibold">
                        Đăng ký tài khoản
                    </h1>
                </div> */}
                <div className="flex justify-center mt-8">
                    <Image
                        src={loginImg} // Đường dẫn đến hình ảnh trên máy
                        alt="Login img"
                        className="w-56 h-auto"
                    />
                </div>
                <h2 className="text-xl text-center font-bold mb-4">
                    Đăng ký tài khoản FusionTech
                </h2>
                <div className="mb-4">
                    <input
                        type="name"
                        placeholder="Vui lòng nhập họ và tên"
                        className="bg-gray-100 w-full rounded-md px-4 py-2 mb-4 focus: border placeholder:font-medium"
                    />
                    <input
                        type="phone"
                        placeholder="Vui lòng nhập số điện thoại"
                        className="bg-gray-100 w-full rounded-md px-4 py-2 mb-4 focus: border placeholder:font-medium"
                    />
                    <input
                        type="email"
                        placeholder="Vui lòng nhập địa chỉ email"
                        className="bg-gray-100 w-full rounded-md px-4 py-2 mb-4 focus: border placeholder:font-medium"
                    />
                    <input
                        type="password"
                        placeholder="Nhập mật khẩu của bạn"
                        className="bg-gray-100 w-full rounded-md px-4 py-2 focus: border placeholder:font-medium"
                    />
                    <span className="text-xs">
                        Mật khẩu phải nhiều hơn 8 ký tự, ít nhất 1 chữ thường 1
                        chữ in hoa, 1 chữ số, 1 ký tự đặc biệt
                    </span>
                    <input
                        type="passwordConfirm"
                        placeholder="Xác nhận lại mật khẩu"
                        className="bg-gray-100 w-full rounded-md px-4 py-2 mt-4 focus: border placeholder:font-medium"
                    />
                </div>
                <div className="mb-4">
                    <label className="inline-flex items-center">
                        <input
                            type="checkbox"
                            className="form-radio text-blue-500"
                            checked={isChecked}
                        />
                        <span className="ml-2">
                            Tôi đồng ý với các điều khoản bảo mật cá nhân
                        </span>
                    </label>
                    <label className="inline-flex items-center">
                        <input
                            type="checkbox"
                            className="form-radio text-blue-500"
                            checked={isChecked}
                        />
                        <span className="ml-2">
                            Đăng ký nhận bản tin khuyến mãi qua email
                        </span>
                    </label>
                </div>

                <div className="flex flex-col items-center mb-4">
                    <button className="bg-blue-500 text-white font-semibold text-md px-4 py-2 rounded-md w-full h-12 shadow-md">
                        Đăng ký ngay
                    </button>
                </div>
                {/* <p className="text-center">Hoặc</p> */}
                <hr className="my-4" />
                <div className="flex my-4">
                    <button className="bg-white text-black px-4 py-2 rounded-lg w-full border border-gray-400 flex items-center justify-center">
                        <FcGoogle className="w-8 h-8 mr-2" />
                        <span>Đăng ký bằng Google</span>
                    </button>
                </div>

                <div className="flex justify-center mb-4">
                    <p>Bạn đã có tài khoản? </p>
                    <Link
                        href="/login"
                        className="text-red-500 font-semibold ml-2"
                    >
                        Đăng nhập ngay
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;
