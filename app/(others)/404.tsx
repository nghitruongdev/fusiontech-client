import { errorImg } from "../../public/assets/images";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { AiOutlineHome } from "react-icons/ai";
import { BsArrowLeft } from "react-icons/bs";

const Custom404 = () => {
    return (
        // <div className="w-full flex flex-col items-center justify-center pb-2">
        //     <Image
        //         src={notFoundImg}
        //         alt="notFoundImg"
        //         className="w-full h-[550px] object-cover"
        //     />
        //     <Link href="/">
        //         <button className="mt-2 text-sm hover:text-[#004f9a] hover:underline underline-offset-4">
        //             Back to Home
        //         </button>
        //     </Link>
        // </div>
        <div className="flex items-center justify-center h-screen">
            <div className="flex items-center justify-center">
                <div className="mr-8">
                    <div className=" my-10">
                        <h1 className="font-extrabold text-8xl text-red-700">
                            FusionTech
                        </h1>
                    </div>

                    <p className="text-2xl font-normal mb-10">
                        <span className="font-bold">404. </span>
                        <span className=" text-gray-400">Đây là lỗi.</span>
                    </p>
                    <p className="text-2xl font-normal ">
                        <span className="">
                            Yêu cầu URL không được tìm thấy trong hệ thống.
                        </span>
                        <br />
                        <span className=" text-gray-400">
                            Đó là tất cả những gì tôi biết.
                        </span>
                    </p>
                    <Link href="/">
                        <div className="flex items-center mt-8 text-base  text-gray-900 hover:text-blue-700">
                            <BsArrowLeft className="mr-1" />
                            Trở lại trang chủ
                        </div>
                    </Link>
                </div>
                <Image src={errorImg} alt="Error 404" className="w-96 h-96" />
            </div>
        </div>
    );
};
export default Custom404;
