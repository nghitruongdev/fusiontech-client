import React from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

const OrderDetailPage = () => {
    return (
        <div className="mx-auto ">
            <div className="flex items-center">
                <button
                    className="bg-white rounded-md mr-2 hover:bg-blue-700 "
                    // onClick={handleClick}
                >
                    <BiChevronLeft className="w-8 h-8 text-gray-500 hover:text-white" />
                </button>
                <h1 className="text-xl font-semibold">ĐƠN HÀNG: 222</h1>
            </div>

            <div className="flex mt-6">
                <div className="w-1/2 mr-4 p-4 bg-white rounded-md">
                    <h2 className="text-base font-semibold mb-4">
                        Thông tin người nhận
                    </h2>
                    <div>
                        <p className="">
                            <span className="text-sm font-semibold">Tên:</span>
                        </p>
                        <p className="">
                            <span className=" text-sm font-semibold">
                                Địa chỉ:
                            </span>
                        </p>
                        <p className="">
                            <span className="text-sm font-semibold">
                                Số điện thoại:
                            </span>
                        </p>
                    </div>
                </div>

                <div className="w-1/2 p-4 bg-white rounded-md">
                    <h2 className="text-base font-semibold mb-4">
                        Thông tin đơn hàng
                    </h2>
                    <div>
                        <p className="">
                            <span className=" text-sm font-semibold">
                                Ngày đặt hàng:
                            </span>
                        </p>
                        <p className="">
                            <span className="text-sm font-semibold">
                                Trạng thái đơn hàng:
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-4 p-4  bg-white rounded-md">
                <h2 className="text-base font-semibold mb-4">Sản phẩm</h2>
                <div className="container items-start border border-spacing-2 rounded-md p-4">
                    <div className="flex mb-2 ">
                        <p className="text-sm">Vận đơn 1</p>
                        <p className="text-white text-xs p-1 ml-2 rounded-md bg-red-600">
                            ĐÃ HỦY
                        </p>
                    </div>
                    <div className="flex items-center">
                        <p className="text-blue-500 text-sm">
                            Xem chi tiết vận đơn{" "}
                        </p>
                        <BiChevronRight className="w-4 h-4 text-blue-500" />
                    </div>
                </div>
                <div className="flex  mt-4">
                    <div className=" border border-spacing-2 rounded-md">
                        <img
                            src="https://lh3.googleusercontent.com/Ezh1zisXToaMPP30pXE50dnotXpEyxnGsYpbd6uZc6jEWRWhMrMY2EDuXNcWPhw4nfcwwC-mGGVEkkRtRSJE0P3hRPuvCjw=rw"
                            alt="imageProduct"
                            className="w-20 h-20 "
                        />
                    </div>
                    <div className="ml-2">
                        <h2>Máy tính xách tay/Laptop Macbook Air 2020 (Xám)</h2>
                        <div className="flex  text-sm">
                            <div className="A ">
                                <p>SKU: 202333</p>
                                <p>Cung cấp bởi FusionTech</p>
                            </div>
                            <div className="B ml-96">
                                <p>18.590.000 VNĐ</p>
                                <p>X1</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 p-4 bg-white rounded-md grid gap-4 ">
                <div className="flex justify-between items-center">
                    <p className="text-muted text-sm text-zinc-500">
                        Tổng tạm tính
                    </p>
                    <p className="font-medium text-md text-zinc-600">
                        60.000.000 VNĐ
                    </p>
                </div>
                <div className="flex justify-between">
                    <p className="text-muted text-sm text-zinc-500">
                        Phí vận chuyển
                    </p>
                    <p className="font-medium text-md text-zinc-600">
                        Miễn phí
                    </p>
                </div>
                <div className="flex justify-between">
                    <p className="text-muted text-sm text-zinc-500">
                        Mã giảm giá
                    </p>
                    <p className="text-sm">ABCDEF</p>
                    <p className="font-medium text-md text-zinc-600">
                        -500.000 VNĐ
                    </p>
                </div>
                <div className="flex justify-between items-center ">
                    <p className="text-muted text-sm text-zinc-500  ">
                        Thành tiền
                    </p>
                    <p className="text-end font-bold text-red-600 text-lg">
                        50.500.000 VNĐ <br />
                        <span className="text-sm text-muted text-zinc-500 font-normal leading-tight">
                            (Đã bao gồm VAT)
                        </span>
                    </p>
                </div>
            </div>

            <div className="mt-4 p-4 bg-white rounded-md">
                <h2 className="text-base font-semibold mb-4">
                    Phương thức thanh toán
                </h2>
                <hr />
                <div className=" mt-4 mb-4 text-sm flex justify-between">
                    <p>Thanh toán khi nhận hàng</p>
                    <p>18.590.000 VNĐ</p>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;
