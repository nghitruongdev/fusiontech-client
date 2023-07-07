"use client";
import { Input } from "@components/ui/shadcn/input";
import CartList from "./CartList";
import { Button } from "@components/ui/shadcn/button";
import { Separator } from "@components/ui/shadcn/separator";
import { ICartItem } from "types";
import { Badge } from "@components/ui/shadcn/badge";
import { SaveButton } from "@refinedev/chakra-ui";
import { Spinner } from "@chakra-ui/react";
import ButtonPrimary from "@components/ButtonPrimary";
import { useSelectedCartItemStore } from "@components/store/cart/useSelectedItemStore";

const OrderOverview = ({}: // isSubmitting,
// checkoutHandler,
{
    // isSubmitting: boolean;
    // checkoutHandler: () => Promise<void> | void;
}) => {
    const cartItems = useSelectedCartItemStore((state) => state.items);
    const subTotal = cartItems
        .map((item) => 100 * item.quantity)
        .reduce((prev, curr) => prev + curr, 0);
    const discount = 0;
    const shippingFee = 0;
    const total = subTotal - discount + shippingFee;
    return (
        <>
            <div className="flex items-end justify-between font-semibold text-lg mt-4 py-2 mx-2">
                <h2 className="text-2xl font-[700]">Đơn hàng</h2>
                {/* <p className="text-2xl font-semibold">Đơn hàng</p> */}
                <a
                    className="text-blue-500 text-sm font-medium text-end mr-4"
                    href="/"
                >
                    Chỉnh sửa
                </a>
            </div>
            <div className="bg-white p-4 mx-2 rounded-lg shadow-md space-y-2">
                <CartList items={cartItems} />
                <div className="grid gap-4">
                    <div className="flex justify-between items-center">
                        <p className="text-muted text-sm text-zinc-500">
                            Tổng tạm tính
                        </p>
                        <p className="font-medium text-md text-zinc-600">
                            {subTotal} VNĐ
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
                        <div className="">
                            <p className="text-muted text-sm text-zinc-500">
                                Mã giảm giá
                            </p>
                            <Badge
                                className="text-xs font-base ml-2"
                                variant="outline"
                            >
                                ABCDEF
                            </Badge>
                        </div>

                        <p className="font-medium text-md text-red-500">
                            -500.000 VNĐ
                        </p>
                    </div>
                </div>

                <Separator />
                <div className="flex justify-between mb-3 mt-4 items-center">
                    <p className="text-muted text-sm text-zinc-500">
                        Thành tiền
                    </p>
                    <p className="text-end font-bold text-zinc-950 text-lg">
                        {total} <br />
                        <span className="text-sm text-muted text-zinc-500 font-normal leading-tight">
                            (Đã bao gồm VAT)
                        </span>
                    </p>
                </div>
                <button
                    className="flex items-center justify-center gap-4 w-full rounded-md bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white text-sm leading-loose font-[500] shadow-blue-500 shadow-md"
                    // onClick={checkoutHandler}
                    // disabled={isSubmitting}
                >
                    {/* {isSubmitting ? "Loading...." : "Xác nhận đặt hàng"} */}
                    {/* {isSubmitting && <Spinner size={"sm"} speed="0.3s" />} */}
                </button>
            </div>

            <div className="p-4 m-4 mx-2 rounded-lg bg-white shadow-md">
                <Discount />
            </div>
        </>
    );
};

const Discount = () => {
    return (
        <>
            <div className="">
                {" "}
                <p className="font-medium">Mã giảm giá</p>
                <p className="text-zinc-500 text-sm text-muted">
                    Nhập mã để được nhận giảm giá
                </p>
            </div>
            <hr className="my-2" />
            <div className="flex gap-2 mt-4">
                <Input placeholder="Mã giảm giá" className="shadow-md" />
                <Button className="bg-blue-600 hover:bg-blue-700 px-6 shadow-md shadow-blue-500">
                    Thêm
                </Button>
            </div>
        </>
    );
};
export default OrderOverview;
